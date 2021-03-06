const mealsEl = document.getElementById('meals');
const favContainer = document.getElementById('fav-meals');
const searchTerm = document.getElementById('search-term');
const searchBtn = document.getElementById('search');

getRandomMeal();
fetchFavMeals();

async function getRandomMeal(){
    const resp = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");

    const respData = await resp.json();
    const randomMeal = respData.meals[0];

    // console.log(randomMeal);

    addMeal(randomMeal, true);
}

async function getMealById(id){
    const resp = await fetch("https://www.themealdb.com/api/json/v1/1/lookup.php?i="+id);

    const respData = await resp.json();
    const meal = respData.meals[0];

    return meal;
}

async function getMealsBySearch(term){
    const resp = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s="+term);

    const respData = await resp.json();
    const meals = respData.meals;

    return meals;
}

function addMeal(mealData, random=false){
    console.log(mealData);
    const meal = document.createElement('div');
    meal.classList.add('meal');

    meal.innerHTML = `
        <div class="meal-header">
        ${random ?`<span class="random">Randome Recipe</span>`:``}
            <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}">
        </div>
        <div class="meal-body">
            <h4>${mealData.strMeal}</h4>
            <button class="fav-btn"><i class="far fa-heart"></i></button>
        </div>
    `;
    const btn = meal.querySelector(".meal-body .fav-btn");
    meal.querySelector(".meal-body .fav-btn").addEventListener('click', ()=>{
        if(btn.classList.contains('active')){
            removeMealsFromLS(mealData.idMeal);
            btn.classList.remove("active");
        }else{
            addMealToLS(mealData.idMeal);
            btn.classList.add("active");
        }

        fetchFavMeals();
        
    });

    meals.appendChild(meal);
}

function addMealToLS(mealId){
    const mealIds = getMealsFromLS();

    localStorage.setItem('mealIds', JSON.stringify([...mealIds, mealId]));
}

function removeMealsFromLS(mealId){
    const mealIds = getMealsFromLS();

    localStorage.setItem('mealIds', JSON.stringify(mealIds.filter((id)=>id!==mealId)));
}

function getMealsFromLS(){
    const mealIds = JSON.parse(localStorage.getItem('mealIds'));

    return mealIds === null ? [] : mealIds;
}

async function fetchFavMeals(){
    favContainer.innerHTML="";

    const mealIds = getMealsFromLS();

    for(let i=0; i<mealIds.length; i++){
        const mealId = mealIds[i];
        meal = await getMealById(mealId);
        addMealFav(meal);
    }

}

function addMealFav(mealData){
    const favMeal = document.createElement('li');

    favMeal.innerHTML = `
        <button class="clear"><i class="fas fa-window-close"></i></button>
        <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}">
        <span>${mealData.strMeal}</span>
    `;

    const btn = favMeal.querySelector(".clear");
    btn.addEventListener('click', ()=>{
        removeMealsFromLS(mealData.idMeal);
        fetchFavMeals();
    });

    favContainer.appendChild(favMeal);
}

searchBtn.addEventListener('click', async()=>{

    mealsEl.innerHTML = "";

    const search = searchTerm.value;

    const meals = await getMealsBySearch(search);
    if(meals){
    meals.forEach((meal) => {
        addMeal(meal);
    });
    }
});