import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Garante que o diretório data existe
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const LEADS_FILE = path.join(DATA_DIR, 'leads.json');
if (!fs.existsSync(LEADS_FILE)) {
  fs.writeFileSync(LEADS_FILE, JSON.stringify([], null, 2), 'utf8');
}

// Configuração do Transporter SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.hostinger.com',
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: (process.env.SMTP_SECURE === 'true' || process.env.SMTP_PORT === '465'),
  auth: {
    user: process.env.SMTP_USER || 'contato@metodotrader369.com.br',
    pass: process.env.SMTP_PASS || 'Vaso3238@'
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Verificação de conexão SMTP no startup
transporter.verify((error) => {
  if (error) {
    console.error('⚠️ [SMTP] Falha na conexão inicial com o servidor SMTP:', error.message);
  } else {
    console.log('✅ [SMTP] Servidor SMTP Hostinger conectado e pronto para envios!');
  }
});

// Rota de Healthcheck
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Rota de Captura de Leads (Fila de Espera dos Módulos Fechados)
app.post('/api/captura', async (req, res) => {
  try {
    const { nome, email, telefone, produto } = req.body;

    if (!nome || !email || !telefone) {
      return res.status(400).json({
        success: false,
        error: 'Campos obrigatórios ausentes: nome, email e telefone são necessários.'
      });
    }

    const produtoNome = produto || 'Módulo Fechado (Funding / Mentoria)';
    const cleanPhone = telefone.replace(/\D/g, '');
    const dataCadastro = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });

    const newLead = {
      id: Date.now().toString(),
      nome: nome.trim(),
      email: email.trim().toLowerCase(),
      telefone: telefone.trim(),
      cleanPhone,
      produto: produtoNome,
      createdAt: new Date().toISOString(),
      dataCadastro
    };

    // 1. Salva no banco de dados local (leads.json)
    try {
      const leads = JSON.parse(fs.readFileSync(LEADS_FILE, 'utf8') || '[]');
      leads.unshift(newLead);
      fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), 'utf8');
      console.log(`[Lead Salvo] ${nome} (${email}) - ${produtoNome}`);
    } catch (dbErr) {
      console.error('Erro ao salvar lead no JSON:', dbErr);
    }

    const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER || 'contato@metodotrader369.com.br';
    const waLink = `https://wa.me/55${cleanPhone.replace(/^55/, '')}?text=${encodeURIComponent(`Olá ${nome}, tudo bem? Vi que você entrou na lista de espera do ${produtoNome} do Método Trader 369!`)}`;

    // 2. Email para a Equipe / Administrador
    const adminMailOptions = {
      from: `"Método Trader 369" <${process.env.SMTP_USER || 'contato@metodotrader369.com.br'}>`,
      to: adminEmail,
      subject: `🔥 [Lista de Espera] Novo Lead: ${nome} — ${produtoNome}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0b0e14; color: #f3f4f6; padding: 30px; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid #1f2937;">
          <div style="text-align: center; margin-bottom: 25px;">
            <h2 style="color: #fbbf24; margin: 0; font-size: 24px; letter-spacing: 1px;">MÉTODO TRADER 369</h2>
            <p style="color: #9ca3af; font-size: 14px; margin-top: 5px;">Notificação de Novo Lead na Fila de Espera</p>
          </div>
          
          <div style="background-color: #111827; border: 1px solid #374151; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <p style="margin: 8px 0; font-size: 15px;"><strong style="color: #9ca3af;">Módulo Solicitado:</strong> <span style="color: #60a5fa; font-weight: bold;">${produtoNome}</span></p>
            <p style="margin: 8px 0; font-size: 15px;"><strong style="color: #9ca3af;">Nome Completo:</strong> <span style="color: #f3f4f6; font-weight: bold;">${nome}</span></p>
            <p style="margin: 8px 0; font-size: 15px;"><strong style="color: #9ca3af;">E-mail:</strong> <a href="mailto:${email}" style="color: #38bdf8; text-decoration: none;">${email}</a></p>
            <p style="margin: 8px 0; font-size: 15px;"><strong style="color: #9ca3af;">WhatsApp:</strong> <span style="color: #4ade80; font-weight: bold;">${telefone}</span></p>
            <p style="margin: 8px 0; font-size: 14px; color: #6b7280;"><strong>Data de Inscrição:</strong> ${dataCadastro}</p>
          </div>

          <div style="text-align: center; margin-top: 25px;">
            <a href="${waLink}" target="_blank" style="background: linear-gradient(135deg, #22c55e, #16a34a); color: #ffffff; text-decoration: none; padding: 12px 26px; border-radius: 8px; font-weight: bold; display: inline-block; box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);">
              💬 Chamar Lead no WhatsApp
            </a>
          </div>
        </div>
      `
    };

    // 3. Email de Confirmação para o Lead
    const leadMailOptions = {
      from: `"Método Trader 369" <${process.env.SMTP_USER || 'contato@metodotrader369.com.br'}>`,
      to: email,
      subject: `🎯 Confirmação: Você está na Lista de Espera do ${produtoNome}!`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #050507; color: #f9fafb; padding: 35px 20px; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #0d0f18; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
            
            <div style="text-align: center; margin-bottom: 25px;">
              <h1 style="color: #fbbf24; margin: 0; font-size: 22px; font-weight: 800; letter-spacing: 2px;">MÉTODO TRADER 369</h1>
              <p style="color: #6366f1; font-size: 13px; font-weight: 700; text-transform: uppercase; margin-top: 4px; letter-spacing: 1px;">Leitura Institucional & Performance</p>
            </div>

            <h2 style="font-size: 20px; color: #ffffff; margin-bottom: 12px;">Olá, ${nome}! 🎯</h2>
            
            <p style="color: #9ca3af; font-size: 15px; line-height: 1.6; margin-bottom: 18px;">
              Confirmamos com sucesso a sua inscrição na <strong>Fila de Espera VIP</strong> para o módulo:
            </p>

            <div style="background: rgba(99, 102, 241, 0.1); border: 1px solid rgba(99, 102, 241, 0.3); border-radius: 10px; padding: 14px 18px; margin-bottom: 22px; text-align: center;">
              <span style="color: #fbbf24; font-size: 18px; font-weight: bold;">⚡ ${produtoNome}</span>
            </div>

            <p style="color: #9ca3af; font-size: 15px; line-height: 1.6; margin-bottom: 25px;">
              Por estar na lista antecipada, você terá <strong>prioridade de acesso e condições especiais exclusivas</strong> assim que abrirmos novas vagas.
            </p>

            <div style="background-color: #161a29; border-radius: 10px; padding: 18px; margin-bottom: 25px; border-left: 4px solid #f0a500;">
              <p style="margin: 0; color: #e5e7eb; font-size: 14px; line-height: 1.5;">
                💡 <strong>Dica:</strong> Fique atento ao seu WhatsApp (<strong>${telefone}</strong>) e à sua caixa de entrada para não perder o aviso de abertura.
              </p>
            </div>

            <div style="text-align: center; margin-top: 30px;">
              <a href="https://wa.me/5513997862359?text=${encodeURIComponent(`Olá! Me cadastrei na fila de espera do ${produtoNome} do Método Trader 369.`)}" target="_blank" style="background: linear-gradient(135deg, #25d366, #128c7e); color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 10px; font-weight: bold; display: inline-block; font-size: 15px; box-shadow: 0 6px 20px rgba(37, 211, 102, 0.3);">
                Falar com a Equipe no WhatsApp
              </a>
            </div>

            <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.06); margin: 30px 0 15px;" />
            <p style="text-align: center; color: #4b5563; font-size: 12px; margin: 0;">
              © 2025 Método Trader 369 • Todos os direitos reservados.
            </p>
          </div>
        </div>
      `
    };

    // Dispara os envios em paralelo
    const [adminResult, leadResult] = await Promise.allSettled([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(leadMailOptions)
    ]);

    if (adminResult.status === 'rejected') {
      console.error('Falha ao enviar email admin:', adminResult.reason);
    }
    if (leadResult.status === 'rejected') {
      console.error('Falha ao enviar email lead:', leadResult.reason);
    }

    return res.json({
      success: true,
      message: 'Inscrição realizada com sucesso! Você está na lista de espera.',
      leadId: newLead.id
    });

  } catch (error) {
    console.error('Erro na rota /api/captura:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro interno ao processar a inscrição na lista de espera.'
    });
  }
});

// Serve arquivos estáticos da pasta dist (se compilado) ou da raiz
const DIST_DIR = path.join(__dirname, 'dist');
if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR));
  app.get('/captura', (req, res) => {
    res.sendFile(path.join(DIST_DIR, 'captura.html'));
  });
  app.get('*', (req, res) => {
    res.sendFile(path.join(DIST_DIR, 'index.html'));
  });
} else {
  app.use(express.static(__dirname));
  app.use('/src', express.static(path.join(__dirname, 'src')));
  app.get('/captura', (req, res) => {
    res.sendFile(path.join(__dirname, 'captura.html'));
  });
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor Método Trader 369 rodando na porta ${PORT}`);
  console.log(`🔗 Endpoint de captura: POST http://localhost:${PORT}/api/captura`);
});
