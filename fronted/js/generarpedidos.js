document.getElementById("btnGuardar").addEventListener("click", () => {
    const nombre = document.getElementById("nombreCliente").value;
    const fecha = document.getElementById("fechaPedido").value;
    const hora = document.getElementById("horaPedido").value;
    const direccion = document.getElementById("direccionCliente").value;
    const orden = document.getElementById("ordenComida").value;

    if (!nombre || !fecha || !hora || !direccion || !orden) {
        alert("Todos los campos son obligatorios");
        return;
    }

    const pedido = { nombre, fecha, hora, direccion, orden };

    // ------------------------------
    // 1. Guardar en localStorage
    // ------------------------------
    let pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
    pedidos.push(pedido);
    localStorage.setItem("pedidos", JSON.stringify(pedidos));

    // ------------------------------
    // 2. Guardar en la base de datos
    // ------------------------------
    fetch("http://localhost:3000/guardar-pedido", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pedido)
    })
    .then(res => res.json())
    .then(data => {
        console.log("Guardado en BD:", data);
        alert("Pedido guardado ✔");
    })
    .catch(err => {
        console.error("Error:", err);
        alert("Error al guardar en la base de datos");
    });

    // ------------------------------
    // 3. Limpiar campos
    // ------------------------------
    document.getElementById("nombreCliente").value = "";
    document.getElementById("fechaPedido").value = "";
    document.getElementById("horaPedido").value = "";
    document.getElementById("direccionCliente").value = "";
    document.getElementById("ordenComida").value = "";
});
