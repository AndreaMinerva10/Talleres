/* const { jsx } = require("react/jsx-runtime"); */

//**variables globales
const d = document;
let clienteInput = d.querySelector(".cliente");
let productoInput = d.querySelector(".producto");
let precioInput = d.querySelector(".precio");
let imagenInput = d.querySelector(".imagen");
let observacionInput = d.querySelector(".observacion");
let btnGuardar = d.querySelector(".btn-guardar");
let tabla = d.querySelector(".table > tbody");
let inputBuscar = d.querySelector(".buscar");
let btnBuscar = d.querySelector(".btn-buscar");

//**agregar evento click al boton del formulario
btnGuardar.addEventListener("click", () => {
  /* alert(clienteInput.value); */
  let datos = validarFormulario();
  if (datos != null) {
    guardarDatos(datos);
  }
  borrarTabla();
  mostrarDatos();
});

//**funcion para validar los campos del formulario
function validarFormulario() {
  let datosForm;
  if (
    clienteInput.value == "" ||
    productoInput.value == "" ||
    precioInput.value == "" ||
    imagenInput.value == ""
  ) {
    alert("Todos los campos del formulario son obligatorios");
  } else {
    datosForm = {
      cliente: clienteInput.value,
      producto: productoInput.value,
      precio: precioInput.value,
      imagen: imagenInput.value,
      observacion: observacionInput.value,
    };

    console.log(datosForm);

    clienteInput.value = "";
    productoInput.value = "";
    precioInput.value = "";
    imagenInput.value = "";
    observacionInput.value = "";

    return datosForm;
  }
}

const listadoPedidos = "Pedidos";
//** funcion guardar datos en LocalStorage
function guardarDatos(datos) {
  let pedidos = [];
  //**Extraer datos guardados debidamente en el LocalStorage
  let pedidosPrevios = JSON.parse(localStorage.getItem(listadoPedidos));
  //**Validar datos guardados previamente en LocalStorage
  if (pedidosPrevios != null) {
    pedidos = pedidosPrevios;
  }
  //**agregar el pedido nuevo al array
  pedidos.push(datos);

  //**guardar en LocalStorage
  localStorage.setItem(listadoPedidos, JSON.stringify(pedidos));

  //**validar que los datos fueron guardados
  alert("Datos guardados con éxito...");
}

//**function para extraer los datos guardados en el LocalStorage
function mostrarDatos() {
  let pedidos = [];
  //**Extraer datos guardados debidamente en el LocalStorage
  let pedidosPrevios = JSON.parse(localStorage.getItem(listadoPedidos));
  //**Validar datos guardados previamente en LocalStorage
  if (pedidosPrevios != null) {
    pedidos = pedidosPrevios;
  }
  /* console.log(pedidos); */

  //**mostrar los datos en la tabla
  pedidos.forEach((p, i) => {
    if (p && typeof p === "object") {
      let fila = d.createElement("tr");
      fila.innerHTML = `
          <td> ${i + 1} </td>
          <td> ${p.cliente} </td>
          <td> ${p.producto} </td>
          <td> ${p.precio} </td>
          <td> <img src ="${p.imagen}" width="100%"></td>
          <td> ${p.observacion} </td>
          <td>
              <span onclick="actualizarPedido( ${i} )" class="btn-editar btn btn-warning">📝</span>
              <span onclick="eliminarPedido(${i})" class="btn-eliminar btn btn-danger">✖️</span>
          </td>
      `;
      tabla.appendChild(fila);
    }
  });
}

//**quitar los datos de la tabla
function borrarTabla() {
  let filas = d.querySelectorAll(".table tbody tr");
  /* console.log(filas); */
  filas.forEach((f) => {
    f.remove();
  });
}

//**Función eliminar un pedido de la tabla
function eliminarPedido(pos) {
  let pedidos = [];
  //**Extraer datos guardados debidamente en el LocalStorage
  let pedidosPrevios = JSON.parse(localStorage.getItem(listadoPedidos));
  //**Validar datos guardados previamente en LocalStorage
  if (pedidosPrevios != null) {
    pedidos = pedidosPrevios;
  }

  //confirmar pedido a eliminar
  let confirmar = confirm(
    "¿Desea eliminar el pedido del cliente: " + pedidos[pos].cliente + "?"
  );
  if (confirmar) {
    /* alert("Lo eliminaste"); */
    pedidos.splice(pos, 1); //**Splice() borra un dato del array, datos -> posicion y cantidad de datos a eliminar
    alert("Pedido Eliminado con éxito");
    //guardar los datos que quedaron en LocalStorage
    localStorage.setItem(listadoPedidos, JSON.stringify(pedidos));
    borrarTabla();
    mostrarDatos();
  }
}

//**actualizar pedido de LocalStorage
function actualizarPedido(pos) {
  let pedidos = [];
  //**Extraer datos guardados debidamente en el LocalStorage
  let pedidosPrevios = JSON.parse(localStorage.getItem(listadoPedidos));
  //**Validar datos guardados previamente en LocalStorage
  if (pedidosPrevios != null) {
    pedidos = pedidosPrevios;
  }
  //**Pasar los datos al formulario para editarlos
  clienteInput.value = pedidos[pos].cliente;
  productoInput.value = pedidos[pos].producto;
  precioInput.value = pedidos[pos].precio;
  observacionInput.value = pedidos[pos].observacion;

  //**Seleccionar el boton de actualizar
  let btnActualizar = d.querySelector(".btn-actualizar");
  btnActualizar.classList.toggle("d-none"); //toggle() Se la etiqueta tiene la clase, la quita, si no la agrega.
  btnGuardar.classList.toggle("d-none");

  //**agregar evento al boton de actualizar
  btnActualizar.addEventListener("click", function () {
    pedidos[pos].cliente = clienteInput.value;
    pedidos[pos].producto = productoInput.value;
    pedidos[pos].precio = precioInput.value;
    pedidos[pos].observacion = observacionInput.value;

    //**Guardar los datos editados en LocalStorage
    localStorage.setItem(listadoPedidos, JSON.stringify(pedidos));
    alert("El dato fué actualizado con éxito!!");

    clienteInput.value = "";
    productoInput.value = "";
    precioInput.value = "";
    observacionInput.value = "";

    btnActualizar.classList.toggle("d-none");
    btnGuardar.classList.toggle("d-none");

    borrarTabla();
    mostrarDatos();
  });
}

inputBuscar.addEventListener("input", () => {
  const texto = inputBuscar.value.trim();
  if (texto === "") {
    borrarTabla();
    mostrarDatos(); //Si está vacío, muestra todos los pedidos
  } else {
    filtrarPedido(texto);
  }
});

function filtrarPedido(nombreBuscado) {
  let pedidos = [];
  //**Extraer datos guardados debidamente en el LocalStorage
  let pedidosPrevios = JSON.parse(localStorage.getItem(listadoPedidos));
  //**Validar datos guardados previamente en LocalStorage
  if (pedidosPrevios != null) {
    pedidos = pedidosPrevios;
  }
  //**Filtrar los pedidos por texto, ignorando mayúsculas/minúsculas.
  const resultados = pedidos.filter((p) => {
    return (
      p &&
      p.cliente &&
      p.cliente.toLowerCase().includes(nombreBuscado.toLowerCase())
    );
  });

  borrarTabla(); //Limpia la tabla antes de mostrar lo filtrado

  resultados.forEach((p, i) => {
    let fila = d.createElement("tr");
    fila.innerHTML = `
    <td> ${i + 1} </td>
    <td> ${p.cliente} </td>
    <td> ${p.producto} </td>
    <td> ${p.precio} </td>
    <td> <img src="${p.imagen}" width="100%"></td>
    <td> ${p.observacion} </td>
    <td>
      <span onclick="actualizarPedido(${i})" class="btn-editar btn btn-warning">📝</span>
      <span onclick="eliminarPedido(${i})" class="btn-eliminar btn btn-danger">✖️</span>
    </td>
    `;
    tabla.appendChild(fila);
  });
}

inputBuscar.value = "";

//**Exportar a PDF
const btnPDF = d.querySelector(".btn-pdf");

btnPDF.addEventListener("click", () => {
  //**Obtener la tabla por su ID
  const tablaParaPDF = d.getElementById("tablaPedidos");
  //**Ocultar la columna de acciones de manera temporal, antes de generar el pdf
  const theadThs = tablaParaPDF.querySelectorAll("thead th");
  const tbodyTds = tablaParaPDF.querySelectorAll("Tbody tr td:last-child"); //**Selecciona la última celda en cada fila

  let accionesColumnaIndex = -1;
  theadThs.forEach((th, index) => {
    if (th.textContent.trim() === "Acciones") {
      accionesColumnaIndex = index;
      th.style.display = "none"; //**Oculata el encabezado de "Acciones"
    }
  });

  tbodyTds.forEach((td) => {
    td.style.display = "none"; //**Oculta las celdas de "Acciones" en el cuerpo
  });

  //**Crear un lienzo a partir de la tabla html
  html2canvas(tablaParaPDF, { scale: 4 }).then((canvas) => {
    //**aumenta la escala para mejorar la resolución
    const imgData = canvas.toDataURL("image.png");
    const pdf = new window.jspdf.jsPDF(); //**Crea un nuevo documento PDF

    const imgWidth = 210; //**Ancho A4 en mm
    const pageHeight = 297; //**Alto A4 en mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    //**Añadimos la imagen de la tabla al PDF
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    //**Restauramos la columna de acciones
    if (accionesColumnaIndex !== -1) {
      theadThs[accionesColumnaIndex].style.display = ""; //**Vuelve a mostrar el encabezado
    }
    tbodyTds.forEach((td) => {
      td.style.display = ""; //**Vuelve a mostrar las centas
    });

    //**Guardar el PDF
    pdf.save("pedidos.pdf");
  });
});

//**mostrar los datos de LocaStorage al recargar la página
d.addEventListener("DOMContentLoaded", function () {
  borrarTabla();
  mostrarDatos();
});
