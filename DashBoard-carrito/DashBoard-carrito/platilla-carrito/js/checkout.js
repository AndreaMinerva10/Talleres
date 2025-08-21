document.addEventListener("DOMContentLoaded", function() {
    // Obtener datos de localStorage
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    let cantidades = JSON.parse(localStorage.getItem("cantidades_carrito")) || [];
    let domicilio = Number(localStorage.getItem("valor_domicilio")) || 0;
    let descuento = Number(localStorage.getItem("valor_descuento")) || 0;

    // Elementos del resumen
    const resumenDiv = document.querySelector('.cart-summary-detail');
    if (!resumenDiv) return;

    // Elimina los productos puestos manualmente
    for (let i = 0; i < 2; i++) {
        let firstRow = resumenDiv.querySelector('.d-flex');
        if (firstRow) resumenDiv.removeChild(firstRow);
    }

    // Insertar productos del carrito
    let subtotalProductos = 0;
    carrito.forEach((prod, idx) => {
        let cantidad = cantidades[idx] || 1;
        let precioTotal = Number(prod.precio) * cantidad;
        subtotalProductos += precioTotal;
        let row = document.createElement('div');
        row.className = "d-flex justify-content-between align-items-center mb-24";
        row.innerHTML = `
            <p class="lead color-black">${prod.nombre} x${cantidad}</p>
            <p class="lead">$${precioTotal.toLocaleString()}</p>
        `;
        // Insertar antes de domicilio
        let domicilioRow = resumenDiv.querySelectorAll('.d-flex')[0];
        resumenDiv.insertBefore(row, domicilioRow);
    });

    // Mostrar domicilio y descuento
    let domicilioDiv = resumenDiv.querySelectorAll('.d-flex')[resumenDiv.querySelectorAll('.d-flex').length - 3].querySelectorAll('p')[1];
    let descuentoDiv = resumenDiv.querySelectorAll('.d-flex')[resumenDiv.querySelectorAll('.d-flex').length - 2].querySelectorAll('p')[1];
    domicilioDiv.textContent = "$" + domicilio.toLocaleString();
    descuentoDiv.textContent = "$" + descuento.toLocaleString();

    // Calcular subtotal
    let subtotal = subtotalProductos + domicilio - descuento;
    let subtotalDiv = resumenDiv.querySelectorAll('.d-flex')[resumenDiv.querySelectorAll('.d-flex').length - 1].querySelectorAll('p')[1];
    subtotalDiv.textContent = "$" + subtotal.toLocaleString();

    // Mostrar total según método de pago
    function updateTotal() {
        let totalValue = subtotal;
        let metodo = document.querySelector('input[name="radio"]:checked').value;
        if (metodo === "1") { // Contraentrega
            totalValue = subtotal * 1.05;
        }
        // Línea 146: mostrar el total calculado en .total-total
        let totalDiv = document.querySelector('.total-total');
        if (totalDiv) {
            totalDiv.textContent = "$" + totalValue.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2});
        }
    }
    // Inicializar total
    updateTotal();
    // Evento para actualizar total al cambiar método de pago
    document.querySelectorAll('input[name="radio"]').forEach(radio => {
        radio.addEventListener('change', updateTotal);
    });
});


document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("checkout-form");
    if (form) {
        form.addEventListener("submit", function(e) {
            e.preventDefault();
            // Obtener datos de entrega
            const data = {
                nombres: form.querySelector('[name="f-name"]').value,
                apellidos: form.querySelector('[name="l-name"]').value,
                email: form.querySelector('[name="email"]').value,
                celular: form.querySelector('[name="phone"]').value,
                direccion: form.querySelector('[name="address"]').value,
                direccion2: form.querySelector('[name="address2"]').value,
                notas: form.querySelector('[name="noe"]').value,
                metodo_pago: form.querySelector('input[name="radio"]:checked')?.parentElement?.innerText.trim() || "",
                carrito: JSON.parse(localStorage.getItem("carrito")) || [],
                cantidades: JSON.parse(localStorage.getItem("cantidades_carrito")) || [],
                domicilio: Number(localStorage.getItem("valor_domicilio")) || 0,
                descuento: Number(localStorage.getItem("valor_descuento")) || 0
            };
            // Calcular subtotal productos
            let subtotal = 0;
            data.carrito.forEach((prod, idx) => {
                let cantidad = data.cantidades[idx] || 1;
                subtotal += Number(prod.precio) * cantidad;
            });
            let subtotalFinal = subtotal + data.domicilio - data.descuento;
            let metodo = form.querySelector('input[name="radio"]:checked')?.value || "";
            let total = subtotalFinal;
            if (metodo === "1" || (data.metodo_pago && data.metodo_pago.toLowerCase().includes("contraentrega"))) {
                total = subtotalFinal * 1.05;
            }
            data.total = total;
            data.subtotal = subtotal;
            data.subtotalFinal = subtotalFinal;
            localStorage.setItem("factura", JSON.stringify(data));
            window.location.href = "thankyou.html";
        });
    }

    // --- NUEVO: Restaurar datos si viene de thankyou con restore=1 ---
    function getUrlParam(name) {
        let params = new URLSearchParams(window.location.search);
        return params.get(name);
    }

    if (getUrlParam('restore') === '1') {
        let factura = JSON.parse(localStorage.getItem("factura") || "{}");
        if (factura && Object.keys(factura).length > 0) {
            // Rellenar formulario
            let form = document.getElementById("checkout-form");
            if (form) {
                form.querySelector('[name="f-name"]').value = factura.nombres || "";
                form.querySelector('[name="l-name"]').value = factura.apellidos || "";
                form.querySelector('[name="email"]').value = factura.email || "";
                form.querySelector('[name="phone"]').value = factura.celular || "";
                form.querySelector('[name="address"]').value = factura.direccion || "";
                form.querySelector('[name="address2"]').value = factura.direccion2 || "";
                form.querySelector('[name="noe"]').value = factura.notas || "";
                // Seleccionar método de pago
                let metodo = factura.metodo_pago ? factura.metodo_pago.toLowerCase() : "";
                let radios = form.querySelectorAll('input[name="radio"]');
                radios.forEach(radio => {
                    let label = radio.parentElement.innerText.trim().toLowerCase();
                    if (metodo && label === metodo) {
                        radio.checked = true;
                    }
                });
            }
            // Restaurar carrito, cantidades, domicilio y descuento
            if (factura.carrito) localStorage.setItem("carrito", JSON.stringify(factura.carrito));
            if (factura.cantidades) localStorage.setItem("cantidades_carrito", JSON.stringify(factura.cantidades));
            if (typeof factura.domicilio !== "undefined") localStorage.setItem("valor_domicilio", factura.domicilio);
            if (typeof factura.descuento !== "undefined") localStorage.setItem("valor_descuento", factura.descuento);
        }
    }
});
