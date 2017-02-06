const submit = document.getElementById('submit-search');
const form = document.getElementById('search-form');
const searchResults1 = document.getElementById('search-results1');
const searchResults2 = document.getElementById('search-results2');

// ​function getRemoteJson(url) {
//   return fetch(url);
//   .then(function(res){
//     return res.json();
//   })
//   .then(function(jsonresult){
//     console.log(jsonresult);
//   })
// }

function getRemoteJson(url) {
  return fetch(url)
  .then(function(res) {
    console.log('promise1');
    return res.json();
  })
  .then(function(jsonresult){
    console.log(jsonresult);
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


form.addEventListener("submit", function(){
	let searchInput = document.getElementById('cocktail-name').value;
	let url = `http://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchInput}`;
  console.log(url);
  // let url = 'http://www.thecocktaildb.com/api/json/v1/1/search.php?s=margarita';
	console.log(searchInput);
	console.log(url);
  console.log(getRemoteJson(url));
  getRemoteJson(url).then(function(res) {
    let drinkResults = res.drinks;
    drinkResults.forEach(function(ele, i) {
      let div = document.createElement('div');
      let picture = ele.strDrinkThumb;
      let title = ele.strDrink;
      let instructions = ele.strInstructions
console.log(ele.strIngredient1);
      let ing1 = measureIng(ele.strIngredient1, ele.strMeasure1);
      console.log(ing1);
      if (!picture){
        picture = "img/whiskey.jpg";
      }
      let cardString = `<div class='card'><div class='card-image waves-effect waves-block waves-light'><img class='activator responsive-img' src='${picture}' height='300' width='200px'></div><div class='card-content'><span class='card-title activator grey-text text-darken-4'>${title}<i class='material-icons right'>more_vert</i></span><p><a href='#'>This is a link</a></p></div><div class='card-reveal'><span class='card-title grey-text text-darken-4'>${title}<i class='material-icons right'>close</i></span><p>${ing1}</p><br><p>${instructions}</p></div></div>`;
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
