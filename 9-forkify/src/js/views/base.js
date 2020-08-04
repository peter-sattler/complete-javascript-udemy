export const DOMStrings = {
    activeResultsLink: 'results__link--active',
    loader: 'loader',
    paginationContainer: 'btn-inline',
    recipeCount: 'recipe__count',
    recipeServings: 'recipe__info-data--people',
    resultsLink: 'results__link' 
};

export const elements = {
    searchForm: document.querySelector('.search'),
    searchInput: document.querySelector('.search__field'),
    searchResults: document.querySelector('.results'),
    searchResultsList: document.querySelector('.results__list'),
    searchResultsPages: document.querySelector('.results__pages'),
    recipe: document.querySelector('.recipe'),
    shoppingList: document.querySelector('.shopping__list'),
    likesMenu: document.querySelector('.likes__field'),
    likesList: document.querySelector('.likes__list')
};

//Reusable AJAX loading spinner:
export const renderLoader = parent => {
    const loader = `
        <div class="${DOMStrings.loader}">
            <svg>
                <use href="img/icons.svg#icon-cw"></use>
            </svg>
        </div>`;
    parent.insertAdjacentHTML('afterbegin', loader);
};

export const clearLoader = () => {
    const loader = document.querySelector(`.${DOMStrings.loader}`);
    if (loader)
        loader.parentElement.removeChild(loader);
};
