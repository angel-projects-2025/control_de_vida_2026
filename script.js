document.addEventListener("DOMContentLoaded", function () {
    const btnMeses = document.getElementById("btnMeses");
    const listaMeses = document.getElementById("listaMeses");

    console.log("JS cargado"); // 👈 prueba

    btnMeses.addEventListener("click", function () {
        console.log("Click en Meses"); // 👈 prueba
        listaMeses.classList.toggle("mostrar");
    });
});

// CONFIGURACIÓN DE FIREBASE
const firebaseConfig = {
    apiKey: "TU_API_KEY",
    authDomain: "TU_AUTH_DOMAIN",
    databaseURL: "TU_DATABASE_URL",
    projectId: "TU_PROJECT_ID",
    storageBucket: "TU_STORAGE_BUCKET",
    messagingSenderId: "TU_MESSAGING_SENDER_ID",
    appId: "TU_APP_ID"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Selecciona todos los cuadros editables
const cuadros = document.querySelectorAll("td[contenteditable='true']");

// Función para guardar cada cuadro en Firebase
cuadros.forEach((cuadro, index) => {
    // Escuchar cambios locales y guardar en Firebase
    cuadro.addEventListener("input", () => {
        database.ref("cuadros/" + index).set(cuadro.innerText);
    });

    // Escuchar cambios en Firebase y actualizar la celda
    database.ref("cuadros/" + index).on("value", (snapshot) => {
        if (snapshot.exists() && cuadro.innerText !== snapshot.val()) {
            cuadro.innerText = snapshot.val();
        }
    });
});
