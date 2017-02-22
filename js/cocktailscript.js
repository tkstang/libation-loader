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
  console.log('test');
  return fetch(url);
}

let drinksArray = [];
let drinksArray2 = [];
let urlArray = [];
let allCocktails;
let allCocktails2;

for (let i = 15000; i <= 15000; i++){
  let url = `http://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${i}`;
  urlArray.push(url);
}

let drinkPromises = urlArray.map(url => getRemoteJson(url));

Promise.all(drinkPromises)
  .then(function(results){
    results.forEach(function(element){
      if (element.drinks !== null){
        drinksArray.push(element.drinks[0]);
      }
    })
    let div = document.createElement('div');
    // console.log(JSON.stringify(drinksArray));
    div.innerText = JSON.stringify(drinksArray);
    let body = document.getElementsByTagName("body")[0];
    body.append(div);
})
