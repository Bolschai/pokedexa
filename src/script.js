const pokemonsHtml = document.querySelector(".pokemons");

const pagination = document.querySelector(".pagination");

let offset = 0;
const limit = 30;

const observer = new IntersectionObserver((entries) => {
  console.log(entries);
  if (entries[0].isIntersecting === true) {
    offset += 30;
    loadPokemons();
  }
});

observer.observe(pagination);

function loadPokemons() {
  fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`)
    .then((response) => response.json())
    .then((parsed) => fetchPokemons(parsed.results))
    .catch((err) => console.log(err));
}

function loadTypes(types) {
  let typesString = "";
  types.forEach((type) => {
    typesString += `<li class="type ${addBackground(type)}">${
      type.type.name
    }</li>`;
  });

  return typesString;
}

function addBackground(type) {
  switch (type.type.name) {
    case "fire":
      return "fire";
    case "poison":
      return "poison";
    case "grass":
      return "grass";
    default:
      return "";
  }
}

function fetchPokemons(pokemonsUrls) {
  pokemonsUrls.forEach((pokemon) => {
    fetch(pokemon.url)
      .then((response) => response.json())
      .then((parsed) => {
        pokemonsHtml.innerHTML += `<li class="pokemon ${addBackground(
          parsed.types[0]
        )}">
        <span class="number">#${parsed.id}</span>
        <span class="name">${parsed.species.name}</span>

        <div class="detail">
          <ol class="types">
            ${loadTypes(parsed.types)}
          </ol>
          <img
            src="${parsed.sprites.front_default}"
            alt="Bulbasaur"
          />
        </div>
      </li>`;
      });
  });
}

loadPokemons();
