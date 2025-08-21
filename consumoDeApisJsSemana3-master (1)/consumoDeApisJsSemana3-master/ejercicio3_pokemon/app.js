let pokedexInput = document.querySelector(".Pokedex input");
let btnConsultar = document.querySelector(".btn-consultar");
let pokedexContainer = document.querySelector(".Pokedex-resultado");
const apiBase = "https://pokeapi.co/api/v2/pokemon/";
const listaNombres = "https://pokeapi.co/api/v2/pokemon?limit=10000"; //sugerencias de Pokémon
let pokemonSuggestionsDatalist = document.getElementById("pokemonSuggestions");

// Función para cargar la lista de Pokémon en el datalist
async function loadPokemonSuggestions() {
  try {
    const response = await fetch(listaNombres);
    if (!response.ok) {
      throw new Error(
        `Error al cargar la lista de Pokémon: ${response.statusText}`
      );
    }
    const data = await response.json();

    pokemonSuggestionsDatalist.innerHTML = "";

    data.results.forEach((pokemon) => {
      let option = document.createElement("option");
      option.value = pokemon.name;
      pokemonSuggestionsDatalist.appendChild(option);
    });
    console.log("Lista de Pokémon cargada en las sugerencias.");
  } catch (error) {
    console.error("Error al cargar las sugerencias de Pokémon:", error);
  }
}

// Cargar las sugerencias cuando la página se cargue
document.addEventListener("DOMContentLoaded", loadPokemonSuggestions);

btnConsultar.addEventListener("click", () => {
  let pokemonName = pokedexInput.value.toLowerCase().trim();

  if (pokemonName) {
    fetch(`${apiBase}${pokemonName}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `No se pudo encontrar el Pokémon: ${response.statusText}`
          );
        }
        return response.json();
      })
      .then((data) => {
        const pokemonImage = data.sprites.front_default;
        const pokemonAbilities = data.abilities
          .map((ability) => ability.ability.name)
          .join(", ");
        const pokemonMoves = data.moves
          .slice(0, 5)
          .map((move) => move.move.name)
          .join(", ");
        const pokemonType = data.types.map((type) => type.type.name).join(", ");

        pokedexContainer.innerHTML = `
                    <div class="card mt-4">
                        <img src="${pokemonImage}" class="card-img-top mx-auto d-block" alt="${data.name}" style="width: 150px;">
                        <div class="card-body text-center">
                            <h2 class="card-title text-capitalize">${data.name}</h2>
                            <p class="card-text"><strong>Tipo(s):</strong> <span class="text-capitalize">${pokemonType}</span></p>
                            <p class="card-text"><strong>Habilidades:</strong> <span class="text-capitalize">${pokemonAbilities}</span></p>
                            <p class="card-text"><strong>Algunos movimientos:</strong> <span class="text-capitalize">${pokemonMoves}</span></p>
                        </div>
                    </div>
                `;
        pokedexInput.value = "";
      })

      .catch((error) => {
        pokedexContainer.innerHTML = `<p class="text-danger">Error: ${error.message}. Por favor, intente con otro nombre.</p>`;
        console.error("Error al obtener datos del Pokémon:", error);
        pokedexInput.value = "";
      });
  } else {
    pokedexContainer.innerHTML = `<p class="text-warning">Por favor, ingresa el nombre de un Pokémon.</p>`;
  }
});
