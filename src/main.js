/* ==========================================================================
   MÉTODO TRADER 369 — PRELOADER IMERSIVO & RECURSOS INTERATIVOS (v21.0)
   Experiência Visual Interativa do Mentor César & Terminal Institucional
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

  // 2. HERO INTERACTIVE PERSPECTIVE SWITCHER
  const heroChips = document.querySelectorAll('.hero-chip');
  const heroImg = document.getElementById('heroMentorImg');
  const heroTagTxt = document.getElementById('heroMentorTagTxt');
  const heroAlgoVal = document.getElementById('heroDataAlgo');
  const heroHud1Val = document.getElementById('heroHud1Val');
  const heroHud2Val = document.getElementById('heroHud2Val');

  if (heroChips.length > 0 && heroImg) {
    heroChips.forEach(chip => {
      chip.addEventListener('click', () => {
        if (chip.classList.contains('active')) return;

        heroChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');

        const newSrc = chip.getAttribute('data-src');
        const newTag = chip.getAttribute('data-tag');
        const newAlgo = chip.getAttribute('data-algo');
        const stat1 = chip.getAttribute('data-stat1');
        const stat2 = chip.getAttribute('data-stat2');

        // Transição suave de fade
        heroImg.classList.add('img-fading');
        setTimeout(() => {
          heroImg.src = newSrc;
          if (heroTagTxt && newTag) heroTagTxt.textContent = newTag;
          if (heroAlgoVal && newAlgo) heroAlgoVal.textContent = newAlgo;
          if (heroHud1Val && stat1) heroHud1Val.textContent = stat1;
          if (heroHud2Val && stat2) heroHud2Val.textContent = stat2;

          heroImg.onload = () => {
            heroImg.classList.remove('img-fading');
          };
          // Fallback se já estiver em cache
          setTimeout(() => heroImg.classList.remove('img-fading'), 200);
        }, 180);
      });
    });
  }

  // 3. INTERACTIVE MENTOR SHOWCASE HUB (4-TAB SYSTEM + HOTSPOTS)
  const mentorTabs = document.querySelectorAll('.mentor-tab-btn');
  const mentorActiveImg = document.getElementById('mentorActiveImg');
  const mentorStatusText = document.getElementById('mentorStatusText');
  const mentorPanes = document.querySelectorAll('.mentor-tab-pane');
  const hotspotsLayer = document.getElementById('mentorHotspots');

  // Hotspots personalizados por aba
  const tabHotspotsConfig = {
    setup: [
      {
        top: '32%', left: '42%',
        icon: 'fa-crosshairs',
        title: 'Monitor Widescreen Institucional',
        desc: 'Mapeamento de Liquidez (BSL & SSL) e Pools Interbancárias sem indicadores defasados.'
      },
      {
        top: '68%', left: '24%',
        icon: 'fa-check-double',
        title: 'Checklist T.R.A.D.E.R. 369',
        desc: 'Validação obrigatória de 6 etapas antes de posicionar qualquer ordem.'
      },
      {
        top: '28%', right: '18%', left: 'auto',
        icon: 'fa-bolt',
        title: 'Técnica CRT (Romeo)',
        desc: 'Rastreamento da manipulação dos grandes players para entradas com stop reduzido.'
      }
    ],
    rotina: [
      {
        top: '40%', left: '35%',
        icon: 'fa-mug-hot',
        title: 'Estudo Pré-Abertura',
        desc: 'Análise minuciosa de notícias, range asiático e liquidez pendente às 8h.'
      },
      {
        top: '65%', left: '55%',
        icon: 'fa-book-bookmark',
        title: 'Diário de Trade',
        desc: 'Registro 100% estruturado de cada operação para validação contínua.'
      }
    ],
    mentoria: [
      {
        top: '30%', left: '48%',
        icon: 'fa-headset',
        title: 'Sessões 1:1 Diretas',
        desc: 'Alinhamento individual de mentalidade e correção técnica na tela.'
      },
      {
        top: '70%', left: '35%',
        icon: 'fa-users-gear',
        title: 'Sala ao Vivo Seg a Sáb',
        desc: 'Orientação de contexto em tempo real com toda a comunidade.'
      }
    ],
    visao: [
      {
        top: '35%', left: '50%',
        icon: 'fa-award',
        title: '6 Anos de Validação',
        desc: 'Metodologia testada e aprovada nos mercados de B3, Forex e Cripto.'
      },
      {
        top: '65%', left: '38%',
        icon: 'fa-shield-halved',
        title: 'Gestão R:R 1:3+',
        desc: 'Rigorosa proteção de capital focada na consistência de longo prazo.'
      }
    ]
  };

  function renderHotspots(tabKey) {
    if (!hotspotsLayer) return;
    const items = tabHotspotsConfig[tabKey] || [];
    hotspotsLayer.innerHTML = '';

    items.forEach((item, idx) => {
      const spot = document.createElement('div');
      spot.className = `mentor-hotspot hotspot-${idx + 1}`;
      spot.style.top = item.top;
      if (item.left && item.left !== 'auto') spot.style.left = item.left;
      if (item.right && item.right !== 'auto') spot.style.right = item.right;

      spot.innerHTML = `
        <span class="hotspot-pulse"></span>
        <button type="button" class="hotspot-trigger" aria-label="Detalhe ${item.title}">
          <i class="fas ${item.icon}"></i>
        </button>
        <div class="hotspot-tooltip">
          <strong>${item.title}</strong>
          <p>${item.desc}</p>
        </div>
      `;

      const btn = spot.querySelector('.hotspot-trigger');
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        spot.classList.toggle('active');
      });

      hotspotsLayer.appendChild(spot);
    });
  }

  if (mentorTabs.length > 0 && mentorActiveImg) {
    mentorTabs.forEach(tabBtn => {
      tabBtn.addEventListener('click', () => {
        if (tabBtn.classList.contains('active')) return;

        const tabKey = tabBtn.getAttribute('data-tab');
        const imgSrc = tabBtn.getAttribute('data-img');
        const statusTxt = tabBtn.getAttribute('data-status');

        mentorTabs.forEach(b => b.classList.remove('active'));
        tabBtn.classList.add('active');

        // Transição da imagem
        mentorActiveImg.classList.add('fading');
        setTimeout(() => {
          mentorActiveImg.src = imgSrc;
          if (mentorStatusText && statusTxt) {
            mentorStatusText.textContent = statusTxt;
          }

          // Atualiza os hotspots para o contexto da foto
          renderHotspots(tabKey);

          mentorActiveImg.onload = () => {
            mentorActiveImg.classList.remove('fading');
          };
          setTimeout(() => mentorActiveImg.classList.remove('fading'), 200);
        }, 180);

        // Transição do painel de texto
        mentorPanes.forEach(pane => {
          pane.classList.remove('active');
          if (pane.id === `pane-${tabKey}`) {
            pane.classList.add('active');
          }
        });
      });
    });

    // Renderiza hotspots iniciais
    renderHotspots('setup');
  }

  // 4. ACCORDION DO FAQ
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
