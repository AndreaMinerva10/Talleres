//variables globales
const d = document;
let nameInput = d.querySelector("#productos-select");
let priceInput = d.querySelector("#precio-pro");
let stockInput = d.querySelector("#stock-pro");
let descriptionInput = d.querySelector("#des-pro");
let imagen = d.querySelector("#imagen-pro");
let btnCreate = d.querySelector(".btn-create");
let productUpdate;
let nameUser = d.querySelector("#nombre-usuario");
let btnLogout = d.querySelector("#btnLogout");

//funcion para poner el nombre del usuario
let getUser = () => {
  let user = JSON.parse(localStorage.getItem("userLogin"));
  nameUser.textContent = user.nombre;
};

//Evento para el botón del logout
btnLogout.addEventListener("click", () => {
  localStorage.removeItem("userLogin");
  location.href = "../login.html";
});

//agregar un evento al botón
btnCreate.addEventListener("click", () => {
  /* alert("Producto: " + nameInput.value); */
  let dataProduct = getDataProduct();
  sendDataProduct(dataProduct);
});

//evento al navegador para comprobar si recargó la página
d.addEventListener("DOMContentLoaded", () => {
  getUser();
  productUpdate = JSON.parse(localStorage.getItem("productEdit"));
  if (productUpdate != null) {
    updateDataProduct();
   }
});

//funcion para validar el formulario
//obtener los datos del formulario
let getDataProduct = () => {
  //validar formulario
  let product;
  if (
    nameInput.value &&
    priceInput.value &&
    stockInput.value &&
    descriptionInput.value &&
    imagen.src
  ) {
    product = {
      nombre: nameInput.value,
      descripcion: descriptionInput.value,
      precio: priceInput.value,
      stock: stockInput.value,
      imagen: imagen.src,
    };
    priceInput.value = "";
    descriptionInput.value = "";
    stockInput.value = "";
    imagen.src = "https://m.media-amazon.com/images/I/61XV8PihCwL._SY250_.jpg";
    console.log(product);
  } else {
    alert("Todos los campos son obligatorios");
  }

  return product;
};

//funcion para recibir los datos y
// realizar la petición al servidor
let sendDataProduct = async (data) => {
  let url = "http://localhost/backend-apiCrud/productos";
  try {
    let respuesta = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    //verificar la respuesta del servidor
    if (respuesta.status === 406) {
      alert("Los datos enviados no son admitidos");
    } else {
      let mensaje = await respuesta.json();
      alert(mensaje.message);
      location.href = "listado-pro.html"; //redireccionar a listado de productos
    }
  } catch (error) {
    console.log(error);
  }
};

//funcion para editar el producto
let updateDataProduct = () => {
  //Agregar datos a editar en los campos del formulario
  nameInput.value = productUpdate.nombre;
  priceInput.value = productUpdate.precio;
  stockInput.value = productUpdate.stock;
  descriptionInput.value = productUpdate.descripcion;
  imagen.src = productUpdate.imagen;
  let product;

  //alternar el botón de crear y editar
  let btnEdit = d.querySelector(".btn-update");
  btnCreate.classList.toggle("d-none");
  btnEdit.classList.toggle("d-none");

  //agregar evento al botón de editar
  btnEdit.addEventListener("click", () => {
    product = {
      id: productUpdate.id,
      nombre: nameInput.value,
      descripcion: descriptionInput.value,
      precio: priceInput.value,
      stock: stockInput.value,
      imagen: imagen.src,
    };
    //borrar info de localStorage
    localStorage.removeItem("productEdit");
    //pasar los datos del producto a la funcion
    sendUpdateProduct(product);
  });
};

//funcion para realizar la petición al servidor
let sendUpdateProduct = async (pro) => {
  let url = "http://localhost/backend-apiCrud/productos";
  try {
    let respuesta = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pro),
      mode: "cors",
      credentials: "same-origin",
    });
    if (!respuesta.ok) {
      throw new Error(`HTTP error! status: ${respuesta.status}`);
    }

    let mensaje = await respuesta.json();
    alert(mensaje.message);
    location.href = "../listado-pro.html";
  } catch (error) {
    console.error("Error al actualizar producto:", error);
  }
};
