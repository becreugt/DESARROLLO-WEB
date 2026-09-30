document.addEventListener("DOMContentLoaded", () => {

  // 0. CALCULAR AÑOS Y ANIMAR CONTADOR DE EXPERIENCIA (COLEGIACIÓN DESDE 25/05/2011)
  const elementoContador = document.getElementById("contador-anos");
  
  if (elementoContador) {
    const fechaColegiacion = new Date(2011, 4, 25); // Mes 4 es Mayo (0-indexado)
    const hoy = new Date();

    let anosExperiencia = hoy.getFullYear() - fechaColegiacion.getFullYear();
    const diferenciaMeses = hoy.getMonth() - fechaColegiacion.getMonth();

    if (diferenciaMeses < 0 || (diferenciaMeses === 0 && hoy.getDate() < fechaColegiacion.getDate())) {
      anosExperiencia--;
    }

    let animado = false;

    const animarContador = () => {
      let inicio = 0;
      const duracion = 1500;
      const incremento = anosExperiencia / (duracion / 16);

      const timer = setInterval(() => {
        inicio += incremento;
        if (inicio >= anosExperiencia) {
          elementoContador.textContent = `+${anosExperiencia}`;
          clearInterval(timer);
        } else {
          elementoContador.textContent = `+${Math.floor(inicio)}`;
        }
      }, 16);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !animado) {
          animado = true;
          animarContador();
        }
      });
    }, { threshold: 0.4 });

    observer.observe(elementoContador);
  }

  // 1. CARGA DINÁMICA DE PROYECTOS DESDE EL ARCHIVO PROYECTOS.JSON
  const contenedorPrincipales = document.getElementById("contenedor-proyectos-principales");
  const contenedorExtra = document.getElementById("contenedor-proyectos-extra");

  if (contenedorPrincipales && contenedorExtra) {
    fetch("proyectos.json")
      .then((respuesta) => respuesta.json())
      .then((proyectos) => {
        proyectos.forEach((proyecto) => {
          const tarjetaHTML = `
            <article class="tarjeta-proyecto">
              <div class="contenido-tarjeta">
                <h3>${proyecto.titulo}</h3>
                <p>${proyecto.descripcion}</p>
                <div class="detalles-extra">
                  <p><strong>Stack:</strong> ${proyecto.stack}</p>
                  <p>${proyecto.impacto}</p>
                </div>
              </div>
              <button type="button" class="btn-proyecto btn-detalles">Ver detalles</button>
            </article>
          `;

          if (proyecto.extra) {
            contenedorExtra.insertAdjacentHTML("beforeend", tarjetaHTML);
          } else {
            contenedorPrincipales.insertAdjacentHTML("beforeend", tarjetaHTML);
          }
        });
      })
      .catch((error) => console.error("Error al cargar los proyectos desde JSON:", error));
  }

  // DELEGACIÓN DE EVENTOS PARA EL BOTÓN "VER DETALLES" EN ELEMENTOS DINÁMICOS
  document.addEventListener("click", (e) => {
    if (e.target && e.target.classList.contains("btn-detalles")) {
      const boton = e.target;
      const tarjeta = boton.closest("article");
      const detalles = tarjeta.querySelector(".detalles-extra");

      if (detalles) {
        detalles.classList.toggle("activo");
        boton.textContent = detalles.classList.contains("activo") ? "Ocultar detalles" : "Ver detalles";
      }
    }
  });

  // 2. FUNCIONALIDAD "VER MÁS PROYECTOS"
  const btnVerMas = document.getElementById("ver-mas");
  const desplegableExtra = document.getElementById("proyectos-extra");

  if (btnVerMas && desplegableExtra) {
    const textoBoton = btnVerMas.querySelector(".texto-boton");

    btnVerMas.addEventListener("click", () => {
      const estaActivo = desplegableExtra.classList.toggle("activo");
      btnVerMas.setAttribute("aria-expanded", estaActivo);

      if (textoBoton) {
        textoBoton.textContent = estaActivo ? "Ocultar proyectos" : "Ver más proyectos";
      }
    });
  }

  // 3. COPIAR CORREO AL PORTAPAPELES (ANTI-SPAM)
  const btnCopiarCorreo = document.getElementById("btn-copiar-correo");

  if (btnCopiarCorreo) {
    btnCopiarCorreo.addEventListener("click", () => {
      const correo = btnCopiarCorreo.getAttribute("data-email");

      if (navigator.clipboard) {
        navigator.clipboard.writeText(correo).then(() => {
          const textoSpan = btnCopiarCorreo.querySelector(".texto");
          const textoOriginal = textoSpan.textContent;

          textoSpan.textContent = "¡Correo Copiado!";
          btnCopiarCorreo.classList.add("copiado");

          setTimeout(() => {
            textoSpan.textContent = textoOriginal;
            btnCopiarCorreo.classList.remove("copiado");
          }, 2000);
        });
      }
    });
  }

  // 4. EFECTO MECANOGRAFÍA (TYPEWRITER)
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
        velocidad = 2200;
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

  // 5. VALIDACIÓN RIGUROSA Y ENVÍO AJAX (FETCH)
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

    function marcar(campo, parrafo, texto) {
      if (parrafo) parrafo.textContent = texto;
      if (campo) {
        if (texto === "") {
          campo.classList.remove("campo-invalido");
        } else {
          campo.classList.add("campo-invalido");
        }
      }
    }

    function esTextoRepetitivo(texto) {
      const limpio = texto.replace(/\s+/g, "");
      if (limpio.length === 0) return true;
      return /^([a-zA-Z0-9])\1+$/.test(limpio);
    }

    function validarNombre() {
      if (!nombre) return false;
      const valor = nombre.value.trim();
      const regexNombre = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+(\s+[a-zA-ZáéíóúÁÉÍÓÚñÑ]+)+$/;

      if (valor === "") {
        marcar(nombre, errorNombre, "Escriba su nombre completo");
        return false;
      } else if (esTextoRepetitivo(valor)) {
        marcar(nombre, errorNombre, "Ingrese un nombre válido, no letras repetidas");
        return false;
      } else if (!regexNombre.test(valor)) {
        marcar(nombre, errorNombre, "Ingrese nombre y apellido (solo letras)");
        return false;
      } else {
        marcar(nombre, errorNombre, "");
        return true;
      }
    }

    function validarCorreo() {
      if (!correo) return false;
      const valor = correo.value.trim();
      const regexCorreo = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

      if (valor === "") {
        marcar(correo, errorCorreo, "Escriba su correo electrónico");
        return false;
      } else if (!regexCorreo.test(valor)) {
        marcar(correo, errorCorreo, "Ingrese un correo válido (ejemplo: usuario@dominio.com)");
        return false;
      } else {
        marcar(correo, errorCorreo, "");
        return true;
      }
    }

    function validarMensaje() {
      if (!mensaje) return false;
      const valor = mensaje.value.trim();
      const palabras = valor.split(/\s+/).filter((p) => p.length > 0);

      if (valor === "") {
        marcar(mensaje, errorMensaje, "Escriba su mensaje");
        return false;
      } else if (esTextoRepetitivo(valor)) {
        marcar(mensaje, errorMensaje, "El mensaje no puede ser texto repetitivo");
        return false;
      } else if (valor.length < 15 || palabras.length < 3) {
        marcar(mensaje, errorMensaje, "El mensaje debe tener al menos 15 caracteres y 3 palabras");
        return false;
      } else {
        marcar(mensaje, errorMensaje, "");
        return true;
      }
    }

    function validarCaptcha() {
      if (!captchaMath || parseInt(captchaMath.value) !== 7) {
        marcar(captchaMath, errorCaptcha, "Respuesta incorrecta. Confirma que eres humano.");
        return false;
      } else {
        marcar(captchaMath, errorCaptcha, "");
        return true;
      }
    }

    if (nombre) nombre.addEventListener("input", validarNombre);
    if (correo) correo.addEventListener("input", validarCorreo);
    if (mensaje) mensaje.addEventListener("input", validarMensaje);
    if (captchaMath) captchaMath.addEventListener("input", validarCaptcha);

    // PROCESAMIENTO AJAX CON FETCH Y ESTRUCTURA JSON
    formulario.addEventListener("submit", function (evento) {
      evento.preventDefault();

      const esNombreValido = validarNombre();
      const esCorreoValido = validarCorreo();
      const esMensajeValido = validarMensaje();
      const esCaptchaValido = validarCaptcha();

      if (esNombreValido && esCorreoValido && esMensajeValido && esCaptchaValido) {
        
        const datos = {
          name: nombre.value.trim(),
          email: correo.value.trim(),
          message: mensaje.value.trim(),
          _subject: "Nuevo contacto desde el Sitio Web",
          _captcha: "false"
        };

        fetch("https://formsubmit.co/ajax/edoncut@hotmail.com", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify(datos)
        })
          .then(function (respuesta) {
            if (respuesta.ok) {
              return respuesta.json();
            }
            throw new Error("Estado de respuesta: " + respuesta.status);
          })
          .then(function (datos) {
            formulario.reset();
            animarTextoExito("¡Mensaje enviado con éxito! Te responderé pronto.");
            abrirModal("modal-exito");
          })
          .catch(function (error) {
            console.error("Detalle del error:", error);
            animarTextoExito("Ocurrió un error al enviar. Por favor intenta más tarde.");
            abrirModal("modal-exito");
          });
      }
    });
  }
});

/* =========================================================
   6. FUNCIONES PARA MANEJO DE VENTANAS MODALES
   ========================================================= */
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

/* ANIMACIÓN PALABRA POR PALABRA EN EL MODAL */
function animarTextoExito(mensaje) {
  const contenedor = document.getElementById("texto-exito-animado");
  if (!contenedor) return;

  contenedor.innerHTML = "";
  const palabras = mensaje.split(" ");

  palabras.forEach((palabra, i) => {
    const span = document.createElement("span");
    span.textContent = palabra;
    span.classList.add("palabra-animada");
    span.style.animationDelay = `${i * 0.12}s`;
    contenedor.appendChild(span);
  });
}