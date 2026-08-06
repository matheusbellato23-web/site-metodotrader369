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

});
