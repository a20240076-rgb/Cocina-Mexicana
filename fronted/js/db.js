// =========================
// GUARDAR PEDIDO
// =========================
document.getElementById("btnGuardar").addEventListener("click", async () => {

    const nombre = document.getElementById("nombreCliente").value.trim();
    const fecha = document.getElementById("fechaPedido").value;
    const hora = document.getElementById("horaPedido").value;
    const direccion = document.getElementById("direccionCliente").value.trim();

    if (!nombre || !fecha || !hora || !direccion) {
        alert("Todos los campos son obligatorios");
        return;
    }

    const pedido = { nombre, fecha, hora, direccion };

    try {

        const resp = await fetch("https://cocina-mexicana.onrender.com/guardar-pedido", {

            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(pedido)

        });

        if (!resp.ok) {
            throw new Error("Error al guardar el pedido");
        }

        const data = await resp.json();

        alert("Pedido guardado correctamente ✔");

        // limpiar campos
        document.getElementById("nombreCliente").value = "";
        document.getElementById("fechaPedido").value = "";
        document.getElementById("horaPedido").value = "";
        document.getElementById("direccionCliente").value = "";

        mostrarPedidos();

    } catch (err) {

        console.error(err);
        alert("Error al guardar el pedido");

    }

});


// =========================
// MOSTRAR PEDIDOS
// =========================
async function mostrarPedidos() {

    const contenedor = document.getElementById("listaPedidos");
    contenedor.innerHTML = "";

    try {

        const resp = await fetch("https://cocina-mexicana.onrender.com/pedidos");

        if (!resp.ok) {
            throw new Error("Error al obtener pedidos");
        }

        const pedidos = await resp.json();

        if (pedidos.length === 0) {
            contenedor.innerHTML = "<p>No hay pedidos registrados.</p>";
            return;
        }

        pedidos.forEach((p, i) => {

            contenedor.innerHTML += `
                <div class="pedido">
                    <strong>${i + 1}. ${p.cliente}</strong><br>
                    Fecha: ${p.fecha}<br>
                    Hora: ${p.hora}<br>
                    Dirección: ${p.direccion}<br><br>
                </div>
            `;

        });

    } catch (err) {

        console.error(err);
        contenedor.innerHTML = "<p>Error al cargar los pedidos</p>";

    }

}


// =========================
// CAMBIAR VISTAS
// =========================
document.getElementById("btnConsultar").addEventListener("click", () => {

    document.getElementById("hacerPedido").style.display = "none";
    document.getElementById("consultarPedidos").style.display = "block";

    mostrarPedidos();

});

document.getElementById("btnHacer").addEventListener("click", () => {

    document.getElementById("consultarPedidos").style.display = "none";
    document.getElementById("hacerPedido").style.display = "block";

});


// =========================
// CARGAR AL INICIO
// =========================
mostrarPedidos();