// Guardamos los pedidos actuales para referencia
let currentPedidos = [];

// =======================
//      MOSTRAR
// =======================
async function mostrarPedidos() {

    const contenedor = document.getElementById("listaPedidos");

    try {

        const respuesta = await fetch("https://cocina-mexicana.onrender.com/pedidos");

        if (!respuesta.ok) {
            throw new Error("Error en la respuesta del servidor");
        }

        const pedidos = await respuesta.json();
        currentPedidos = pedidos || [];

        if (currentPedidos.length === 0) {
            contenedor.innerHTML = `
                <tr><td colspan="7">No hay pedidos registrados.</td></tr>
            `;
            return;
        }

        let html = "";

        currentPedidos.forEach((p, i) => {
            html += `
                <tr>
                    <td>${i + 1}</td>
                    <td>${escapeHtml(p.cliente)}</td>
                    <td>${formatFechaDisplay(p.fecha)}</td>
                    <td>${escapeHtml(p.hora)}</td>
                    <td>${escapeHtml(p.direccion)}</td>
                    <td>${escapeHtml(p.orden)}</td>
                    <td>
                        <button class="btn-edit" data-id="${p.id}">Editar</button>
                        <button class="btn-delete" data-id="${p.id}">Eliminar</button>
                    </td>
                </tr>
            `;
        });

        contenedor.innerHTML = html;

    } catch (error) {

        console.error("Error al cargar pedidos:", error);

        contenedor.innerHTML = `
            <tr><td colspan="7">Error al cargar datos del servidor.</td></tr>
        `;
    }
}

// =======================
//      HELPERS
// =======================
function escapeHtml(text) {

    if (text == null) return "";

    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function formatFechaDisplay(fecha) {

    if (!fecha) return "";

    try {

        const d = new Date(fecha);

        if (isNaN(d)) return escapeHtml(fecha);

        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");

        return `${yyyy}-${mm}-${dd}`;

    } catch {

        return escapeHtml(fecha);
    }
}

// =======================
//   ABRIR MODAL EDITAR
// =======================
function abrirModalEditar(pedido) {

    document.getElementById("editId").value = pedido.id;
    document.getElementById("editCliente").value = pedido.cliente || "";
    document.getElementById("editFecha").value = formatFechaDisplay(pedido.fecha);
    document.getElementById("editHora").value = pedido.hora || "";
    document.getElementById("editDireccion").value = pedido.direccion || "";
    document.getElementById("editOrden").value = pedido.orden || "";

    document.getElementById("modalEditar").style.display = "block";
}

// =======================
//      CERRAR MODAL
// =======================
function cerrarModal() {
    document.getElementById("modalEditar").style.display = "none";
}

// ================================
//   CLICK EN BOTONES EDITAR
// ================================
document.addEventListener("click", (e) => {

    if (e.target.matches(".btn-edit")) {

        const id = e.target.dataset.id;

        const pedido = currentPedidos.find(p => String(p.id) === String(id));

        if (pedido) abrirModalEditar(pedido);
    }
});

// ==========================
//       SUBMIT EDITAR
// ==========================
document.getElementById("formEditar").addEventListener("submit", async (e) => {

    e.preventDefault();

    const ID = document.getElementById("editId").value;
    const cliente = document.getElementById("editCliente").value.trim();
    const fecha = document.getElementById("editFecha").value;
    const hora = document.getElementById("editHora").value;
    const direccion = document.getElementById("editDireccion").value.trim();
    const orden = document.getElementById("editOrden").value.trim();

    if (!cliente || !fecha || !hora || !direccion || !orden) {

        alert("Por favor completa todos los campos.");
        return;
    }

    try {

        const payload = {
            nombre: cliente,
            fecha,
            hora,
            direccion,
            orden
        };

        const resp = await fetch("https://cocina-mexicana.onrender.com/modificar-pedido/${id}", {

            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(payload)
        })

        if (!resp.ok) {

            const txt = await resp.text();
            throw new Error(txt || "Error en la actualización");
        }

        cerrarModal();

        await mostrarPedidos();

    } catch (err) {

        console.error("Error al modificar pedido:", err);

        alert("No se pudo modificar el pedido.");
    }
});

// ==========================
//      CANCELAR EDITAR
// ==========================
document.getElementById("btnCancelar").addEventListener("click", (e) => {

    e.preventDefault();

    cerrarModal();
});

// ==========================
//   CLICK FUERA DEL MODAL
// ==========================
document.getElementById("modalEditar").addEventListener("click", (e) => {

    if (e.target.id === "modalEditar") cerrarModal();
});

// ==========================
//        ELIMINAR
// ==========================
document.addEventListener("click", async (e) => {

    if (e.target.matches(".btn-delete")) {

        const id = e.target.dataset.id;

        if (!confirm("¿Seguro que deseas eliminar este pedido?")) return;

        try {

            const resp = await fetch(`https://cocina-mexicana.onrender.com/eliminar-pedido/${id}`, {

                method: "DELETE"
            })

            if (!resp.ok) {

                const msg = await resp.text();
                throw new Error(msg);
            }

            await mostrarPedidos();

        } catch (err) {

            console.error("Error al eliminar:", err);

            alert("Ocurrió un error al eliminar el pedido.");
        }
    }
});

// =======================
//      INICIAR
// =======================
mostrarPedidos();
