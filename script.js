/***********************
 *  MENÚ MESES
 ***********************/
document.addEventListener("DOMContentLoaded", () => {
  const btnMeses = document.getElementById("btnMeses");
  const listaMeses = document.getElementById("listaMeses");

  if (btnMeses && listaMeses) {
    btnMeses.addEventListener("click", (e) => {
      e.stopPropagation();
      listaMeses.classList.toggle("mostrar");
    });

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

if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
const db = firebase.database();

/***********************
 *  HELPERS (mes/sección)
 ***********************/
function getNombreArchivoSinExt() {
  const file = window.location.pathname.split("/").pop() || "";
  return file.toLowerCase().replace(".html", "").trim();
}

function detectarMesSeguro() {
  const m = (document.body.dataset.mes || "").trim().toLowerCase();
  if (m) return m;
  const archivo = getNombreArchivoSinExt();
  return archivo || "sin_mes";
}

function detectarSeccionSegura() {
  const s = (document.body.dataset.seccion || "").trim().toLowerCase();
  return s || "partidos";
}

/***********************
 *  GUARDADO + TIEMPO REAL (PC <-> MÓVIL)
 ***********************/
document.addEventListener("DOMContentLoaded", () => {
  if (document.body.dataset.noGuardar === "true") return;

  const mes = detectarMesSeguro();          // enero/febrero/abril/mayo/index...
  const seccion = detectarSeccionSegura();  // partidos/estadio...
  const basePath = `${mes}/${seccion}/datos`;

  console.log("✅ Ruta Firebase:", basePath);

  const celdas = document.querySelectorAll('td[contenteditable="true"]');
  if (!celdas.length) return;

  // Evita spamear firebase en cada tecla (más suave)
  const timers = new Map();
  const guardarCelda = (td, index) => {
    const key = `${index}`;
    if (timers.has(key)) clearTimeout(timers.get(key));

    timers.set(
      key,
      setTimeout(() => {
        db.ref(`${basePath}/${index}`).set(td.textContent).catch(console.error);
      }, 120)
    );
  };

  // 1) Carga inicial
  celdas.forEach((td, index) => {
    td.dataset.id = index;

    db.ref(`${basePath}/${index}`)
      .once("value")
      .then((snap) => {
        if (snap.exists()) td.textContent = snap.val();
      })
      .catch(console.error);

    // 2) Guardado: PC y móvil (input a veces falla en móvil -> keyup/blur)
    td.addEventListener("input", () => guardarCelda(td, index));
    td.addEventListener("keyup", () => guardarCelda(td, index)); // 👈 móvil
    td.addEventListener("blur", () => guardarCelda(td, index));  // 👈 móvil
  });

  // 3) Tiempo real: escuchar cambios uno por uno (mejor que 'value')
  const aplicarCambio = (snap) => {
    const id = snap.key;
    const valor = snap.val();

    const td = document.querySelector(`td[data-id='${id}']`);
    if (!td) return;

    // Si justo estás escribiendo en ESA celda, no la sobreescribas
    if (document.activeElement === td) return;

    if (td.textContent !== valor) td.textContent = valor;
  };

  db.ref(basePath).on("child_added", aplicarCambio);
  db.ref(basePath).on("child_changed", aplicarCambio);
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

    document.addEventListener("click", () => {
      menuFutbol.classList.remove("active");
    });
  }
});

/***********************
 *  IMÁGENES DE EQUIPOS (solo visual por ahora)
 ***********************/
document.addEventListener("DOMContentLoaded", () => {
  const equipos = document.querySelectorAll(".equipo");

  equipos.forEach((celda) => {
    const input = celda.querySelector(".input-img");
    const img = celda.querySelector(".img-equipo");
    if (!input || !img) return;

    celda.addEventListener("click", () => input.click());

    input.addEventListener("change", function () {
      const file = this.files && this.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => (img.src = e.target.result);
      reader.readAsDataURL(file);
    });
  });
});