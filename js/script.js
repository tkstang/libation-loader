$(document).ready(function() {
  $('select').material_select();
  $(".dropdown-button").dropdown();
});

const submit = document.getElementById('submit-search');
const form = document.getElementById('search-form');
const searchName = document.getElementById('search-name');
const searchIng = document.getElementById('search-ingredient');
const searchCat = document.getElementById('search-category');
const searchRandom = document.getElementById('search-random');
const searchResults1 = document.getElementById('search-results1');
const searchResults2 = document.getElementById('search-results2');
const hiddenCard = document.getElementById('hidden');
const ingredientSearch = document.getElementById('search-ingredient');
const firstElement = form.children[0];

function filterAlcContent(value, results){
  if (value === 'noBooze'){
    return results.filter(element => element.strAlcoholic === "Non alcoholic");
  } else if (value === 'showBooze'){
    return results.filter(element => element.strAlcoholic === "Alcoholic");
  } else {
    return results;
  }
}

function buildCard(picture, title, recipe, instructions){
	let cardClone = hiddenCard.cloneNode(true);
  cardClone.removeAttribute("style");
	cardClone.children[0].children[0].src = picture;
	cardClone.children[1].children[0].innerHTML = `${title}<i class='material-icons right'>more_vert</i>`;
	cardClone.children[2].children[0].innerHTML = `${title}<i class='material-icons right'>close</i>`;
	cardClone.children[2].children[1].innerHTML = recipe;
	cardClone.children[2].children[2].innerHTML = instructions;
	return cardClone;
}

function getRemoteJson(url) {
  return fetch(url)
  .then(function(res) {
    return res.json();
  })
  .then(function(jsonresult){
    return jsonresult;
  })
  .catch(function(error){
    console.log('Your error was: ('+error+') ')
    throw error;
  });
  return fetch(url);
}

function measureIngredient(ingredient, measurement){
  if ( (!(measurement)) || (measurement === "\n") || (measurement === " ") ){
    return ingredient;
  } else if (!ingredient){
    return false;
  } else {
    return ingredient + ": " + measurement;
  }
}

function ingsToArray(object, ingString, measureString){
  let ingsArray = [];
  for (let i = 1; i <= 15; i++){
    let numIngString = ingString + i;
    let numMeasureString = measureString + i;
    ingsArray.push(measureIngredient(object[numIngString], object[numMeasureString]))
  }
  return ingsArray;
}

function removeFalse(ingsArray){
  let string = "";
  for (let j = 0; j < ingsArray.length; j++){
    if (ingsArray[j]){
      string = `${string}<br>${ingsArray[j]}`;
    }
  }
  return string;
}

function distributeCards(index, div){
  if (index === 0){
    searchResults1.appendChild(div);
  } else if (index % 2 === 0){
    searchResults1.appendChild(div);
  } else {
    searchResults2.appendChild(div);
  }
}
// Sets default search type to 'cocktail name';
let searchType = 'cocktail name';
// Determines the correct URL to use in getRemoteJson function
function determineURL(searchType, searchInput){
  if(searchType === 'ingredient'){
    return `http://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${searchInput}`;
  } else if(searchType === 'cocktail name'){
    return `http://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchInput}`;
  }
}

// Removes search results from page
function removeResults(){
  while (searchResults1.firstChild) {
    searchResults1.removeChild(searchResults1.firstChild);
  }
  while (searchResults2.firstChild) {
    searchResults2.removeChild(searchResults2.firstChild);
  }
}

searchIng.addEventListener("click", function(event){
  event.preventDefault();
  form.removeChild(firstElement);
  let div = document.createElement('div');
  div.className = 'row';
  let divCode = `<div class="input-field"><input placeholder="Enter an Ingredient to Search" id="ingredient" type="text" class="validate"><label for="ingredient">Ingredient</label></div>`;
  div.innerHTML = divCode;
  form.insertBefore(div, form.firstChild);
  searchType = 'ingredient';
})

form.addEventListener("submit", function(event){
  event.preventDefault();
  removeResults();
  let alcoholicFilter = document.getElementById('alcoholic-filter').value;
  let searchInput = form.children[0].children[0].children[0].value;
  let searchURL = determineURL(searchType, searchInput);
  // let url = `http://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchInput}`;

  getRemoteJson(searchURL).then(function(res) {
    let drinkResults = res.drinks;
    drinkResults = filterAlcContent(alcoholicFilter, drinkResults);
    drinkResults.forEach(function(ele, i) {
      let id = ele.idDrink;
      let idURL = `http://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`;
      let div = document.createElement('div');
      let picture = ele.strDrinkThumb;
      let title = ele.strDrink;
      let instructions = ele.strInstructions
      let recipe = '';

      if (!picture){
        picture = "img/whiskey.jpg";
      }

      if (searchType === 'cocktail name'){
        recipe = removeFalse(ingsToArray(ele, 'strIngredient', 'strMeasure'));
        div.append(buildCard(picture, title, recipe, instructions));
        distributeCards(i, div);
      } else {
        getRemoteJson(idURL).then(function(res){
          recipe = removeFalse(ingsToArray(res.drinks[0], 'strIngredient', 'strMeasure'));
          instructions = (res.drinks[0].strInstructions);
          div.append(buildCard(picture, title, recipe, instructions));
          distributeCards(i, div);
        });
      }
    })
  })
});
