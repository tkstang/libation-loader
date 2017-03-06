$(document).ready(function() {
  $('select').material_select();
  $(".dropdown-button").dropdown();
});

const submit = document.getElementById('submit-search');
const content = document.getElementById('content');
const form = document.getElementById('search-form');
const formRow = document.getElementById('form-row');
const randomRow = document.getElementById('random-row');
const landing = document.getElementById('landing');
const favorites = document.getElementById('favorites-row')
const loadLanding = document.getElementById('load-landing');
const loadFavs = document.getElementById('load-favs');
const loadSearch = document.getElementById('load-search');
const linkName = document.getElementById('search-name');
const linkIng = document.getElementById('search-ingredient');
const linkCat = document.getElementById('search-category');
const linkRandom = document.getElementById('search-random');
const searchResults1 = document.getElementById('search-results1');
const searchResults2 = document.getElementById('search-results2');
const randomResults = document.getElementById('random-results');
const searchRow = document.getElementById('search-row');
const hiddenCard = document.getElementById('hidden');
const catInput = document.getElementById('cat-select');
const catLabel = document.getElementById('cat-label');
const categorySearch = document.getElementById('category-select');
const ingredientInput = document.getElementById('ingredient-input');
const cocktailInput = document.getElementById('cocktail-input');
const ingredientSearch = document.getElementById('ingredient');
const cocktailSearch = document.getElementById('cocktail-name');
const activeSelected = document.getElementsByClassName('cocktail-name');
const favList = document.getElementById('favorites-list');
const $toastContent = $('<span>Sorry but your search did not return any results. <br>There are some ways to try to improve your search results: <br>If you are searching by ingredient try adjusting your ingredient. <br>(For Example: If you entered "soda," try "soda water" or "club soda")<span>');
let searchType = 'cocktail name';
let favCocktails = [];

let myHeaders = new Headers();

let myInit = { method: 'GET',
               headers: myHeaders,
               mode: 'no-cors',
               cache: 'default' };

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
  } else if ((value === 'showAll') || (value === '')){
      return true;
  }
  return false;
}

function filterLiquor(value, results){
  if (value === 'Select a Liquor'){
    return results;
  } else {
    return results.filter(element => containsValue(element, value));
  }
}

function containsValue(drinkObject, value){
  let found = false;
  if (value === 'Show All' || 'Select a Liquor'){
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

function addToStorage(cocktailObject){
  if (localStorage.getItem("favorites") === null){
    localStorage.setItem("favorites", '[]');
  }
  favCocktails = JSON.parse(localStorage.getItem("favorites"));
  if (favCocktails.indexOf(cocktailObject) === -1){
    favCocktails.push(cocktailObject);
    localStorage.setItem("favorites", JSON.stringify(favCocktails));
    console.log(favCocktails);
    console.log(window.localStorage);
  }
}

function buildCard(picture, title, recipe, instructions){
	const cardClone = hiddenCard.cloneNode(true);
	const cardChildren = cardClone.children;
	const addFavoriteIcon = cardChildren[2].children[3];
  cardClone.removeAttribute("style");
	cardChildren[0].children[0].src = picture;
	cardChildren[1].children[0].innerHTML = `${title}<i class='material-icons right'>more_vert</i>`;
	cardChildren[2].children[0].innerHTML = `${title}<i class='material-icons right'>close</i>`;
	cardChildren[2].children[1].innerHTML = recipe;
	cardChildren[2].children[2].innerHTML = instructions;
  cardChildren[2].children[3].innerHTML = `<i class="material-icons" id="favorite">favorite_border</i>`;

  addFavoriteIcon.addEventListener("click", function(event){
    event.preventDefault();
    addFavoriteIcon.innerHTML = `<i class="material-icons">favorite</i>`;
    let cocktailObject = {
      drinkName: title,
      drinkPic: picture,
      recipe: recipe,
      instructions: instructions
    }
    addToStorage(cocktailObject);
  })
	return cardClone;
}

// Builds table of saved favorite cocktails
function buildFavorites(){
  favCocktails = JSON.parse(localStorage.getItem("favorites"));
  favCocktails.forEach(function(element){
    let listItem = document.getElementById('collapsible-skeleton');
    listItem = listItem.cloneNode(true);
    listItem.removeAttribute("style");
    listItem.children[0].innerHTML = `<i class="material-icons" id="favorite">favorite</i>${element.drinkName}`;
    listItem.children[1].children[0].children[0].innerHTML = element.recipe;
    listItem.children[1].children[0].children[3].innerHTML = element.instructions;
    favList.appendChild(listItem);
  })
}

//Fetches from API and returns object
function getRemoteJson(url, settings) {
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
  let input = form.children[2].children[0].children[0];
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
  while (randomResults.firstChild) {
    randomResults.removeChild(randomResults.firstChild);
  }
}

// Loads search form to page
function loadSearchForm(){
	removeResults();
	landing.setAttribute("style", "display: none");
	favorites.setAttribute("style", "display: none");
  randomRow.setAttribute("style", "display: none");
  form.setAttribute("style", "");
	formRow.setAttribute("style", "");
  removeSearchFields();
}

function loadRandom(){
	removeResults();
	landing.setAttribute("style", "display: none");
	favorites.setAttribute("style", "display: none");
  form.setAttribute("style", "display: none");
	formRow.setAttribute("style", "display: none");
  randomRow.setAttribute("style", "");
  removeSearchFields();
}

// Removes search fields from page
function removeSearchFields(){
  while (searchRow.firstChild) {
    searchRow.removeChild(searchRow.firstChild);
  }
}

// Removes content from page
function removeContent(element){
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

//Function to determine if search returns no results and notify user
function noResults(drinkResults, drinksAfterFilter){
  if (drinkResults === null){
    Materialize.toast($toastContent, 8000);
  } else if (drinksAfterFilter === false){
    Materialize.toast($toastContent, 8000);
  }
}


function append(append, appendTo){
  let clone = append.cloneNode(true);
  clone.removeAttribute("style");
  appendTo.appendChild(clone);
}

// Clones hidden search field and appends
function appendSearchField(searchField){
  let clone = searchField.cloneNode(true);
  clone.removeAttribute("style");
  searchRow.appendChild(clone);
}

loadLanding.addEventListener("click", function(event){
  event.preventDefault();
  removeResults();
  randomRow.setAttribute("style", "display: none");
  formRow.setAttribute("style", "display: none");
  favorites.setAttribute("style", "display: none");
  landing.setAttribute("style", "");
});

// loadSearch.addEventListener("click", function(event){
//   event.preventDefault();
// 	loadSearchForm();
//   appendSearchField(cocktailSearch);
// 	searchType = "cocktail name";
// });

loadFavs.addEventListener("click", function(event){
  event.preventDefault();
  removeResults();
  landing.setAttribute("style", "display: none");
  formRow.setAttribute("style", "display: none");
  favorites.setAttribute("style", "");
  buildFavorites();
});

linkIng.addEventListener("click", function(event){
  event.preventDefault();
	loadSearchForm()
  appendSearchField(ingredientSearch);
	searchType = 'ingredient';
});

linkName.addEventListener("click", function(event){
  event.preventDefault();
	loadSearchForm();
  appendSearchField(cocktailSearch);
  searchType = 'cocktail name';
})

linkCat.addEventListener("click", function(event){
  event.preventDefault();
	loadSearchForm();
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
  loadRandom();
  //style random-row for top margin instead of using line breaks
  // let resRow = document.getElementById("random-row");
  let randomIndex = (Math.floor(Math.random() * allDrinksArr.length));
  let randomDrink = allDrinksArr[randomIndex];
  let div = document.createElement('div');
  let picture = randomDrink.strDrinkThumb;
  let title = randomDrink.strDrink;
  let instructions = randomDrink.strInstructions
  if (!picture){
    picture = "img/whiskey.jpg";
  }
  let recipe = removeFalse(ingsToArray(randomDrink, 'strIngredient', 'strMeasure'));
  div.append(buildCard(picture, title, recipe, instructions));
  $('#random-results')[0].append(div);
})

// linkRandom.addEventListener("click", function(event){
//   event.preventDefault();
//   removeResults();
//   getRemoteJson('https://www.thecocktaildb.com/api/json/v1/1/random.php', myInit)
//   .then(function(result) {
//     let randomDrink = result.drinks[0];
//     let div = document.createElement('div');
//     let picture = randomDrink.strDrinkThumb;
//     let title = randomDrink.strDrink;
//     let instructions = randomDrink.strInstructions
//     if (!picture){
//       picture = "img/whiskey.jpg";
//     }
//     let recipe = removeFalse(ingsToArray(randomDrink, 'strIngredient', 'strMeasure'));
//     div.append(buildCard(picture, title, recipe, instructions));
//     distributeCards(0, div);
//   })
// })

form.addEventListener("submit", function(event){
  event.preventDefault();
  removeResults();
  let alcoholicFilter = document.getElementById('alcoholic-filter').value;
  let liquorSelect = document.getElementById('liquor-filter');
  let liquorFilter = liquorSelect.options[liquorSelect.selectedIndex].text;
  let searchURL = determineURL(searchType, getSearchInput(searchType));
  console.log(searchURL);
  getRemoteJson(searchURL, myInit).then(function(res) {
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
        // change relevant lets to const
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
          getRemoteJson(idURL, myInit).then(function(res){
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
