import { DOMStrings, elements } from './base';
import { Fraction } from 'fractional';

export const clearRecipe = () => {
    elements.recipe.innerHTML = '';
};

export const renderRecipe = (recipe, isLiked)  => {
    const markup = `
        <figure class="recipe__fig">
            <img src="${recipe.img}" alt="${recipe.title}" class="recipe__img">
            <h1 class="recipe__title">
                <span>${recipe.title}</span>
            </h1>
        </figure>
        <div class="recipe__details">
            <div class="recipe__info">
                <svg class="recipe__info-icon">
                    <use href="img/icons.svg#icon-stopwatch"></use>
                </svg>
                <span class="recipe__info-data recipe__info-data--minutes">${recipe.time}</span>
                <span class="recipe__info-text"> minutes</span>
            </div>
            <div class="recipe__info">
                <svg class="recipe__info-icon">
                    <use href="img/icons.svg#icon-man"></use>
                </svg>
                <span class="recipe__info-data ${DOMStrings.recipeServings}">${recipe.servings}</span>
                <span class="recipe__info-text"> servings</span>
                <div class="recipe__info-buttons">
                    <button class="btn-tiny btn-decrease">
                        <svg>
                            <use href="img/icons.svg#icon-circle-with-minus"></use>
                        </svg>
                    </button>
                    <button class="btn-tiny btn-increase">
                        <svg>
                            <use href="img/icons.svg#icon-circle-with-plus"></use>
                        </svg>
                    </button>
                </div>
            </div>
            <button class="recipe__love">
                <svg class="header__likes">
                    <use href="img/icons.svg#icon-heart${isLiked ? '' : '-outlined'}"></use>
                </svg>
            </button>
        </div>
        <div class="recipe__ingredients">
            <ul class="recipe__ingredient-list">
                ${recipe.ingredients.map(element => createIngredient(element)).join('')}
            </ul>
            <button class="btn-small recipe__btn recipe__btn--add">
                <svg class="search__icon">
                    <use href="img/icons.svg#icon-shopping-cart"></use>
                </svg>
                <span>Add to shopping list</span>
            </button>
        </div>
        <div class="recipe__directions">
            <h2 class="heading-2">How to cook it</h2>
            <p class="recipe__directions-text">
                This recipe was carefully designed and tested by
                <span class="recipe__by">${recipe.author}</span>. Please check out directions at their website.
            </p>
            <a class="btn-small recipe__btn" href="${recipe.url}" target="_blank">
                <span>Directions</span>
                <svg class="search__icon">
                    <use href="img/icons.svg#icon-triangle-right"></use>
                </svg>
            </a>
        </div>`;
        elements.recipe.insertAdjacentHTML('afterbegin', markup);
};

const createIngredient = ingredient => `
    <li class="recipe__item">
        <svg class="recipe__icon">
            <use href="img/icons.svg#icon-check"></use>
        </svg>
        <div class="${DOMStrings.recipeCount}">${formatCount(ingredient.count)}</div>
        <div class="recipe__ingredient">
            <span class="recipe__unit">${ingredient.unit}</span>
            ${ingredient.text}
        </div>
    </li>
`;

export const updateServingsAndIngredients = recipe => {
    document.querySelectorAll(`.${DOMStrings.recipeServings}`).textContent = recipe.servings;
    Array.from(document.querySelectorAll(`.${DOMStrings.recipeCount}`)).forEach((element, index) => {
        element.textContent = formatCount(recipe.ingredients[index].count);  //Update each ingredient
    });
};

//NOTE: Uses third-party library!!!
const formatCount = count => {
    if (count) {
        //Example 1: 2.5 --> 2 1/2
        //Example 2: 0.5 --> 1/2
        //Example 3: 0.3333333 --> 1/3, but library displays 3333/10000 since its non-terminating
        const newCount = Math.round(count * 10000) / 10000;  //BUG FIX: Round to 4 decimal places
        const [integerPart, decimalPart] = newCount.toString().split('.').map(element => parseInt(element));
        if (!decimalPart)
            return newCount;
        if (integerPart === 0) {
            const fraction = new Fraction(newCount);
            return `${fraction.numerator}/${fraction.denominator}`;
        }
        const fraction = new Fraction(newCount - integerPart);
        return `${integerPart} ${fraction.numerator}/${fraction.denominator}`;
    }
    return '?';  //Not all cases are covered
};
