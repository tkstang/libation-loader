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

function measureIng(ing, measurement){
  if ( (!(measurement)) || (measurement === "\n") || (measurement === " ") ){
    return ing;
  } else if (!ing){
    return false;
  } else {
    return ing + ": " + measurement;
  }
}

function ingsToArray(object, ingString, measureString){
  let ingArray = [];
  for (let i = 1; i <= 15; i++){
    let numIngString = ingString + i;
    let numMeasureString = measureString + i;
    ingArray.push(measureIng(object[numIngString], object[numMeasureString]))
  }
  return ingArray;
}

function removeFalse(ingArray){
  let string = "";
  for (let j = 0; j < ingArray.length; j++){
    if (ingArray[j]){
      string = `${string}<br>${ingArray[j]}`;
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

let searchType = 'cocktail name';
function determineURL(searchType, searchInput){
  if(searchType === 'ingredient'){
    return `http://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${searchInput}`;
  } else if(searchType === 'cocktail name'){
    return `http://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchInput}`;
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
  let alcoholicFilter = document.getElementById('alcoholic-filter').value;
  let searchInput = form.children[0].children[0].children[0].value;
  let searchURL = determineURL(searchType, searchInput);
  // let url = `http://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchInput}`;

  getRemoteJson(searchURL).then(function(res) {
    let drinkResults = res.drinks;
    drinkResults = filterAlcContent(alcoholicFilter, drinkResults);
    drinkResults.forEach(function(ele, i) {
      let div = document.createElement('div');
      let picture = ele.strDrinkThumb;
      let title = ele.strDrink;
      let instructions = ele.strInstructions
      let recipe = removeFalse(ingsToArray(ele, 'strIngredient', 'strMeasure'));


      if (!picture){
        picture = "img/whiskey.jpg";
      }
      let cardString = `<div class='card'><div class='card-image waves-effect waves-block waves-light'><img class='activator responsive-img' src='${picture}' height='300' width='200px'></div><div class='card-content'><span class='card-title activator grey-text text-darken-4'>${title}<i class='material-icons right'>more_vert</i></span><p><a href='#'>This is a link</a></p></div><div class='card-reveal'><span class='card-title grey-text text-darken-4'>${title}<i class='material-icons right'>close</i></span><p id='recipe'>${recipe}</p><br><p id='instructions'>${instructions}</p></div></div>`;
      div.innerHTML = cardString;
      distributeCards(i, div);
    })
  })
});
