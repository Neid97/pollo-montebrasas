/* ============================================================
   MAIN.JS — Comportamiento interactivo
   El HTML original de Tailwind no tenía JS funcional,
   solo clases utilitarias para hover/active.
   Aquí se agrega la lógica que CSS no puede manejar solo.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ──────────────────────────────────────────────────────────
     1. NAV INFERIOR — resaltar ítem activo al hacer clic
     Elimina --active del ítem anterior y se lo da al nuevo.
  ────────────────────────────────────────────────────────── */
  const navItems = document.querySelectorAll('.bottom-nav__item');

  navItems.forEach((item) => {
    item.addEventListener('click', () => {
      // Quitar estado activo del ítem previo
      navItems.forEach((i) => i.classList.remove('bottom-nav__item--active'));
      // Asignar al ítem clickeado
      item.classList.add('bottom-nav__item--active');
    });
  });


  /* ──────────────────────────────────────────────────────────
     2. CHIPS DE GUARNICIONES — toggle de selección
     Permite activar/desactivar cada chip individualmente.
  ────────────────────────────────────────────────────────── */
  const sideChips = document.querySelectorAll('.sides__chip');

  sideChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      chip.classList.toggle('sides__chip--active');
    });
  });


  /* ──────────────────────────────────────────────────────────
     3. BOTONES "Agregar al Pedido" — feedback visual
     En una app real aquí se conectaría el carrito.
     Por ahora da feedback visual temporal al usuario.
  ────────────────────────────────────────────────────────── */
  const addButtons = document.querySelectorAll('.menu-card__btn--primary');

  addButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const originalText = btn.textContent.trim();
      btn.textContent = '✓ Agregado';
      btn.disabled = true;

      setTimeout(() => {
        btn.textContent = originalText;
        btn.disabled = false;
      }, 1500);
    });
  });

});
