// variables globales seleccionadas por clase
const boton = document.querySelector(".btn-consultar");
const resultado = document.querySelector(".resultado");

// URL de la API de fotos
const urlApi = "https://jsonplaceholder.typicode.com/photos";

// El botón existe?
if (boton) {
  boton.addEventListener("click", () => {
    // Limpiar el contenedor
    resultado.innerHTML = "";
    // Llamar a la función que consume la Api
    consumoApiGaleria();
  });
} else {
  console.error("Error");
}

/**
 * Función para realizar la petición a la API y manejar la respuesta con Promesas.
 */
function consumoApiGaleria() {
  // Deshabilitar el botón - texto de carga en progreso
  boton.disabled = true;
  boton.textContent = "Cargando imágenes...";

  // Petición a la API
  fetch(urlApi)
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `Error de red: ${response.status} ${response.statusText}`
        );
      }
      return response.json();
    })
    .then((data) => {
      // 16 fotos
      const Fotos = data.slice(0, 16);

      // Se llama la funcion para mostrar las imágenes
      mostrarImagenes(Fotos);
    })
    .catch((error) => {
      console.error("Hubo un problema con la ejecución", error);
      // Mostrar un mensaje de error amigable en la interfaz de usuario
      resultado.innerHTML = `
                <div class="alert alert-danger col-12" role="alert">
                    No se pudieron cargar las imágenes. ${error.message}.
                </div>
            `;
    })
    .finally(() => {
      boton.disabled = false;
      boton.textContent = "Cargar Imágenes";
    });
}

function mostrarImagenes(galeria) {
  // Recorrer cada objeto de foto en el array
  galeria.forEach((foto) => {
    // Construimos el HTML de la tarjeta
    // Usamos foto.thumbnailUrl para cargar una imagen de menor resolución
    // y foto.url para el enlace "Ver Imagen Completa" (imagen de mayor resolución
    resultado.innerHTML += `
            <div class="card card-custom">
                <img src="${foto.thumbnailUrl}" class="card-img-top" alt="${foto.title}">
                <div class="card-body">
                    <h5 class="card-title text-center">${foto.title}</h5>
                    <p class="card-text text-center">ID: ${foto.id}</p>
                    <a href="${foto.url}" target="_blank" class="btn btn-warning mt-auto">Ver Imagen Completa</a>
                </div>
            </div>
        `;
  });
}
