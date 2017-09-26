let foodAdapter;

function getKey(){
  return "OmTUYbNp6snavJ4PzBQLulDoHU97Wk98wCNqXyTw"
}

function deleteDiv(id_name){
  document.querySelector('#'+ id_name).innerHTML = ""
}

function getFoodGroups(){
  fetch(`https://api.nal.usda.gov/ndb/list?format=json&lt=g&sort=n&api_key=${getKey()}`)
    .then(res => res.json())
    .then(json => createList(json))
}

function createList(json){
  deleteDiv("container-for-fg")
  deleteDiv("container-for-f")
  deleteDiv("container-for-n")
  let container = document.querySelector("#container-for-fg")
  json.list.item.forEach(item =>{
    let fgDiv = document.createElement("div")
    fgDiv.className = 'col-3 fg-card'
    let innerDiv = document.createElement('div')
    innerDiv.innerText = item.name
    fgDiv.appendChild(innerDiv)
    // fgDiv.innerText = item.name
    fgDiv.dataset.id = item.id
    fgDiv.addEventListener("click", getFood)
    container.appendChild(fgDiv)
  })
}

function nextPageFood(e) {
  foodAdapter.increaseOffset()
  foodAdapter.fetch()
    .then(res => res.json())
    .then(json => createFood(json))
}

function backPageFood(e) {
  foodAdapter.decreaseOffset()
  foodAdapter.fetch()
    .then(res => res.json())
    .then(json => createFood(json))
}

function createFood(json){
  deleteDiv("container-for-fg")
  deleteDiv("container-for-f")
  deleteDiv("container-for-n")
  let container = document.querySelector("#container-for-f")
  let gridContainer = document.createElement('div')
  gridContainer.className = 'row'
  container.appendChild(gridContainer)
  json.list.item.forEach(item =>{
    let fDiv = document.createElement("div")
    fDiv.className = 'col-3 fg-card'
    fDiv.innerText = item.name.length < 80 ? item.name : item.name.slice(0,77) + '...'
    fDiv.dataset.ndbno = item.ndbno
    fDiv.addEventListener("click", getNutrients)
    gridContainer.appendChild(fDiv)
  })
  let nextPage = document.createElement('div')
  nextPage.className = 'btn btn-primary'
  nextPage.innerText = 'Next Page'
  nextPage.addEventListener('click', nextPageFood)
  container.appendChild(nextPage)
  if (foodAdapter.offset > 0) {
    let backPage = document.createElement('div')
    backPage.className = 'btn btn-primary'
    backPage.innerText = 'Previous Page'
    backPage.addEventListener('click', backPageFood)
    container.appendChild(backPage)
  }
  let backToFoodGroups = document.createElement('div')
  backToFoodGroups.className = 'btn btn-primary'
  backToFoodGroups.innerText = 'Back to Foods'
  backToFoodGroups.addEventListener('click', getFoodGroups)
  container.appendChild(backToFoodGroups)
}

function goBackToFoods() {
  foodAdapter.fetch()
    .then(res => res.json())
    .then(json => createFood(json))
}

function truncateNutrient(nutrient){

  let nutrientsArray = nutrient.report.food.nutrients
  let selectedNutrients = {
    name: nutrient.report.food.name,
    tableInfo: {
      "Energy": 0,
      "Protein": 0,
      "Total lipid (fat)": 0,
      "Carbohydrate, by difference": 0,
      "Cholesterol": 0
    }
  }
  nutrientsArray.forEach(n =>{
    if(selectedNutrients.tableInfo.hasOwnProperty(n.name)){
      selectedNutrients.tableInfo[n.name] = n.value
    }
  })
  return selectedNutrients
}

function displayNutrients(json){
  deleteDiv("container-for-f")
  let container = document.querySelector("#container-for-n")
  let img = document.createElement('img')
  let imgURL = fetch(`https://pixabay.com/api/?key=6228191-818526c7218f826ef865798fd&q=${json.name.split(',')[0].replace(/ /, '+')}&image_type=photo&per_page=3`)
    .then(res => res.json())
    .then((json)=> {
      console.log(json);
      img.src = json.hits[0].previewURL
    })
  let foodName = document.createElement('h2')
  foodName.innerText = json.name
  container.appendChild(foodName)
  container.appendChild(img)
  let table = document.createElement('table')
  table.innerHTML = Object.keys(json.tableInfo).map(nutrient=>`<tr> <td>${nutrient} </td> <td> ${json.tableInfo[nutrient]}</td> </tr>`).join("")
  container.appendChild(table)
  let backToFoods = document.createElement('div')
  backToFoods.className = 'btn btn-primary'
  backToFoods.innerText = 'Back to Foods'
  backToFoods.addEventListener('click', goBackToFoods)
  container.appendChild(backToFoods)
}

function getFood(e){
  let gId = e.currentTarget.dataset.id
  foodAdapter = new FoodAdapter(gId, 20)
  foodAdapter.fetch()
    .then(res => res.json())
    .then(json => createFood(json))
  // fetch(`https://api.nal.usda.gov/ndb/search/?format=json&fg=${gId}&api_key=${getKey()}`)
  // .then(res => res.json())
  // .then(json => createFood(json))
}

function getNutrients(e){
  let ndbno = e.currentTarget.dataset.ndbno
  fetch(`https://api.nal.usda.gov/ndb/reports/?format=json&type=b&ndbno=${ndbno}&api_key=${getKey()}`)
  .then(res => res.json())
  .then(nutrient => truncateNutrient(nutrient))
  .then(json => displayNutrients(json))
}

getFoodGroups()
