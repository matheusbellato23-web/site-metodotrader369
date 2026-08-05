/* ==========================================================================
   MÉTODO TRADER 369 — RECURSOS DE UX INTERATIVA (STYLE LUCAS TYLTY v10.0)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // 1. TRILHA INTERATIVA DE AULAS / PLAYER DE MÓDULOS
  const tabBtns = document.querySelectorAll('.course-tab-btn');
  const screenPanels = document.querySelectorAll('.course-screen-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab');

      // Remove active de todos os botões e painéis
      tabBtns.forEach(b => b.classList.remove('active'));
      screenPanels.forEach(p => p.classList.remove('active'));

      // Ativa o clicado
      btn.classList.add('active');
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });

  // 2. SIMULADOR INTERATIVO DE GESTÃO DE RISCO (SIMULADOR 369)
  const rangeCapital = document.getElementById('rangeCapital');
  const rangeRisco = document.getElementById('rangeRisco');
  const rangeRR = document.getElementById('rangeRR');

  const valCapital = document.getElementById('valCapital');
  const valRisco = document.getElementById('valRisco');
  const valRR = document.getElementById('valRR');
  const resLucro = document.getElementById('resLucro');

  function updateSimulador() {
    if (!rangeCapital || !rangeRisco || !rangeRR) return;

    const cap = parseFloat(rangeCapital.value);
    const riscoPerc = parseFloat(rangeRisco.value) / 100;
    const rrMulti = parseFloat(rangeRR.value);

    // Atualiza labels exibidos
    valCapital.textContent = `R$ ${cap.toLocaleString('pt-BR')}`;
    valRisco.textContent = `${rangeRisco.value}%`;
    valRR.textContent = `1 : ${rangeRR.value}`;

    // Cálculo em 20 trades (ex: 10 vitórias e 10 derrotas = 50% taxa de acerto)
    const riscoPorTrade = cap * riscoPerc;
    const ganhoPorTrade = riscoPorTrade * rrMulti;

    const totalGanhos = 10 * ganhoPorTrade;
    const totalPerdas = 10 * riscoPorTrade;
    const lucroLiquido = totalGanhos - totalPerdas;

    resLucro.textContent = `R$ +${lucroLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  if (rangeCapital && rangeRisco && rangeRR) {
    rangeCapital.addEventListener('input', updateSimulador);
    rangeRisco.addEventListener('input', updateSimulador);
    rangeRR.addEventListener('input', updateSimulador);
    updateSimulador(); // Executa inicial
  }

  // 3. ACCORDION DO FAQ
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
