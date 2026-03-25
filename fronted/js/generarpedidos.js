document.getElementById("btnGuardar").addEventListener("click", async () => {

    const nombre = document.getElementById("nombreCliente").value.trim();
    const fecha = document.getElementById("fechaPedido").value;
    const hora = document.getElementById("horaPedido").value;
    const direccion = document.getElementById("direccionCliente").value.trim();
    const orden = document.getElementById("ordenComida").value.trim();

    if (!nombre || !fecha || !hora || !direccion || !orden) {
        alert("Todos los campos son obligatorios");
        return;
    }

    const pedido = { nombre, fecha, hora, direccion, orden };

    try {

        // ------------------------------
        // Guardar en base de datos
        // ------------------------------
        const resp = await fetch("https://cocina-mexicana.onrender.com/guardar-pedido", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(pedido)
        });

        if (!resp.ok) {
            throw new Error("Error en la respuesta del servidor");
        }

        const data = await resp.json();

        console.log("Guardado en BD:", data);

        // ------------------------------
        // Guardar en localStorage
        // ------------------------------
        let pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
        pedidos.push(pedido);
        localStorage.setItem("pedidos", JSON.stringify(pedidos));

        alert("Pedido guardado correctamente ✔");

        // ------------------------------
        // Limpiar campos
        // ------------------------------
        document.getElementById("nombreCliente").value = "";
        document.getElementById("fechaPedido").value = "";
        document.getElementById("horaPedido").value = "";
        document.getElementById("direccionCliente").value = "";
        document.getElementById("ordenComida").value = "";

        // ------------------------------
        // Actualizar tabla
        // ------------------------------
        if (typeof mostrarPedidos === "function") {
            await mostrarPedidos();
        }

    } catch (err) {

        console.error("Error:", err);

        alert("No se pudo guardar el pedido. Intenta nuevamente.");
    }

});