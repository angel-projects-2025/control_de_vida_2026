document.addEventListener("DOMContentLoaded", function () {
    const btnMeses = document.getElementById("btnMeses");
    const listaMeses = document.getElementById("listaMeses");

    console.log("JS cargado"); // 👈 prueba

    btnMeses.addEventListener("click", function () {
        console.log("Click en Meses"); // 👈 prueba
        listaMeses.classList.toggle("mostrar");
    });
});

// ===== GESTIÓN DE MESES =====
const btnMeses = document.getElementById('btnMeses');
const listaMeses = document.getElementById('listaMeses');

// Mostrar / ocultar lista
btnMeses.addEventListener('click', () => {
    listaMeses.classList.toggle('mostrar');
});

// Redirigir al hacer clic en un mes
listaMeses.querySelectorAll('li').forEach(li => {
    li.addEventListener('click', () => {
        const mes = li.textContent.toLowerCase();
        if (mes === 'enero') {
            window.location.href = 'enero.html';
        } else if (mes === 'febrero') {
            window.location.href = 'febrero.html';
        } else if (mes === 'marzo') {
            window.location.href = 'marzo.html';
        }
    });
});

// ===== GUARDADO DE CUADROS EDITABLES =====
const celdas = document.querySelectorAll('td[contenteditable="true"]');

// Cargar datos guardados
window.addEventListener('load', () => {
    celdas.forEach((celda, index) => {
        const valor = localStorage.getItem('celda_' + index);
        if (valor) celda.textContent = valor;
    });
});

// Guardar automáticamente al escribir
celdas.forEach((celda, index) => {
    celda.addEventListener('input', () => {
        localStorage.setItem('celda_' + index, celda.textContent);
    });
});

// ===== OPCIONAL: Limpiar localStorage (para pruebas) =====
// localStorage.clear();
