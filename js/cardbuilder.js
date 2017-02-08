function buildCard(picture, title, recipe, instructions){
	let cardDiv = document.createElement('div');
	cardDiv.className = 'card-image waves-effect waves-block waves-light';
	let cardImage = document.createElement('img');
	cardImage.className = 'activator responsive-img';
	cardImage.src = picture;
	cardDiv.append(cardImage);
	let cardContent = document.createElement('div');
	cardContent.className = 'card-content';
	let titleSpan = document.createElement('span');
	titleSpan.className = 'card-title activator grey-text text-darken-4';
	titleSpan.innerText = title;
	let moreIcon = document.createElement('i');
	moreIcon.className = 'material-icons right';
	moreIcon.innerText = 'more_vert';
	titleSpan.append(moreIcon);
	cardContent.append(titleSpan);
	cardDiv.append(cardContent);
	let revealDiv = document.createElement('div');
	revealDiv.className = 'card-reveal';
	let revealSpan = document.createElement('span');
	revealSpan.className = 'card-title grey-text text-darken-4';
	revealSpan.innerText = title;
	let closeIcon = document.createElement('i');
	closeIcon.className = 'material-icons right';
	moreIcon.innerText = close;
	revealSpan.append(closeIcon);
	revealDiv.append(revealSpan);
	let recipeP = document.createElement('p');
	recipeP.id = 'recipe';
	recipeP.innerHTML = recipe;
	revealDiv.append(recipeP);
	let instP = document.createElement('p');
	instP.id = 'instructions';
	instP.innerHTML = instructions;
	revealDiv.append(instP);
	cardDiv.append(revealDiv);
	return cardDiv;
}

let ingSearchClone = ingredientSearch.cloneNode(true);
console.log(ingSearchClone);
ingSearchClone.removeAttribute("style");
div.appendChild(ingSearchClone);
console.log(div);

searchIng.addEventListener("click", function(event){
  event.preventDefault();
  form.children[0].removeChild(form.children[0].children[0]);
  let ingSearchClone = ingredientSearch.cloneNode(true);
  console.log(ingSearchClone);
  ingSearchClone.removeAttribute("style");
  searchRow.appendChild(ingSearchClone);
  $(document).ready(function() {
    $('select').material_select();
  });
  // let div = document.createElement('div');
  // div.className = 'input-field';
  // div.innerHTML = `<input placeholder="Enter an Ingredient to Search" id="ingredient" type="text" class="validate"><label for="ingredient" class="active">Ingredient</label>`;
  // searchRow.appendChild(div);
  searchType = 'ingredient';
})


      let cardString = `<div class='card'><div class='card-image waves-effect waves-block waves-light'><img class='activator responsive-img' src='${picture}' height='300' width='200px'></div><div class='card-content'><span class='card-title activator grey-text text-darken-4'>${title}<i class='material-icons right'>more_vert</i></span><p><a href='#'>This is a link</a></p></div><div class='card-reveal'><span class='card-title grey-text text-darken-4'>${title}<i class='material-icons right'>close</i></span><p id='recipe'>${recipe}</p><br><p id='instructions'>${instructions}</p></div></div>`;
