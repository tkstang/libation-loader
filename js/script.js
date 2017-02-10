$(document).ready(function() {
  $('select').material_select();
  $(".dropdown-button").dropdown();
});

const submit = document.getElementById('submit-search');
const form = document.getElementById('search-form');
const linkName = document.getElementById('search-name');
const linkIng = document.getElementById('search-ingredient');
const linkCat = document.getElementById('search-category');
const linkRandom = document.getElementById('search-random');
const searchResults1 = document.getElementById('search-results1');
const searchResults2 = document.getElementById('search-results2');
const searchRow = document.getElementById('search-row');
const hiddenCard = document.getElementById('hidden');
const catInput = document.getElementById('cat-select');
const catLabel = document.getElementById('cat-label');
const ingredientInput = document.getElementById('ingredient-input');
const cocktailInput = document.getElementById('cocktail-input');
const ingredientSearch = document.getElementById('ingredient');
const cocktailSearch = document.getElementById('cocktail-name');
const activeSelected = document.getElementsByClassName('cocktail-name');
const $toastContent = $('<span>Sorry but your search did not return any results. <br>There are some ways to try to improve your search results: <br>If you are searching by ingredient try adjusting your ingredient. <br>(For Example: If you entered "soda," try "soda water" or "club soda")<span>');
let searchType = 'cocktail name';

function filterAlcContent(value, results){
  if (value === 'noBooze'){
    return results.filter(element => element.strAlcoholic === "Non alcoholic");
  } else if (value === 'showBooze'){
    return results.filter(element => element.strAlcoholic === "Alcoholic");
  } else {
    return results;
  }
}

//Alcoholic/Virgin filter For individual drinks that Require additional API Call
function deepFilterAlc(value, result){
  if ((result.strAlcoholic === "Non alcoholic") && (value === 'noBooze')){
    return true;
  } else if ((result.strAlcoholic === "Alcoholic") && (value === 'showBooze')){
      return true;
  } else if (value === 'showAll'){
      return true;
  } else if (value === ''){
      return true;
  }
  return false;
}

//Filters results to a specific liquor
function filterLiquor(value, results){
  if (value === 'Select A Liquor'){
    return results;
  } else {
    return results.filter(element => containsValue(element, value));
  }
}

//Determines if drink object contains a value
function containsValue(drinkObject, value){
  let found = false;
  if (value === 'Show All'){
		found = true;
	} else {
    Object.keys(drinkObject).forEach(function(key) {
      let keyVal = drinkObject[key];
      if (found === true){
        return found;
      } else if (keyVal === null){
        found = false;
      } else if (keyVal.includes(value)){
        found = true;
        return found;
      } else if (keyVal.includes(value.toLowerCase())){
        found = true;
        return found;
      }
    });
  }
  return found;
}

//Builds drink cards
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

//Fetches from API and returns object
function getRemoteJson(url) {
  return fetch(url)
  .then(function(res) {
    return res.json();
  })
  .then(function(jsonresult){
    return jsonresult;
  })
  .catch(function(error){
    Materialize.toast($toastContent, 10000);
    console.log('Your error was: ('+error+') ')
    throw error;
  });
  return fetch(url);
}

//Converts a given ingredient and its measurement into a string
function measureIngredient(ingredient, measurement){
  if ( (!(measurement)) || (measurement === "\n") || (measurement === " ") ){
    return ingredient;
  } else if (!ingredient){
    return false;
  } else {
    return ingredient + ": " + measurement;
  }
}

//Takes all ingredients from drink and puts into an array
function ingsToArray(object, ingString, measureString){
  let ingsArray = [];
  for (let i = 1; i <= 15; i++){
    let numIngString = ingString + i;
    let numMeasureString = measureString + i;
    ingsArray.push(measureIngredient(object[numIngString], object[numMeasureString]))
  }
  return ingsArray;
}

//Removes empty ingredient-measurement strings and returns single recipe string
function removeFalse(ingsArray){
  let string = "";
  for (let j = 0; j < ingsArray.length; j++){
    if (ingsArray[j]){
      string = `${string}<br>${ingsArray[j]}`;
    }
  }
  return string;
}

//Distributes cards evenly between columns
function distributeCards(index, div){
  if (index === 0){
    searchResults1.appendChild(div);
  } else if (index % 2 === 0){
    searchResults1.appendChild(div);
  } else {
    searchResults2.appendChild(div);
  }
}

//Gets the value of a given search field
function getSearchInput(searchType){
  let input = form.children[0].children[0].children[0];
  let searchValue = '';
  if ((searchType === 'cocktail name') || (searchType === 'ingredient') ){
    searchValue = input.value;
  } else if (searchType === 'category'){
  let catSelect = document.getElementById('cat-select');
  searchValue = catSelect.options[catSelect.selectedIndex].text;
  } else if (searchType === 'random'){
    searchValue = randomInput.value
  }
  return searchValue;
}

// Sets default search type to 'cocktail name';
// Determines the correct URL to use in getRemoteJson function
function determineURL(searchType, searchInput){
  if(searchType === 'ingredient'){
    return `https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${searchInput}`;
  } else if(searchType === 'cocktail name'){
    return `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchInput}`;
  } else if(searchType === 'category'){
    return `https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=${searchInput}`;
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

// Removes search fields from page
function removeSearchFields(){
  while (searchRow.firstChild) {
    searchRow.removeChild(searchRow.firstChild);
  }
}

//Function to determine if search returns no results and notify user
function noResults(drinkResults, drinksAfterFilter){
  debugger;
  if (drinkResults === null){
    Materialize.toast($toastContent, 8000);
  } else if (drinksAfterFilter === false){
    Materialize.toast($toastContent, 8000);
  }
}

// Clones hidden search field and appends
function appendSearchField(searchField){
  let clone = searchField.cloneNode(true);
  clone.removeAttribute("style");
  searchRow.appendChild(clone);
}

linkIng.addEventListener("click", function(event){
  event.preventDefault();
  removeSearchFields();
  appendSearchField(ingredientSearch);
	searchType = 'ingredient';
});

linkName.addEventListener("click", function(event){
  event.preventDefault();
  removeSearchFields();
  appendSearchField(cocktailSearch);
  searchType = 'cocktail name';
})

linkCat.addEventListener("click", function(event){
  event.preventDefault();
  removeSearchFields();
  let div = document.createElement('div');
  div.className = 'input-field';
  div.id = 'category-select';
  let divClone = catInput.cloneNode(true);
  div.appendChild(divClone);
  div.appendChild(catLabel);
  searchRow.appendChild(div);
  searchType = 'category';
  $('select').material_select();
})

linkRandom.addEventListener("click", function(event){
  event.preventDefault();
  removeResults();
  getRemoteJson('https://www.thecocktaildb.com/api/json/v1/1/random.php')
  .then(function(result) {
    let randomDrink = result.drinks[0];
    let div = document.createElement('div');
    let picture = randomDrink.strDrinkThumb;
    let title = randomDrink.strDrink;
    let instructions = randomDrink.strInstructions
    if (!picture){
      picture = "img/whiskey.jpg";
    }
    let recipe = removeFalse(ingsToArray(randomDrink, 'strIngredient', 'strMeasure'));
    div.append(buildCard(picture, title, recipe, instructions));
    distributeCards(0, div);
  })
})

form.addEventListener("submit", function(event){
  event.preventDefault();
  removeResults();
  let alcoholicFilter = document.getElementById('alcoholic-filter').value;
  let liquorSelect = document.getElementById('liquor-filter');
  let liquorFilter = liquorSelect.options[liquorSelect.selectedIndex].text;
  let searchURL = determineURL(searchType, getSearchInput(searchType));
  console.log(searchURL);
  getRemoteJson(searchURL).then(function(res) {
    let drinkResults = res.drinks;
    let drinksAfterFilter = false;
    let drinkCount = drinkResults.length
    if (drinkResults === null){
      Materialize.toast($toastContent, 10000)
    } else {
    if (searchType === 'cocktail name'){
        drinkResults = filterAlcContent(alcoholicFilter, drinkResults);
        drinkResults = filterLiquor(liquorFilter, drinkResults);
    }
    drinkResults.forEach(function(ele, i) {
      let id = ele.idDrink;
      let idURL = `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`;
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
        count = drinkResults.length;
        getRemoteJson(idURL).then(function(res){
          count--;
          if (count === 0){
            noResults(drinkResults, drinksAfterFilter);
          }
          let currDrink = res.drinks[0];
          if ( (deepFilterAlc(alcoholicFilter, currDrink)) && (containsValue(currDrink, liquorFilter)) ){
            drinksAfterFilter = true;
            recipe = removeFalse(ingsToArray(currDrink, 'strIngredient', 'strMeasure'));
            instructions = (currDrink.strInstructions);
            div.append(buildCard(picture, title, recipe, instructions));
            distributeCards(i, div);
          }
        });
      }
    })
    }
  })
});
