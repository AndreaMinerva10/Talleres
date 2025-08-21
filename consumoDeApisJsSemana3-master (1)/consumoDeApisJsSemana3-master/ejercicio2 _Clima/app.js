let buscadorClima = document.querySelector(".buscadorClima");
let btnConsultar = document.querySelector(".btn-consultar");
let climaCiudadContainer = document.querySelector(".climaCiudad-container");
let apiKey = "54963504c33b144ea654a3ad1d57b399";
let url = "https://api.openweathermap.org/data/2.5/weather?q=";

btnConsultar.addEventListener("click", () => {
  let ciudad = buscadorClima.querySelector("input").value;
  if (ciudad) {
    fetch(`${url}${ciudad}&appid=${apiKey}&units=metric`)
      .then((response) => response.json())
      .then((data) => {
        climaCiudadContainer.innerHTML = `
                    <h2>Clima en ${data.name}</h2>
                    <p>Temperatura: ${data.main.temp} °C</p>
                `;
      })
      .catch((error) => {
        climaCiudadContainer.innerHTML = `<p>Error al obtener el clima. Intente nuevamente.</p>`;
        console.error("Error fetching weather data:", error);
      });
  } else {
    climaCiudadContainer.innerHTML = `<p>Por favor, ingrese una ciudad.</p>`;
  }
});
