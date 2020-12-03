const meals = document.getElementById('meals');

getRandomMeal();

async function getRandomMeal(){
    const resp = await fetch("link");

    const respData = await resp.json();
    const randomMeal = respData.meals[0];

    // console.log(randomMeal);

    addMeal(randomMeal, true);
}

async function getMealById(id){
    const resp = await fetch("link"+id);

    const respData = await resp.json();
    const meal = respData.meals[0];

    return meal;
}

async function getMealsBySearch(term){
    const meals = await fetch("link"+term);
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

    meal.querySelector(".meal-body .fav-btn").addEventListener('click', ()=>{
        if(btn.classList.contains('active')){
            removeMealsFromLS(mealData.idMeal);
            btn.classList.remove("active");
        }else{
            addMealToLS(mealData.idMeal);
            btn.classList.add("active");
        }
        
    });

    meals.appendChild(meal);
}

function addMealToLS(mealId){
    const mealIds = getMealsFromLS();

    localStorage.setItem('mealIds', JSON.stringify([...mealIds, mealId]));
}

function removeMealToLS(mealId){
    const mealIds = getMealsFromLS();

    localStorage.setItem('mealIds', JSON.stringify(mealIds.filter((id)=>id!==mealId)));
}

function getMealsFromLS(){
    const mealIds = JSON.parse(localStorage.getItem('mealIds'));

    return mealIds === null ? [] : mealIds;
}

async function fetchFavMeals(){
    const mealIds = getMealsFromLS();

    const meals = [];

    for(let i=0; i<mealIds.length; i++){
        const mealId = mealIds[i];

        meal = await getMealById(mealId);
        meals.push(meal);
    }

    console.log(meals);
}