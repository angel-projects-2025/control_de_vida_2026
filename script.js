document.addEventListener("DOMContentLoaded", function () {
    const btnMeses = document.getElementById("btnMeses");
    const listaMeses = document.getElementById("listaMeses");

    console.log("JS cargado"); // 👈 prueba

    btnMeses.addEventListener("click", function () {
        console.log("Click en Meses"); // 👈 prueba
        listaMeses.classList.toggle("mostrar");
    });
});

