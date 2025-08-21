let tableCart = document.querySelector(".cart-table tbody");
let tagSubtotal = document.querySelector(".cart-summary .sub-total");
let tagTotal = document.querySelector(".cart-summary .total");
let inputDelivery = document.querySelector(".cart-summary .valor-domi");
let inputPromo = document.querySelector(".cart-summary .promo");

let products = [];
let quantities = [];

// Evento para recargar el navegador
document.addEventListener("DOMContentLoaded", ()=>{
    getProductCart();
    // Traer valores de domicilio y descuento
    if (inputDelivery) {
        let prevDelivery = localStorage.getItem("valor_domicilio");
        if (prevDelivery !== null && prevDelivery !== undefined) {
            inputDelivery.value = prevDelivery;
        }
        inputDelivery.addEventListener('input', updateOrderDetail);
    }
    if (inputPromo) {
        let prevPromo = localStorage.getItem("valor_descuento");
        if (prevPromo !== null && prevPromo !== undefined) {
            inputPromo.value = prevPromo;
        }
        inputPromo.addEventListener('input', updateOrderDetail);
    }
});

// Actualiza el resumen de la orden
function updateOrderDetail() {
    let subtotal = 0;
    let cantidades = [];
    // Sumar precio*cantidad de cada producto
    let rows = tableCart.querySelectorAll("tr");
    rows.forEach((row, i) => {
        let precio = 0;
        let cantidad = 1;
        // Buscar precio
        let precioCell = row.querySelector("td:nth-child(2) .lead");
        if (precioCell) {
            precio = Number(precioCell.textContent.replace(/[^0-9.]/g, ""));
        }
        // Buscar cantidad
        let cantidadInput = row.querySelector("input.number");
        if (cantidadInput) {
            cantidad = Number(cantidadInput.value) || 1;
        }
        cantidades[i] = cantidad;
        subtotal += precio * cantidad;
    });
    // Guardar cantidades en localStorage para checkout
    localStorage.setItem("cantidades_carrito", JSON.stringify(cantidades));
    if (tagSubtotal) tagSubtotal.textContent = "$" + subtotal.toLocaleString();

    // Guardar domicilio y descuento en localStorage para checkout
    let delivery = inputDelivery ? Number(inputDelivery.value) || 0 : 0;
    let promo = inputPromo ? Number(inputPromo.value) || 0 : 0;
    localStorage.setItem("valor_domicilio", delivery);
    localStorage.setItem("valor_descuento", promo);

    let total = subtotal + delivery - promo;
    if (tagTotal) tagTotal.textContent = "$" + total.toLocaleString();
}

function infoOrder(pos){
    let countProduct = document.querySelectorAll(".quantity input.number");
    let btnDecrement = document.querySelectorAll(".decrement i");
    let btnIncrement = document.querySelectorAll(".increment i");
    let totalPro  = document.querySelectorAll(".total-pro");
    let removeBtn = document.querySelectorAll(".remove-from-cart-btn")[pos];
    // Evento a los botones de sumar y restar
    btnIncrement[pos].addEventListener("click",()=>{
        let currentValue = Number(countProduct[pos].value);
        countProduct[pos].value = currentValue + 1;
        totalPro[pos].textContent = (Number(products[pos].precio) * (currentValue + 1));
        updateOrderDetail(); 
    })
    btnDecrement[pos].addEventListener("click", ()=>{
        let currentValue = Number(countProduct[pos].value);
        if(currentValue >1){
            countProduct[pos].value = currentValue -1;
            totalPro[pos].textContent = (Number(products[pos].precio) * (currentValue - 1));
            updateOrderDetail();
        }
    })
    // Actualizar cuando el cliente edite manualmente el input
    countProduct[pos].addEventListener("input", ()=>{
        let val = Number(countProduct[pos].value) || 1;
        if (val < 1) val = 1;
        countProduct[pos].value = val;
        totalPro[pos].textContent = (Number(products[pos].precio) * val);
        updateOrderDetail();
    });
    // Eliminar producto al hacer click en la X
    removeBtn.addEventListener("click", (e) => {
        e.preventDefault();
        // Eliminar del array de productos
        products.splice(pos, 1);
        // Actualizar localStorage
        localStorage.setItem("carrito", JSON.stringify(products));
        // Eliminar la fila del DOM
        removeBtn.closest("tr").remove();
        // Volver a enlazar eventos y actualizar resumen
        setTimeout(() => {
            rebindEvents();
            updateOrderDetail();
        }, 50);
    });
}

// Reasigna eventos después de eliminar un producto
function rebindEvents() {
    document.querySelectorAll(".remove-from-cart-btn").forEach((btn, i) => {
        btn.onclick = null;
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            products.splice(i, 1);
            localStorage.setItem("carrito", JSON.stringify(products));
            btn.closest("tr").remove();
            setTimeout(() => {
                rebindEvents();
                updateOrderDetail();
            }, 50);
        });
    });
    document.querySelectorAll(".quantity input.number").forEach((input, i) => {
        input.oninput = null;
        input.addEventListener("input", ()=>{
            let val = Number(input.value) || 1;
            if (val < 1) val = 1;
            input.value = val;
            let totalPro = document.querySelectorAll(".total-pro")[i];
            totalPro.textContent = (Number(products[i].precio) * val);
            updateOrderDetail();
        });
    });
    document.querySelectorAll(".decrement i").forEach((btn, i) => {
        btn.onclick = null;
        btn.addEventListener("click", ()=>{
            let input = document.querySelectorAll(".quantity input.number")[i];
            let currentValue = Number(input.value);
            if(currentValue >1){
                input.value = currentValue -1;
                let totalPro = document.querySelectorAll(".total-pro")[i];
                totalPro.textContent = (Number(products[i].precio) * (currentValue - 1));
                updateOrderDetail();
            }
        });
    });
    document.querySelectorAll(".increment i").forEach((btn, i) => {
        btn.onclick = null;
        btn.addEventListener("click", ()=>{
            let input = document.querySelectorAll(".quantity input.number")[i];
            let currentValue = Number(input.value);
            input.value = currentValue + 1;
            let totalPro = document.querySelectorAll(".total-pro")[i];
            totalPro.textContent = (Number(products[i].precio) * (currentValue + 1));
            updateOrderDetail();
        });
    });
}

function getProductCart(){
    products = [];
    let productsLocal = JSON.parse(localStorage.getItem("carrito"));
    if (productsLocal != null){
        products = Object.values(productsLocal);
    }
    tableCart.innerHTML = "";
    // Recuperar cantidades previas si existen
    let cantidadesPrevias = JSON.parse(localStorage.getItem("cantidades_carrito")) || [];
    products.forEach((dato, i)=>{
        let cantidad = cantidadesPrevias[i] || 1;
        let row = document.createElement("tr");
        row.innerHTML =`
            <td class="product-block">
                <a href="#" class="remove-from-cart-btn"><i class="fa-solid fa-x"></i></a>
                <img src="${dato.imagen}" alt="">
                <a href="product-detail.html" class="h6">${dato.nombre}</a>
            </td>
            <td>
                <p class="lead color-black">${dato.precio}</p>
            </td>
            <td>
                <div class="quantity quantity-wrap">
                    <div class="decrement"><i class="fa-solid fa-minus"></i></div>
                    <input type="text" name="quantity" value="${cantidad}" maxlength="2" size="1" class="number">
                    <div class="increment"><i class="fa-solid fa-plus"></i></div>
                </div>
            </td>
            <td>
                <h6 class="total-pro">${dato.precio * cantidad}</h6>
            </td>
        `;
        tableCart.appendChild(row);
        infoOrder(i);
    });
    updateOrderDetail();
}