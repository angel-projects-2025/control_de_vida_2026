document.addEventListener("DOMContentLoaded", function () {
    const btnMeses = document.getElementById("btnMeses");
    const listaMeses = document.getElementById("listaMeses");

    console.log("JS cargado"); // 👈 prueba

    btnMeses.addEventListener("click", function () {
        console.log("Click en Meses"); // 👈 prueba
        listaMeses.classList.toggle("mostrar");
    });
});

// 1️⃣ Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAd3UszZPrcm5UPQs0uKLlOKIUfw6iZ0Jw",
  authDomain: "control2026.firebaseapp.com",
  databaseURL: "https://control2026-default-rtdb.firebaseio.com",
  projectId: "control2026",
  storageBucket: "control2026.appspot.com",
  messagingSenderId: "236169340239",
  appId: "1:236169340239:web:cfaaa09292965b872fd13a",
  measurementId: "G-TREFLRKN62"
};

// Inicializa Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// 2️⃣ Selecciona todos los td editables
const celdas = document.querySelectorAll('td[contenteditable="true"]');

// Detecta el mes según lo que dice tu HTML
const mesActual = document.querySelector('.mes-resaltada').textContent.trim();
console.log("Mes actual:", mesActual); // Solo para probar


// 3️⃣ Genera una clave única para cada celda según su posición
celdas.forEach((td, index) => {
    td.dataset.id = index;

    // 3a️⃣ Cargar datos existentes de Firebase al iniciar
    db.ref(mesActual + '/datos/' + index).once('value').then(snapshot => {
        if(snapshot.exists()){
            td.textContent = snapshot.val();
        }
    });

    // 3b️⃣ Guardar datos en Firebase cada vez que se edite
    td.addEventListener('input', () => {
        db.ref(mesActual + '/datos/' + index).set(td.textContent);
    });
});

// 4️⃣ Escuchar cambios en Firebase para actualizar todas las celdas en tiempo real
db.ref(mesActual + '/datos').on('value', snapshot => {
    snapshot.forEach(child => {
        const id = child.key;
        const valor = child.val();
        const td = document.querySelector(`td[data-id='${id}']`);
        if(td && td.textContent !== valor){
            td.textContent = valor;
        }
    });
});
