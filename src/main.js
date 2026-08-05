/* ==========================================================================
   MÉTODO TRADER 369 — SCRIPT INTERATIVO (MODELO CAIRO TRADER)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // Accordion FAQ Toggle
  const faqQuestions = document.querySelectorAll('.faq-cairo-q');

  faqQuestions.forEach((q) => {
    q.addEventListener('click', () => {
      const parent = q.parentElement;
      const isActive = parent.classList.contains('active');

      // Close all active FAQ items
      document.querySelectorAll('.faq-cairo-item').forEach((item) => {
        item.classList.remove('active');
      });

      // Open clicked item if it wasn't active
      if (!isActive) {
        parent.classList.add('active');
      }
    });
  });

});
