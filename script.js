async function fetchPokemons(url) {
  const apiResponse = await fetch(url);
  return apiResponse.json();
};

async function fetchPokemon(pokemonUrl) {
  const apiResponse = await fetch(pokemonUrl);
  return await apiResponse.json();
};

function formatId(id) {
  return String(id).padStart(4, "0");
};

function typesToHTML(types) {
  return types.map(type => `<li class="type ${type.type.name}">${type.type.name}</li>`).join("");
};

function pokemonToHTML(pokemon) { 
  return `
    <li class="pokemon ${pokemon.types[0].type.name}">
      <span class="number">#${formatId(pokemon.id)}</span>
      <span class="name">${pokemon.species.name}</span>

      <div class="detail">
        <ol class="types">
          ${typesToHTML(pokemon.types)}
        </ol>
        <img
          src="${pokemon.sprites.other.home.front_default}"
          alt="${pokemon.species.name}"
        />
      </div>
    </li>`;
};

async function loadPokemons(url, htmlReference) {
  const pokemons = await fetchPokemons(url);
  pokemons.results.forEach(async (pokemonUrl) => {
    const pokemon = await fetchPokemon(pokemonUrl.url);
    const pokemonHTML = pokemonToHTML(pokemon);
    htmlReference.innerHTML += pokemonHTML;
  });
}

function createURL(apiURL) {
  return `${apiURL.baseURL}?offset=${apiURL.offset}&limit=${apiURL.limit}`;
}

function createObserver(observed, apiURL, htmlReference) {
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting === true) {
      apiURL.offset += apiURL.limit;
      const url = createURL(apiURL);
      loadPokemons(url, htmlReference);
    }
  });

  observer.observe(observed);
}

async function main() {
  const pokemonsList = document.querySelector(".pokemons");
  const guard = document.querySelector(".guard");

  const apiURL = {
    baseURL:"https://pokeapi.co/api/v2/pokemon",
    offset: 0,
    limit: 30,
  }

  createObserver(guard, apiURL, pokemonsList);

  const url = createURL(apiURL);

  loadPokemons(url, pokemonsList);
};

main();

