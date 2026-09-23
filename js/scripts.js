document.addEventListener("DOMContentLoaded", () => {
  // 1. Funcionalidad de "Ver detalles" / "Ocultar detalles" en las tarjetas
  const botonesDetalles = document.querySelectorAll(".btn-detalles");

  botonesDetalles.forEach((boton) => {
    boton.addEventListener("click", () => {
      const tarjeta = boton.closest("article");
      const detalles = tarjeta.querySelector(".detalles-extra");

      if (detalles) {
        detalles.classList.toggle("activo");

        if (detalles.classList.contains("activo")) {
          boton.textContent = "Ocultar detalles";
        } else {
          boton.textContent = "Ver detalles";
        }
      }
    });
  });

  // 2. Funcionalidad de "Ver más proyectos" / "Ocultar proyectos"
  const btnVerMas = document.getElementById("ver-mas");
  const contenedorExtra = document.getElementById("proyectos-extra");

  if (btnVerMas && contenedorExtra) {
    const textoBoton = btnVerMas.querySelector(".texto-boton");

    btnVerMas.addEventListener("click", () => {
      const estaActivo = contenedorExtra.classList.toggle("activo");

      btnVerMas.setAttribute("aria-expanded", estaActivo);

      if (estaActivo) {
        if (textoBoton) textoBoton.textContent = "Ocultar proyectos";
      } else {
        if (textoBoton) textoBoton.textContent = "Ver más proyectos";
      }
    });
  }
});