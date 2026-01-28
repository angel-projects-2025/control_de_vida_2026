document.addEventListener("DOMContentLoaded", function () {
    const btnMeses = document.getElementById("btnMeses");
    const listaMeses = document.getElementById("listaMeses");

    console.log("JS cargado"); // 👈 prueba

    btnMeses.addEventListener("click", function () {
        console.log("Click en Meses"); // 👈 prueba
        listaMeses.classList.toggle("mostrar");
    });
});

// ====== CONFIGURACIÓN DE FIREBASE ======
// Reemplaza los valores con los de tu proyecto de Firebase
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

// ====== FUNCIONES PRINCIPALES ======
const tablas = document.querySelectorAll('.control-diario table');

// Recorremos cada tabla
tablas.forEach((tabla, tablaIndex) => {
    const celdas = tabla.querySelectorAll('td');

    celdas.forEach((celda, celdaIndex) => {
        const ruta = `tabla${tablaIndex}/celda${celdaIndex}`;

        // 1️⃣ Escuchar cambios en Firebase y actualizar la celda
        database.ref(ruta).on('value', snapshot => {
            if(snapshot.exists()){
                celda.textContent = snapshot.val();
            }
        });

        // 2️⃣ Escuchar cambios locales y guardar en Firebase
        celda.addEventListener('input', () => {
            database.ref(ruta).set(celda.textContent);
        });
    });
});
