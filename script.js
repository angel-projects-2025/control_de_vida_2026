/***********************
 *  MENÚ MESES
 ***********************/
document.addEventListener("DOMContentLoaded", function () {
  const btnMeses = document.getElementById("btnMeses");
  const listaMeses = document.getElementById("listaMeses");

  console.log("JS cargado");

  if (btnMeses && listaMeses) {
    btnMeses.addEventListener("click", function (e) {
      e.stopPropagation();
      console.log("Click en Meses");
      listaMeses.classList.toggle("mostrar");
    });

    // Cerrar al hacer click fuera
    document.addEventListener("click", () => {
      listaMeses.classList.remove("mostrar");
    });
  }
});

/***********************
 *  FIREBASE CONFIG
 ***********************/
const firebaseConfig = {
  apiKey: "AIzaSyAd3UszZPrcm5UPQs0uKLlOKIUfw6iZ0Jw",
  authDomain: "control2026.firebaseapp.com",
  databaseURL: "https://control2026-default-rtdb.firebaseio.com",
  projectId: "control2026",
  storageBucket: "control2026.appspot.com",
  messagingSenderId: "236169340239",
  appId: "1:236169340239:web:cfaaa09292965b872fd13a",
  measurementId: "G-TREFLRKN62",
};

// Evitar doble inicialización
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();

/***********************
 *  HELPERS (mes/sección)
 ***********************/
function getNombreArchivoSinExt() {
  const file = window.location.pathname.split("/").pop() || "";
  return file.toLowerCase().replace(".html", "").trim();
}

function detectarMesSeguro() {
  // 1) prioridad: data-mes
  const m = (document.body.dataset.mes || "").trim().toLowerCase();
  if (m) return m;

  // 2) fallback: nombre del archivo
  const archivo = getNombreArchivoSinExt();
  return archivo || "sin_mes";
}

function detectarSeccionSegura() {
  // prioridad data-seccion; fallback "partidos"
  const s = (document.body.dataset.seccion || "").trim().toLowerCase();
  return s || "partidos";
}

/***********************
 *  GUARDADO SEPARADO
 *  mes(or archivo)/seccion/datos/celda
 ***********************/
document.addEventListener("DOMContentLoaded", () => {
  // ✅ Ahora index SÍ guarda (ya no hay return para index)
  // Si alguna página realmente no debe guardar, ahí sí usa:
  // <body data-no-guardar="true">
  if (document.body.dataset.noGuardar === "true") {
    console.log("Página marcada como NO GUARDAR (data-no-guardar='true').");
    return;
  }

  const mes = detectarMesSeguro();          // enero/febrero/abril/mayo/index...
  const seccion = detectarSeccionSegura();  // partidos/estadio...

  // ✅ Ruta ÚNICA por HTML/mes y por sección
  const basePath = `${mes}/${seccion}/datos`;
  console.log("✅ Ruta Firebase:", basePath);

  // ✅ Solo celdas editables de ESTA página
  const celdas = document.querySelectorAll('td[contenteditable="true"]');
  if (!celdas.length) {
    console.log("No hay td contenteditable en esta página.");
    return;
  }

  // Carga inicial + guardar en input
  celdas.forEach((td, index) => {
    td.dataset.id = index;

    db.ref(`${basePath}/${index}`)
      .once("value")
      .then((snapshot) => {
        if (snapshot.exists()) td.textContent = snapshot.val();
      })
      .catch((err) => console.error("Error al cargar:", err));

    td.addEventListener("input", () => {
      db.ref(`${basePath}/${index}`)
        .set(td.textContent)
        .catch((err) => console.error("Error al guardar:", err));
    });
  });

  // Tiempo real (si editas en otra pestaña/dispositivo)
  db.ref(basePath).on("value", (snapshot) => {
    snapshot.forEach((child) => {
      const id = child.key;
      const valor = child.val();

      const td = document.querySelector(`td[data-id='${id}']`);
      if (td && td.textContent !== valor) {
        td.textContent = valor;
      }
    });
  });
});

/***********************
 *  MENÚ FÚTBOL
 ***********************/
document.addEventListener("DOMContentLoaded", () => {
  const btnFutbol = document.getElementById("btnFutbol");
  const menuFutbol = document.querySelector(".futbol-menu");

  if (btnFutbol && menuFutbol) {
    btnFutbol.addEventListener("click", (e) => {
      e.stopPropagation();
      menuFutbol.classList.toggle("active");
    });

    // Cerrar al hacer click fuera
    document.addEventListener("click", () => {
      menuFutbol.classList.remove("active");
    });
  }
});

/***********************
 *  IMÁGENES DE EQUIPOS
 *  (solo visual por ahora)
 ***********************/
document.addEventListener("DOMContentLoaded", function () {
  const equipos = document.querySelectorAll(".equipo");

  equipos.forEach((celda) => {
    const input = celda.querySelector(".input-img");
    const img = celda.querySelector(".img-equipo");

    if (!input || !img) return;

    celda.addEventListener("click", () => {
      input.click();
    });

    input.addEventListener("change", function () {
      const file = this.files && this.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function (e) {
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  });
});