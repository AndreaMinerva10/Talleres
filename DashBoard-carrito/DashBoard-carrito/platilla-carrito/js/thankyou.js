// Limpiar localStorage solo al hacer click en Realizar otra compra
document.addEventListener("DOMContentLoaded", function() {
    var btn = document.getElementById("btn-new-order");
    if (btn) {
        btn.addEventListener("click", function() {
            // Borra solo los datos del carrito y resumen
            localStorage.removeItem("carrito");
            localStorage.removeItem("cantidades_carrito");
            localStorage.removeItem("valor_domicilio");
            localStorage.removeItem("valor_descuento");
            localStorage.removeItem("factura");
        });
    }
});


document.addEventListener("DOMContentLoaded", function() {
    const factura = JSON.parse(localStorage.getItem("factura") || "{}");
    const cont = document.getElementById("factura");
    if (!factura || !cont) return;
    // Resumen de productos
    let productosHtml = "";
    let subtotal = factura.subtotal || 0;
    if (Array.isArray(factura.carrito)) {
        factura.carrito.forEach((prod, i) => {
            let cantidad = (factura.cantidades && factura.cantidades[i]) ? factura.cantidades[i] : 1;
            let precioTotal = Number(prod.precio) * cantidad;
            productosHtml += `<tr>
                <td>${prod.nombre}</td>
                <td>${cantidad}</td>
                <td>$${Number(prod.precio).toLocaleString()}</td>
                <td>$${precioTotal.toLocaleString()}</td>
            </tr>`;
        });
    }
    let domicilio = factura.domicilio || 0;
    let descuento = factura.descuento || 0;
    let subtotalFinal = factura.subtotalFinal !== undefined ? factura.subtotalFinal : (subtotal + domicilio - descuento);
    let metodoPago = factura.metodo_pago || "";
    let total = factura.total !== undefined ? factura.total : subtotalFinal;

    cont.innerHTML = `
    <h5 class="mb-3">Factura</h5>
    <strong>Datos de entrega:</strong>
    <ul>
        <li><b>Nombres:</b> ${factura.nombres || ""}</li>
        <li><b>Apellidos:</b> ${factura.apellidos || ""}</li>
        <li><b>Email:</b> ${factura.email || ""}</li>
        <li><b>Celular:</b> ${factura.celular || ""}</li>
        <li><b>Dirección:</b> ${factura.direccion || ""}</li>
        <li><b>Dirección 2:</b> ${factura.direccion2 || ""}</li>
        <li><b>Notas:</b> ${factura.notas || ""}</li>
        <li><b>Método de pago:</b> ${metodoPago}</li>
    </ul>
    <strong>Resumen de la orden:</strong>
    <table class="table table-bordered">
        <thead>
            <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio unitario</th>
                <th>Subtotal</th>
            </tr>
        </thead>
        <tbody>
            ${productosHtml}
        </tbody>
        <tfoot>
            <tr>
                <td colspan="3"><b>Subtotal productos</b></td>
                <td>$${subtotal.toLocaleString()}</td>
            </tr>
            <tr>
                <td colspan="3"><b>Valor domicilio</b></td>
                <td>$${Number(domicilio).toLocaleString()}</td>
            </tr>
            <tr>
                <td colspan="3"><b>Descuento promo</b></td>
                <td>-$${Number(descuento).toLocaleString()}</td>
            </tr>
            <tr>
                <td colspan="3"><b>Subtotal final</b></td>
                <td>$${subtotalFinal.toLocaleString()}</td>
            </tr>
            <tr>
                <td colspan="3"><b>Total a pagar</b></td>
                <td><b>$${total.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</b></td>
            </tr>
        </tfoot>
    </table>
    `;
});