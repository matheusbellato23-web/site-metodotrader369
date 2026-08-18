/* ==========================================================================
   MÉTODO TRADER 369 — PRELOADER IMERSIVO & RECURSOS INTERATIVOS (v17.0)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // 1. TELA DE CARREGAMENTO IMERSIVA (PRELOADER TERMINAL 369)
  const preloader = document.getElementById('preloader');
  const preloaderBar = document.getElementById('preloaderBar');
  const preloaderStatus = document.getElementById('preloaderStatus');
  const preloaderPerc = document.getElementById('preloaderPerc');

  if (preloader && preloaderBar && preloaderStatus && preloaderPerc) {
    const statusMessages = [
      "INICIALIZANDO AMBIENTE INSTITUCIONAL...",
      "CARREGANDO CONTEXTO ALGORÍTMICO (IPDA)...",
      "MAPEANDO ZONAS DE LIQUIDEZ E CRT...",
      "VALIDANDO CHECKLIST FRAMEWORK 369...",
      "BEM-VINDO AO MÉTODO TRADER 369."
    ];

    let progress = 0;
    let messageIndex = 0;

    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 12) + 8;
      if (progress > 100) progress = 100;

      preloaderBar.style.width = `${progress}%`;
      preloaderPerc.textContent = `${progress}%`;

      if (progress > 25 && messageIndex === 0) {
        messageIndex = 1;
        preloaderStatus.textContent = statusMessages[1];
      } else if (progress > 55 && messageIndex === 1) {
        messageIndex = 2;
        preloaderStatus.textContent = statusMessages[2];
      } else if (progress > 80 && messageIndex === 2) {
        messageIndex = 3;
        preloaderStatus.textContent = statusMessages[3];
      } else if (progress >= 100) {
        messageIndex = 4;
        preloaderStatus.textContent = statusMessages[4];
        clearInterval(interval);

        // Suave desaparecimento do preloader
        setTimeout(() => {
          preloader.classList.add('preloader-hidden');
          setTimeout(() => {
            preloader.style.display = 'none';
          }, 600);
        }, 350);
      }
    }, 100);
  }

  // 2. ACCORDION DO FAQ
  const faqBtns = document.querySelectorAll('.faq-question-btn');

  faqBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const parent = btn.parentElement;
      const isActive = parent.classList.contains('active');

      document.querySelectorAll('.faq-item-card').forEach(item => {
        item.classList.remove('active');
      });

      if (!isActive) {
        parent.classList.add('active');
      }
    });
  });

  // 3. MODAL DE LISTA DE ESPERA / CAPTURA (FUNDING & MENTORIA)
  const waitlistModal = document.getElementById('waitlistModal');
  const waitlistModalClose = document.getElementById('waitlistModalClose');
  const modalBadge = document.getElementById('modalProductBadge');
  const modalBadgeText = document.getElementById('modalProductBadgeText');
  const modalForm = document.getElementById('modalWaitlistForm');
  const modalSubmitBtn = document.getElementById('modalSubmitBtn');
  const modalFormContainer = document.getElementById('modalFormContainer');
  const modalSuccessWrap = document.getElementById('modalSuccessWrap');
  const modalSuccessWaBtn = document.getElementById('modalSuccessWaBtn');
  const modalTelefone = document.getElementById('modalTelefone');

  let currentProduct = 'Funding (Trader Financiado)';

  // Máscara de telefone no modal
  if (modalTelefone) {
    modalTelefone.addEventListener('input', function(e) {
      let v = e.target.value.replace(/\D/g, '');
      if (v.length > 11) v = v.slice(0, 11);
      if (v.length > 10) {
        e.target.value = `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7)}`;
      } else if (v.length > 6) {
        e.target.value = `(${v.slice(0, 2)}) ${v.slice(2, 6)}-${v.slice(6)}`;
      } else if (v.length > 2) {
        e.target.value = `(${v.slice(0, 2)}) ${v.slice(2)}`;
      } else if (v.length > 0) {
        e.target.value = `(${v}`;
      } else {
        e.target.value = '';
      }
    });
  }

  function openWaitlistModal(produtoNome, iconClass = 'fas fa-lock') {
    currentProduct = produtoNome;
    if (modalBadgeText) modalBadgeText.textContent = produtoNome;
    if (modalBadge) {
      modalBadge.innerHTML = `<i class="${iconClass}"></i> <span>${produtoNome}</span>`;
    }
    if (modalForm) modalForm.reset();
    if (modalFormContainer) modalFormContainer.style.display = 'block';
    if (modalSuccessWrap) modalSuccessWrap.classList.remove('visible');
    if (waitlistModal) waitlistModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeWaitlistModal() {
    if (waitlistModal) waitlistModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Botoes da esteira de produtos
  const btnFunding = document.getElementById('btn-funding-waitlist');
  if (btnFunding) {
    btnFunding.addEventListener('click', (e) => {
      e.preventDefault();
      openWaitlistModal('Funding (Trader Financiado)', 'fas fa-chart-line');
    });
  }

  const btnMentoria = document.getElementById('btn-mentoria-waitlist');
  if (btnMentoria) {
    btnMentoria.addEventListener('click', (e) => {
      e.preventDefault();
      openWaitlistModal('Mentoria Exclusiva (1:1 com César)', 'fas fa-crown');
    });
  }

  if (waitlistModalClose) {
    waitlistModalClose.addEventListener('click', closeWaitlistModal);
  }

  if (waitlistModal) {
    waitlistModal.addEventListener('click', (e) => {
      if (e.target === waitlistModal) {
        closeWaitlistModal();
      }
    });
  }

  // Envio do formulário do Modal via SMTP
  if (modalForm) {
    modalForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nome = document.getElementById('modalNome')?.value.trim();
      const email = document.getElementById('modalEmail')?.value.trim();
      const telefone = document.getElementById('modalTelefone')?.value.trim();

      if (!nome || !email || !telefone) {
        alert('Por favor, preencha todos os campos.');
        return;
      }

      if (!email.includes('@') || !email.includes('.')) {
        alert('Por favor, insira um e-mail válido.');
        return;
      }

      const rawDigits = telefone.replace(/\D/g, '');
      if (rawDigits.length < 10) {
        alert('Por favor, insira um telefone válido com DDD (ex: 11 99999-9999).');
        return;
      }

      modalSubmitBtn.disabled = true;
      const originalHtml = modalSubmitBtn.innerHTML;
      modalSubmitBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Confirmando...';

      try {
        const res = await fetch('/api/captura', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nome,
            email,
            telefone,
            produto: currentProduct
          })
        });
        const data = await res.json();

        const cleanDigits = rawDigits.replace(/^55/, '');
        const msg = encodeURIComponent(
          `Olá César! Me cadastrei na lista de espera do ${currentProduct} do Método Trader 369.\n\n` +
          `👤 Nome: ${nome}\n` +
          `📧 E-mail: ${email}\n` +
          `📱 WhatsApp: ${telefone}`
        );
        const waUrl = `https://wa.me/5513997862359?text=${msg}`;

        if (modalSuccessWaBtn) modalSuccessWaBtn.href = waUrl;
        if (modalFormContainer) modalFormContainer.style.display = 'none';
        if (modalSuccessWrap) modalSuccessWrap.classList.add('visible');

      } catch (err) {
        console.error('Erro no envio:', err);
        const msg = encodeURIComponent(
          `Olá! Gostaria de entrar na lista de espera do ${currentProduct} do Método Trader 369.\n\n` +
          `Nome: ${nome}\nE-mail: ${email}\nWhatsApp: ${telefone}`
        );
        const waUrl = `https://wa.me/5513997862359?text=${msg}`;
        if (modalSuccessWaBtn) modalSuccessWaBtn.href = waUrl;
        if (modalFormContainer) modalFormContainer.style.display = 'none';
        if (modalSuccessWrap) modalSuccessWrap.classList.add('visible');
      } finally {
        modalSubmitBtn.disabled = false;
        modalSubmitBtn.innerHTML = originalHtml;
      }
    });
  }

});

