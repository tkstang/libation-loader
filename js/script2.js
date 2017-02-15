$(document).ready(function() {
  $('select').material_select();
  $(".dropdown-button").dropdown();
});

let submit;
const content = document.getElementById('content');
let form = document.getElementById('search-form');
const landing = document.getElementById('landing');
const linkName = document.getElementById('search-name');
const linkIng = document.getElementById('search-ingredient');
const linkCat = document.getElementById('search-category');
const linkRandom = document.getElementById('search-random');
const loadLanding = document.getElementById('load-landing');
const loadFavs = document.getElementById('load-favs');
const loadSearch = document.getElementById('load-search');
const searchResults1 = document.getElementById('search-results1');
const searchResults2 = document.getElementById('search-results2');
// const searchRow = document.getElementById('search-row');
const hiddenCard = document.getElementById('hidden');
const categorySearch = document.getElementById('category-select');
const catInput = document.getElementById('cat-select');
const catLabel = document.getElementById('cat-label');
let ingredientInput = document.getElementById('ingredient-input');
let cocktailInput;
const ingredientSearch = document.getElementById('ingredient');
const hiddenCocktail = document.getElementById('hidden-cocktail');
const cocktailLabel = document.getElementById('cocktail-label');

// let cocktailSearch = document.getElementById('cocktail-name');
let cocktailSearch;
const activeSelected = document.getElementsByClassName('cocktail-name');
const $toastContent = $('<span>Sorry but your search did not return any results. <br>There are some ways to try to improve your search results: <br>If you are searching by ingredient try adjusting your ingredient. <br>(For Example: If you entered "soda," try "soda water" or "club soda")<span>');
let searchType = 'cocktail name';
let searchRow;
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
function getRemoteJson(url, settings) {

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
  // console.log($('#search-row').children[0].children[0]);
  // searchRow = $('#search-row');
  console.log(searchRow);
  let input = searchRow.children[0].children[0];
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
function removeSearchFields(element){
  console.log(element);
  console.log(element.children()[0]);
  element.children()[0].remove();
  console.log(element.children()[0]);
}

function removeContent(){
  while (landing.firstChild) {
    landing.removeChild(landing.firstChild);
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


// Clones hidden search field and appends

function prepend(prepend, prependTo){
  let clone = prepend.cloneNode(true);
  prependTo.prepend(clone);
}

// function appendSearchField(searchField){
//   let clone = searchField.cloneNode(true);
//   clone.removeAttribute("style");
//   searchRow.appendChild(clone);
// }

function buildSearch(){
  // debugger;
	form = document.createElement('form');
	form.id = "search-form";
	form.className = "col s12";
	searchRow = document.createElement('div');
	searchRow.id = "search-row";
	searchRow.className = "row";
	form.appendChild(searchRow);
	let cocktailClone = cocktailSearch.cloneNode(true);
	cocktailSearch.removeAttribute("style");
	searchRow.appendChild(cocktailClone);
}

// function appendForm(){
//   form = $("<form/>",
//             { "class": 'col s12',
//               id: 'search-form' }
//           );
//
//   content.append( $("#search-form") );
//   form.append( $("<br>") );
//   form.append( $("<br>") );
//   searchRow = $("<div/>",
//                 { "class": 'row',
//                   id: 'search-row' }
//               );
//   form.append( $("#search-row"));
//   cocktailSearch = $("<div/>",
//                       { "class": 'input-field',
//                         id: 'cocktail-name' }
//                     );
//   searchRow.append( $("#cocktail-name"));
//
// }
let searchForm;

// function appendForm(){
//   // debugger;
//   let searchForm = document.getElementById('search-form');
//   searchForm.removeAttribute("style");
//   console.log(searchForm);
//   let clone = searchForm.cloneNode(true);
//   clone.removeAttribute("style");
//   clone.id = 'appended-form';
//   content.appendChild(clone);
//   let appendedForm = document.getElementById('appended-form');
//   searchRow = appendedForm.children[2];
//   // cocktailSearch = $('#cocktail-name');
//   // searchRow.append('cocktailSearch');
//   buttonRow = appendedForm.children[7].children[0];
//   // buttonRow.removeChild(buttonRow.firstChild);
//   buttonRow.innerHTML = `<input type="submit" class="btn-large waves-effect waves-light grey valign" id="submit-search" value="I'm Thirsty">`
//   console.log(buttonRow);
//   submit = document.getElementById("submit-search");
//   console.log(submit);
//   $('select').material_select();
// 	// debugger;
//   // submit.onsubmit;
//   appendedForm.addEventListener("submit", formSubmit(event));
//     // $('select').material_select();
// }
let alcFilterSelect = document.getElementById('alcFilter-select');
let alcFilterLabel = document.getElementById('alcFilter-label');
let liqFilterSelect = document.getElementById('liqFilter-select');
let liqFilterLabel = document.getElementById('liqFilter-label');
let newLiqSelect;
let newAlcSelect;

let appendedForm;
function appendForm(){
  appendedForm = $("<form/>",
    { "class": "col s12",
      id: "appended-form" }
    ).append('<br>')
    .append('<br>')
    .append($('<div/>', { id: "search-row"}))
    .append($('<div/>', { 'class': "row center",
                          id: "submit-div"}));
  $("#content").append(appendedForm);
  searchRow = document.getElementById('search-row');
  cocktailSearch = document.createElement('div');
  cocktailSearch.className = 'input-field';
  searchRow.append(cocktailSearch);
  cocktailSearch.appendChild(hiddenCocktail);
  cocktailSearch.appendChild(cocktailLabel);

  let alcFilter = document.createElement('div');
  alcFilter.className = 'input-field';
  alcFilter.appendChild(alcFilterLabel);
  searchRow.append(alcFilter);
  alcFilter.appendChild(alcFilterSelect);
  $('select').material_select();

  let liqFilter = document.createElement('div');
  liqFilter.innerHTML = '<label for="liquor-filter">Choose to Filter Results to a Specific Liquor</label>';
  liqFilter.className = 'input-field';
	liqFilter.id = 'liquor-filter';
  searchRow.append(liqFilter);
  liqFilter.appendChild(liqFilterSelect);
  $('select').material_select();

  $('#submit-div').append($('<input>', {  type: "submit",
                                          "class": 'btn-large waves-effect waves-light grey',
                                          id: 'submit-search',
                                          value: "I'm Thirsty" }));

  submit = document.getElementById("submit-search");
  $("#appended-form").on("submit", function(event){
      event.preventDefault();
      removeResults();

      let alcoholicFilter = alcFilterSelect.value;
      let liquorSelect = liqFilterSelect;
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
          debugger;
          let id = ele.idDrink;
          let idURL = `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`;
          let div = document.createElement('div');
          let picture = ele.strDrinkThumb;
          let title = ele.strDrink;
          let instructions = ele.strInstructions;
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


  };


loadSearch.addEventListener("click", function(event){
  event.preventDefault();
  removeContent();
  $("#search-form").show();
    $("#search-form").removeAttr('style');
    // $('#l').css('display', '')
    $('select').material_select();
});

loadLanding.addEventListener("click", function(event){
  event.preventDefault();
  removeContent();
  prepend(landing, content);
});

linkIng.addEventListener("click", function(event){
  event.preventDefault();
  removeSearchFields(searchRow);
  prepend(ingredientSearch, searchRow);
  ingredientInput = $('#ingredient-input');
	searchType = 'ingredient';
});

linkName.addEventListener("click", function(event){
  event.preventDefault();
  removeSearchFields(searchRow);
  prepend(cocktailSearch, searchRow);
  searchType = 'cocktail name';
})

linkCat.addEventListener("click", function(event){
  event.preventDefault();
  console.log(form);
  removeSearchFields(searchRow);
  let div = document.createElement('div');
  div.className = 'input-field';
  div.id = 'category-select';
  let divClone = catInput.cloneNode(true);
  div.appendChild(divClone);
  div.appendChild(catLabel);
  searchRow.prepend(div);
    $('select').material_select();
  searchType = 'category';
})

linkRandom.addEventListener("click", function(event){
  event.preventDefault();
  removeResults();
  getRemoteJson('https://www.thecocktaildb.com/api/json/v1/1/random.php', myInit)
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



// function formSubmit(event){
//   event.preventDefault();
//   removeResults();
//   let alcoholicFilter = document.getElementById('alcFilter-Select').value;
//   let liquorSelect = document.getElementById('liqFilter-Select');
//   let liquorFilter = liquorSelect.options[liquorSelect.selectedIndex].text;
//   let searchURL = determineURL(searchType, getSearchInput(searchType));
//   console.log(searchURL);
//   getRemoteJson(searchURL, myInit).then(function(res) {
//     let drinkResults = res.drinks;
//     let drinksAfterFilter = false;
//     let drinkCount = drinkResults.length
//     if (drinkResults === null){
//       Materialize.toast($toastContent, 10000)
//     } else {
//     if (searchType === 'cocktail name'){
//         drinkResults = filterAlcContent(alcoholicFilter, drinkResults);
//         drinkResults = filterLiquor(liquorFilter, drinkResults);
//     }
//     drinkResults.forEach(function(ele, i) {
//       let id = ele.idDrink;
//       let idURL = `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`;
//       let div = document.createElement('div');
//       let picture = ele.strDrinkThumb;
//       let title = ele.strDrink;
//       let instructions = ele.strInstructions;
//       let recipe = '';
//       if (!picture){
//         picture = "img/whiskey.jpg";
//       }
//       if (searchType === 'cocktail name'){
//         recipe = removeFalse(ingsToArray(ele, 'strIngredient', 'strMeasure'));
//         div.append(buildCard(picture, title, recipe, instructions));
//         distributeCards(i, div);
//       } else {
//         count = drinkResults.length;
//         getRemoteJson(idURL, myInit).then(function(res){
//           count--;
//           if (count === 0){
//             noResults(drinkResults, drinksAfterFilter);
//           }
//           let currDrink = res.drinks[0];
//           if ( (deepFilterAlc(alcoholicFilter, currDrink)) && (containsValue(currDrink, liquorFilter)) ){
//             drinksAfterFilter = true;
//             recipe = removeFalse(ingsToArray(currDrink, 'strIngredient', 'strMeasure'));
//             instructions = (currDrink.strInstructions);
//             div.append(buildCard(picture, title, recipe, instructions));
//             distributeCards(i, div);
//           }
//         });
//       }
//     })
//     }
//   })
// }
