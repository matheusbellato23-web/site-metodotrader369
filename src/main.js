/* ==========================================================================
   MÉTODO TRADER 369 — PRELOADER IMERSIVO & RECURSOS INTERATIVOS (v22.0)
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

  // 3. ACCORDION DA GRADE CURRICULAR (MÓDULOS 01 A 06)
  const curHeaders = document.querySelectorAll('.curriculum-item-header');
  curHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const card = header.closest('.curriculum-item-card');
      if (!card) return;
      
      const isCurrentlyActive = card.classList.contains('active');

      // Opcional: fechar outros módulos se quiser estilo exclusivo
      document.querySelectorAll('.curriculum-item-card').forEach(c => {
        c.classList.remove('active');
      });

      if (!isCurrentlyActive) {
        card.classList.add('active');
      }
    });
  });

  // 4. SIMULADOR INTERATIVO DE GESTÃO INSTITUCIONAL (R:R 1:3)
  const simCapitalRange = document.getElementById('simCapitalRange');
  const simRiskRange = document.getElementById('simRiskRange');
  const simWinRateRange = document.getElementById('simWinRateRange');
  const simTradesRange = document.getElementById('simTradesRange');

  const simCapitalVal = document.getElementById('simCapitalVal');
  const simRiskVal = document.getElementById('simRiskVal');
  const simWinRateVal = document.getElementById('simWinRateVal');
  const simTradesVal = document.getElementById('simTradesVal');

  const simProfit369 = document.getElementById('simProfit369');
  const simPerc369 = document.getElementById('simPerc369');
  const simMath369 = document.getElementById('simMath369');

  const simProfitRetail = document.getElementById('simProfitRetail');
  const simPercRetail = document.getElementById('simPercRetail');
  const simMathRetail = document.getElementById('simMathRetail');

  function updateRiskSimulator() {
    if (!simCapitalRange || !simRiskRange || !simWinRateRange || !simTradesRange) return;

    const capital = parseFloat(simCapitalRange.value);
    const riskPerc = parseFloat(simRiskRange.value);
    const winRate = parseFloat(simWinRateRange.value);
    const totalTrades = parseInt(simTradesRange.value, 10);

    // Labels update
    if (simCapitalVal) simCapitalVal.textContent = `R$ ${capital.toLocaleString('pt-BR')}`;
    if (simRiskVal) simRiskVal.textContent = `${riskPerc.toFixed(1)}%`;
    if (simWinRateVal) simWinRateVal.textContent = `${winRate}%`;
    if (simTradesVal) simTradesVal.textContent = `${totalTrades} Operações`;

    // Calculations
    const riskAmount = capital * (riskPerc / 100);
    const wins = Math.round(totalTrades * (winRate / 100));
    const losses = totalTrades - wins;

    // Método 369: R:R 1:3 (Cada win ganha 3x o risco)
    const profit369 = (wins * riskAmount * 3) - (losses * riskAmount);
    const perc369 = (profit369 / capital) * 100;

    // Varejo Tradicional: R:R 1:0.5 (Arrisca 1 para buscar 0.5)
    const profitRetail = (wins * riskAmount * 0.5) - (losses * riskAmount);
    const percRetail = (profitRetail / capital) * 100;

    // Update Método 369 UI
    if (simProfit369) {
      const sign = profit369 >= 0 ? '+ ' : '- ';
      simProfit369.textContent = `${sign}R$ ${Math.abs(profit369).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      simProfit369.className = `sim-profit ${profit369 >= 0 ? 'text-emerald' : 'text-red'}`;
    }
    if (simPerc369) {
      const sign = perc369 >= 0 ? '+' : '';
      simPerc369.textContent = `${sign}${perc369.toFixed(1)}%`;
      simPerc369.className = `sim-perc ${perc369 >= 0 ? 'text-emerald' : 'text-red'}`;
    }
    if (simMath369) {
      const totalGain369 = wins * riskAmount * 3;
      const totalLoss = losses * riskAmount;
      simMath369.textContent = `${wins} Acertos (+R$ ${totalGain369.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}) | ${losses} Erros (-R$ ${totalLoss.toLocaleString('pt-BR', { minimumFractionDigits: 0 })})`;
    }

    // Update Varejo UI
    if (simProfitRetail) {
      const sign = profitRetail >= 0 ? '+ ' : '- ';
      simProfitRetail.textContent = `${sign}R$ ${Math.abs(profitRetail).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      simProfitRetail.className = `sim-profit ${profitRetail >= 0 ? 'text-emerald' : 'text-red'}`;
    }
    if (simPercRetail) {
      const sign = percRetail >= 0 ? '+' : '';
      simPercRetail.textContent = `${sign}${percRetail.toFixed(1)}%`;
      simPercRetail.className = `sim-perc ${percRetail >= 0 ? 'text-emerald' : 'text-red'}`;
    }
    if (simMathRetail) {
      const totalGainRetail = wins * riskAmount * 0.5;
      const totalLoss = losses * riskAmount;
      simMathRetail.textContent = `${wins} Acertos (+R$ ${totalGainRetail.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}) | ${losses} Erros (-R$ ${totalLoss.toLocaleString('pt-BR', { minimumFractionDigits: 0 })})`;
    }
  }

  if (simCapitalRange && simRiskRange && simWinRateRange && simTradesRange) {
    simCapitalRange.addEventListener('input', updateRiskSimulator);
    simRiskRange.addEventListener('input', updateRiskSimulator);
    simWinRateRange.addEventListener('input', updateRiskSimulator);
    simTradesRange.addEventListener('input', updateRiskSimulator);
    updateRiskSimulator(); // Execução inicial
  }

});
