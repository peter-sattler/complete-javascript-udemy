import { DOMStrings, elements } from './base';

export const getInput = () => elements.searchInput.value;  //No return needed (implicit)

export const clearInput = () => {
    elements.searchInput.value = '';
};

export const highlightSelected = id => {
    //NOTE: This query selector cannot be part of elements because it gets added to the DOM after the page loads!!!
    Array.from(document.querySelectorAll(`.${DOMStrings.resultsLink}`)).forEach(element => {
        element.classList.remove(DOMStrings.activeResultsLink);
    });
    document.querySelector(`.${DOMStrings.resultsLink}[href="#${id}"]`).classList.add(DOMStrings.activeResultsLink);
};

export const clearRecipes = () => {
    elements.searchResultsList.innerHTML = '';
};

export const clearPaginationButtons = () => {
    elements.searchResultsPages.innerHTML = '';
};

//No need to export this one since its private:
const renderRecipe = recipe => {
    const markup = `
        <li>
            <a class="${DOMStrings.resultsLink}" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="${recipe.title}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>`;
    elements.searchResultsList.insertAdjacentHTML('beforeend', markup);
};

export const limitRecipeTitle = (title, limit = 17) => {
    if (title.length > limit) {
        const newTitle = [];
        title.split(' ').reduce((accumulator, current) => {
            if(accumulator === 0 && current.length > limit) {
                newTitle.push(current.substring(0, limit - 1));  //Truncate FIRST word
            }
            else if (accumulator + current.length <= limit) {
                newTitle.push(current);
            }
            return accumulator + current.length;                 //Update accumulator!!!
        }, 0);
        return `${newTitle.join(' ')}...`;
    }
    return title;
};

export const renderRecipes = (recipes, pageNbr = 1, resultsPerPage = 10) => {
    const start = (pageNbr - 1) * resultsPerPage;
    const end = pageNbr * resultsPerPage;
    recipes.slice(start, end).forEach(renderRecipe);  //Current page recipes
    console.log('Rendering pagination buttons: [' + pageNbr, recipes.length, resultsPerPage + ']');
    renderPaginationButtons(pageNbr, recipes.length, resultsPerPage);
};

const renderPaginationButtons = (pageNbr, nbrOfResults, resultsPerPage) => {
    const totalPages = Math.ceil(nbrOfResults / resultsPerPage);  //Always round up!!!
    let buttonMarkup;
    if (pageNbr === 1 && totalPages > 1) {
        buttonMarkup = createButton(pageNbr, 'next');
    }
    else if (pageNbr < totalPages ) {
        buttonMarkup = createButton(pageNbr, 'prev');
        buttonMarkup += createButton(pageNbr, 'next');
    }
    else if (pageNbr === totalPages && totalPages > 1) {
        buttonMarkup = createButton(pageNbr, 'prev');
    }
    elements.searchResultsPages.insertAdjacentHTML('afterbegin', buttonMarkup);
};

const createButton = (pageNbr, type) => `
    <button class="${DOMStrings.paginationContainer} results__btn--${type}" data-goto="${type === 'prev' ? pageNbr - 1 : pageNbr + 1}">
        <span>Page ${type === 'prev' ? pageNbr - 1 : pageNbr + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
    </button>
`;
