let iconCart = document.querySelector(".carrito");
let iconCount = document.querySelector(".contar-pro");
let btnProducts = document.querySelectorAll(".btn-product");
let contentProducts = document.querySelector(".content-pro");
let listCart = document.querySelector(".list-cart tbody")
let btnCart = document.querySelector(".btn-cart"); 
let carritoInicial = JSON.parse(localStorage.getItem("carrito")) || []; // Guardar información del carrito cuando se devuelve de cart.html
let con = carritoInicial.length + 1;

// Función para mostrar los productos del carrito en el mini-carrito
function renderMiniCart() {
    let listCart = document.querySelector(".list-cart tbody");
    let iconCount = document.querySelector(".contar-pro");
    // Limpiar la tabla
    listCart.innerHTML = "";
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    // Actualizar contador
    iconCount.textContent = carrito.length;
    con = carrito.length;
    // mostrar productos
    carrito.forEach((prod, idx) => {
        let row = document.createElement("tr");
        row.innerHTML = `
            <td>${idx + 1}</td>
            <td><img src="${prod.imagen}" width="70px"></td>
            <td>${prod.nombre}</td>
            <td>${prod.precio}</td>
            <td>
                <button type="button" class="btn-delete-mini text-danger" 
                    data-nombre="${prod.nombre}" 
                    data-precio="${prod.precio}" 
                    style="background-color: white; border:none;">X</button>
            </td>
        `;
        listCart.appendChild(row);
    });

    // Evento para eliminar producto al hacer click en la X
    listCart.querySelectorAll(".btn-delete-mini").forEach(btn => {
        btn.addEventListener("click", function() {
            let nombre = this.getAttribute("data-nombre");
            let precio = this.getAttribute("data-precio");
            let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
            // Busca el primer producto que coincida con nombre y precio
            let index = carrito.findIndex(p => p.nombre === nombre && String(p.precio) === String(precio));
            if (index !== -1) {
                carrito.splice(index, 1);
                localStorage.setItem("carrito", JSON.stringify(carrito));
                renderMiniCart();
            }
        });
    });
    let btnCart = document.querySelector(".btn-cart");
    if (btnCart) {
        btnCart.onclick = function() {
            window.location.href = "cart.html";
        };
    }
}

// Evento al navegador para cargar los productos y el mini-carrito
document.addEventListener("DOMContentLoaded", ()=>{
    // Actualiza el contador cada vez que se recarga la página
    let carritoActual = JSON.parse(localStorage.getItem("carrito")) || [];
    con = carritoActual.length + 1;
    getProductData();
    renderMiniCart();
});


// Agregar evento al icono del carrito
iconCart.addEventListener("click", ()=>{
    if(listCart.parentElement.classList.contains("list-cart")){
        let listCartTable = listCart.parentElement;
        if(listCartTable.style.display === "none" || listCartTable.style.display === ""){
            listCartTable.style.display = "block";
        } else{
            listCartTable.style.display = "none";
        }
    }
})


// Función para obtener la información del producto
let getInfoProduct = (id) =>{
    let product = [];
    let productPrevius = JSON.parse(localStorage.getItem("productos"));
    if (productPrevius != null){
        products = Object.values(productPrevius);
    }
    // Guardar el producto en localStorage al hacer click en la canasta
    storageProduct(products[id]);
    iconCount.textContent = con;
    con++;
}

// Función para guardar los productos del carrito
let storageProduct = (product) =>{
    let products = [];
    let productPrevius = JSON.parse(localStorage.getItem("carrito"));
    if (productPrevius != null){
        products = Object.values(productPrevius);
    }
    products.push(product);
    localStorage.setItem("carrito", JSON.stringify(products)); 
    renderMiniCart(); // Actualizar mini-carrito
}

// Función para llevar la info del producto al carrito
let addProCart = ( prod ) =>{
    let row = document.createElement("tr");
    row.innerHTML = `
        <td>${con}</td>
        <td><img src="${prod.imagen}" width="70px"></td>
        <td>${prod.nombre}</td>
        <td>${prod.precio}</td>
        <td>
            <button onclick="deleteCart(this);" type="button" class="btn-delete text-danger" data-id="${con}" style="background-color: white">X</button>
        </td>
    `;
    listCart.appendChild(row);
}

// Función para eliminar un producto del carrito
let deleteCart = ( btn )=>{
    let row = btn.closest("tr");
    row.remove();
    if (Number(iconCount.textContent) > 0){
        iconCount.textContent = Number(iconCount.textContent) - 1;
        con--;
    }
}

//funcion para traer los datos de la BD a la tienda
let getProductData = async ()=>{
    let url = "http://localhost/backend-apiCrud/productos";
    try {
        let respuesta = await fetch(url,{
            method: "GET",
            headers: {
                "Content-Type" : "application/json"
            }
        });
        if (respuesta.status === 204) {
            console.log("No hay datos en la BD");
        }else{
            let tableData = await respuesta.json();
            console.log(tableData);
            //agregar los datos de la tabla a localStorage
            localStorage.setItem("productos", JSON.stringify(tableData));
            //agregar los datos a la tabla
            tableData.forEach((dato, i)=>{
                contentProducts.innerHTML += `
                    <div class="col-md-3 py-3 py-md-0">
                        <div class="card">
                        <img src="${dato.imagen}" alt="">
                        <div class="card-body">
                            <h3>${dato.nombre} </h3>
                            <p>${dato.descripcion}</p>
                            <h5>$${dato.precio}  
                            <span class="btn-product" onclick="getInfoProduct(${i})"><i class="fa-solid fa-basket-shopping"></i></span>
                            </h5>
                        </div>
                        </div>
                    </div>
                `;
            });
        }
    } catch (error) {
        console.log(error);
    }

};
