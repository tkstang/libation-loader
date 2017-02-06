$(document).ready(function() {
  $('select').material_select();
});

const submit = document.getElementById('submit-search');
const form = document.getElementById('search-form');
const searchResults1 = document.getElementById('search-results1');
const searchResults2 = document.getElementById('search-results2');
// ${ing1}<br>${ing2}<br>${ing3}<br>${ing4}<br>${ing5}<br>${ing6}<br>${ing7}<br>${ing8}<br>${ing9}<br>${ing10}

// ​function getRemoteJson(url) {
//   return fetch(url);
//   .then(function(res){
//     return res.json();
//   })
//   .then(function(jsonresult){
//     console.log(jsonresult);
//   })
// }

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
  if (!ing){
    return false;
  }
  return ing + ": " + measurement;
}

// function numberIngs(ingString, measureString){
//   for (let i = 1; i <= 15; i++){
//     numIngs.push(ingString + i);
//     numMeasure.push(measureString + i);
//   }
// }

// function ingsToArray(ingString, measureString){
//   let ingArray = [];
//   console.log(ingString, measureString);
//   for (let i = 1; i <= 15; i++){
//     let numIngString = ingString + i;
//     let numMeasureString = measureString + i;
//     console.log(numIngString, numMeasureString);
//     ingArray.push(measureIng(`${numIngString}`, `${numMeasureString}`));
//   }
// 	console.log(ingArray);
//   return ingArray;
// }

function removeFalse(ingArray){
  let string = "";
  for (let j = 0; j < ingArray.length; j++){
    if (ingArray[j]){
      string = `${string}<br>${ingArray[j]}`;
    }
  }
  return string;
}
//
// function ingLister(numIngs, numMeasure, obj){
//   let numIngs = [];
//   let numMeasure = [];
//   let listIngs = [];
//   for (let i = 0; i < 15; i++){
//     while (!!(numIngs[i])){
//       let measuredIng = obj.numIngs[i] + ": " + obj.numMeasure[i];
//       listIngs.push(measuredIng);
//     }
//   }
//   return listIngs;
// }

form.addEventListener("submit", function(event){
  event.preventDefault();
	let searchInput = document.getElementById('cocktail-name').value;
  let alcoholicFilter = document.getElementById('alcoholic-filter').value;
	let url = `http://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchInput}`;
  // let url = 'http://www.thecocktaildb.com/api/json/v1/1/search.php?s=margarita';
  // console.log(getRemoteJson(url));
  getRemoteJson(url).then(function(res) {
    let drinkResults = res.drinks;
    // if (alcoholicFilter === 'noBooze'){
    //   drinkResults = drinkResults.filter(element => element.strAlcoholic === "Non alcoholic");
    // }
    drinkResults = filterAlcContent(alcoholicFilter, drinkResults);
    drinkResults.forEach(function(ele, i) {
      let div = document.createElement('div');
      let picture = ele.strDrinkThumb;
      let title = ele.strDrink;
      let instructions = ele.strInstructions
      let ing1 = measureIng(ele.strIngredient1, ele.strMeasure1);
			let ing2 = measureIng(ele.strIngredient2, ele.strMeasure2);
			let ing3 = measureIng(ele.strIngredient3, ele.strMeasure3);
			let ing4 = measureIng(ele.strIngredient4, ele.strMeasure4);
			let ing5 = measureIng(ele.strIngredient5, ele.strMeasure5);
			let ing6 = measureIng(ele.strIngredient6, ele.strMeasure6);
			let ing7 = measureIng(ele.strIngredient7, ele.strMeasure7);
			let ing8 = measureIng(ele.strIngredient8, ele.strMeasure8);
			let ing9 = measureIng(ele.strIngredient9, ele.strMeasure9);
			let ing10 = measureIng(ele.strIngredient10, ele.strMeasure10);
      let ing11 = measureIng(ele.strIngredient11, ele.strMeasure11);
      let ing12 = measureIng(ele.strIngredient12, ele.strMeasure12);
      let ing13 = measureIng(ele.strIngredient13, ele.strMeasure13);
      let ing14 = measureIng(ele.strIngredient14, ele.strMeasure14);
      let ing15 = measureIng(ele.strIngredient15, ele.strMeasure15);
      let ingArray = [ing1, ing2, ing3, ing4, ing5, ing6, ing7, ing8, ing9, ing10, ing11, ing12, ing13, ing14, ing15];

      if (!picture){
        picture = "img/whiskey.jpg";
      }
      let cardString = `<div class='card'><div class='card-image waves-effect waves-block waves-light'><img class='activator responsive-img' src='${picture}' height='300' width='200px'></div><div class='card-content'><span class='card-title activator grey-text text-darken-4'>${title}<i class='material-icons right'>more_vert</i></span><p><a href='#'>This is a link</a></p></div><div class='card-reveal'><span class='card-title grey-text text-darken-4'>${title}<i class='material-icons right'>close</i></span><p>${removeFalse(ingArray)}</p><br><p>${instructions}</p></div></div>`;
      div.innerHTML = cardString;
      if (i === 0){
        searchResults1.appendChild(div);
      } else if (i % 2 === 0){
        searchResults2.appendChild(div);
      } else {
        searchResults1.appendChild(div);
      }
    })
  })
});
