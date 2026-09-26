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

  // 4. VALIDACIÓN DEL FORMULARIO DE CONTACTO EN TIEMPO REAL
  const formulario = document.querySelector("#contacto");

  if (formulario) {
      const nombre = document.querySelector("#nombre");
      const correo = document.querySelector("#correo");
      const mensaje = document.querySelector("#mensaje");
      const captchaMath = document.querySelector("#captcha-math");

      const errorNombre = document.querySelector("#error-nombre");
      const errorCorreo = document.querySelector("#error-correo");
      const errorMensaje = document.querySelector("#error-mensaje");
      const errorCaptcha = document.querySelector("#error-captcha");

      const exito = document.querySelector("#mensaje-exito");

      // Marca o limpia un campo y escribe su mensaje de error
      function marcar(campo, parrafo, texto) {
          parrafo.textContent = texto;
          if (texto === "") {
              campo.classList.remove("campo-invalido");
          } else {
              campo.classList.add("campo-invalido");
          }
      }

      // Funciones individuales de validación
      function validarNombre() {
          if (nombre.value.trim().length < 3) {
              marcar(nombre, errorNombre, "Escriba su nombre completo");
              return false;
          } else {
              marcar(nombre, errorNombre, "");
              return true;
          }
      }

      function validarCorreo() {
          const posArroba = correo.value.indexOf("@");
          if (correo.value.trim() === "") {
              marcar(correo, errorCorreo, "Escriba su correo");
              return false;
          } else if (posArroba === -1) {
              marcar(correo, errorCorreo, "Al correo le falta la arroba (@)");
              return false;
          } else if (correo.value.indexOf(".", posArroba) === -1) {
              marcar(correo, errorCorreo, "Al correo le falta el punto después de la arroba");
              return false;
          } else {
              marcar(correo, errorCorreo, "");
              return true;
          }
      }

      function validarMensaje() {
          if (mensaje.value.trim().length < 10) {
              marcar(mensaje, errorMensaje, "Escriba un mensaje de al menos 10 letras");
              return false;
          } else {
              marcar(mensaje, errorMensaje, "");
              return true;
          }
      }

      function validarCaptcha() {
          if (parseInt(captchaMath.value) !== 7) {
              marcar(captchaMath, errorCaptcha, "Respuesta incorrecta. Confirma que eres humano.");
              return false;
          } else {
              marcar(captchaMath, errorCaptcha, "");
              return true;
          }
      }

      // VALIDACIÓN EN TIEMPO REAL
      nombre.addEventListener("input", validarNombre);
      correo.addEventListener("input", validarCorreo);
      mensaje.addEventListener("input", validarMensaje);
      captchaMath.addEventListener("input", validarCaptcha);

      // Muestra el mensaje de éxito
      function mostrarExito(texto) {
          if (exito) {
              exito.textContent = texto;
              exito.classList.remove("oculto");
          }
      }

      // Esconde el mensaje de éxito
      function ocultarExito() {
          if (exito) {
              exito.textContent = "";
              exito.classList.add("oculto");
          }
      }

      // Evento de envío del formulario
      formulario.addEventListener("submit", function (evento) {
          evento.preventDefault();
          ocultarExito();

          const esNombreValido = validarNombre();
          const esCorreoValido = validarCorreo();
          const esMensajeValido = validarMensaje();
          const esCaptchaValido = validarCaptcha();

          if (esNombreValido && esCorreoValido && esMensajeValido && esCaptchaValido) {
              formulario.reset();
              mostrarExito("Datos completos. Escribame directo a edoncut@hotmail.com mientras conecto el envio.");
          }
      });
  }
});

// 5. FUNCIONES DE VENTANA MODAL (SERVICIOS)
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