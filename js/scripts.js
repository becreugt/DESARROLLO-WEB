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

  // 3. EFECTO TIPO MECANOGRAFÍA (TYPEWRITER)
  const elementoTexto = document.getElementById("texto-tipeado");
  if (elementoTexto) {
    const frases = [
      "Bienvenido a mi espacio personal.",
      "Especialista en Ingeniería de Datos.",
      "Desarrollador Web en formación.",
      "Transformo datos masivos en soluciones digitales."
    ];
    let fraseIndex = 0;
    let charIndex = 0;
    let borrando = false;

    function tipear() {
      const fraseActual = frases[fraseIndex];

      if (borrando) {
        elementoTexto.textContent = fraseActual.substring(0, charIndex - 1);
        charIndex--;
      } else {
        elementoTexto.textContent = fraseActual.substring(0, charIndex + 1);
        charIndex++;
      }

      let velocidad = borrando ? 35 : 70;

      if (!borrando && charIndex === fraseActual.length) {
        velocidad = 2200; // Pausa con la frase completa
        borrando = true;
      } else if (borrando && charIndex === 0) {
        borrando = false;
        fraseIndex = (fraseIndex + 1) % frases.length;
        velocidad = 400;
      }

      setTimeout(tipear, velocidad);
    }

    tipear();
  }
});

// 4. FUNCIONES DE VENTANA MODAL (SERVICIOS)
function abrirModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.add("activo");
}

function cerrarModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.remove("activo");
}

function cerrarModalAfuera(event, id) {
  if (event.target.classList.contains("modal-overlay")) {
    cerrarModal(id);
  }
}