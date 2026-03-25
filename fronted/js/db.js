let pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];

document.getElementById("btnGuardar").addEventListener("click", () => {
    const nombre = document.getElementById("nombreCliente").value;
    const fecha = document.getElementById("fechaPedido").value;
    const hora = document.getElementById("horaPedido").value;
    const direccion = document.getElementById("direccionCliente").value;

    if (!nombre || !fecha || !hora || !direccion) {
        alert("Todos los campos son obligatorios");
        return;
    }

    const pedido = { nombre, fecha, hora, direccion };
    pedidos.push(pedido);

    localStorage.setItem("pedidos", JSON.stringify(pedidos));

    alert("Pedido guardado ✔");
});

document.getElementById("btnConsultar").addEventListener("click", () => {
    document.getElementById("hacerPedido").style.display = "none";
    document.getElementById("consultarPedidos").style.display = "block";

    mostrarPedidos();
});

document.getElementById("btnHacer").addEventListener("click", () => {
    document.getElementById("consultarPedidos").style.display = "none";
    document.getElementById("hacerPedido").style.display = "block";
});

function mostrarPedidos() {
    const contenedor = document.getElementById("listaPedidos");
    contenedor.innerHTML = "";

    const pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];

    if (pedidos.length === 0) {
        contenedor.innerHTML = "<p>No hay pedidos registrados.</p>";
        return;
    }

    pedidos.forEach((p, i) => {
        contenedor.innerHTML += `
            <div class="pedido">
                <strong>${i+1}. ${p.nombre}</strong><br>
                Fecha: ${p.fecha}<br>
                Hora: ${p.hora}<br>
                Dirección: ${p.direccion}<br><br>
            </div>
        `;
    });
}

mostrarPedidos(); // Importante

