import Search from './models/Search';
import Recipe from './models/Recipe';
import ShoppingList from './models/ShoppingList';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as shoppingListView from './views/shoppingListView';
import * as likesView from './views/likesView';
import { elements, renderLoader, clearLoader, DOMStrings} from './views/base';

/*
 *  GLOBAL APP STATE
 */
const state = {};                                            //search, recipe, shoppingList or likes

/*
 * SEARCH CONTROLLER
 */
const searchController = async () => {
    const query = searchView.getInput();                     //Get query from view
    if (query) {
        state.search = new Search(query);                    //Create new search object and add it to state
        searchView.clearInput();                             //Clear search box
        searchView.clearRecipes();                           //Remove existing recipes
        renderLoader(elements.searchResults);                //AJAX loading spinner
        try {
            await state.search.getRecipes();                 //Search for recipes via API
            clearLoader();                                   //Remove AJAX spinner
            searchView.renderRecipes(state.search.recipes);  //Render results on the UI
        }
        catch(error) {
            clearLoader();
            alert(error);
        }
    }
};

elements.searchForm.addEventListener('submit', event => {
    event.preventDefault();  //Do not reload page
    searchController();
});

elements.searchResultsPages.addEventListener('click', event => {
    const paginationButton = event.target.closest(`.${DOMStrings.paginationContainer}`);
    const goToPageNbr = parseInt(paginationButton.dataset.goto);
    searchView.clearRecipes();
    searchView.clearPaginationButtons();
    searchView.renderRecipes(state.search.recipes, goToPageNbr);  //Render new page on the UI
});

/*
 * RECIPE CONTROLLER
 */
const recipeController = async () => {
    const id = window.location.hash.replace('#', '');  //Get recipe ID from URI
    if (id) {
        recipeView.clearRecipe();                      //Remove existing recipe
        if (state.search)
            searchView.highlightSelected(id);          //Highlight selected search item
        renderLoader(elements.recipe);                 //AJAX loading spinner
        state.recipe = new Recipe(id);                 //Create new recipe
        try {
            await state.recipe.getRecipe();            //Get recipe data via API
            state.recipe.calcTime();                   //Estimated preparation time
            state.recipe.calcServings();               //Estimated number of servings
            state.recipe.parseIngredients();           //Standardize ingredient list
            clearLoader();                             //Remove AJAX spinner
            recipeView.renderRecipe(                   //Render recipe (just a call)
                state.recipe,
                state.likes.isLiked(id)
            );
        }
        catch(error) {
            clearLoader();
            alert(error);
        }
    }
};

//Fires any time page is (re)loaded or a different hash (recipe ID) is selected:
['load', 'hashchange'].forEach(event => window.addEventListener(event, recipeController));

/*
 * SHOPPING LIST CONTROLLER
 */
const shoppingListController = () => {
    //Create a new shopping list (if needed):
    if (!state.shoppingList)
        state.shoppingList = new ShoppingList();
    //Add each ingredient:
    state.recipe.ingredients.forEach(element => {
        const newItem = state.shoppingList.addItem(element.count, element.unit, element.text);
        shoppingListView.renderItem(newItem);
    });
};

//Handle shopping list add and update list items:
elements.shoppingList.addEventListener('click', event => {
    const id = event.target.closest('.shopping__item').dataset.itemid;
    //Delete button:
    if (event.target.matches('.shopping__delete, .shopping__delete *')) {
        console.log('Deleting id [' + id + "]");
        state.shoppingList.deleteItem(id);  //Delete from state
        shoppingListView.deleteItem(id);    //Delete from UI
    }
    //Count update buttons:
    else if (event.target.matches('.shopping__count-value')) {
        const newCount = parseFloat(event.target.value);
        console.log('Updating count for id [' + id + '] to [' + newCount +']');
        state.shoppingList.updateCount(id, newCount);
    }
});

/*
 * LIKES CONTROLLER
 */
const likesController = () => {
    if (!state.likes)
        state.likes = new Likes();
    const id = state.recipe.id;
    if (!state.likes.isLiked(id)) {
        //User has NOT yet liked the current recipe:
        const newLike = state.likes.addLike(
                            id, 
                            state.recipe.title, 
                            state.recipe.author, 
                            state.recipe.img);              //Add to state (just calling method here)
        likesView.toggleLikesButton(true);                  //Toggle Likes button (full heart)
        likesView.renderLikeMenu(newLike);                  //Render to UI
    }
    else {
        //User HAS liked the current recipe:
        console.log('Delete Like ID', id);
        state.likes.removeLike(id);                         //Remove from state
        likesView.toggleLikesButton(false);                 //Toggle the Like button (empty heart)
        likesView.deleteLike(id);                           //Remove from UI list
    }
    likesView.toggleLikeMenu(state.likes.getNbrOfLikes());  //Show likes menu only if there is at least one item
};

//Restore liked recipes on page load:
window.addEventListener('load', () => {
    state.likes = new Likes();
    state.likes.restoreData();                                          //Restore likes state from local storage
    likesView.toggleLikeMenu(state.likes.getNbrOfLikes());              //Toggle like menu button
    state.likes.likes.forEach(like => likesView.renderLikeMenu(like));  //Render existing likes to UI
    console.log('Restored and rendered [' + state.likes.getNbrOfLikes() + '] likes from local storage');
});

//Recipe buttons:
elements.recipe.addEventListener('click', event => {
    //NOTE: All CSS Selectors also match any child element!!!
    if (event.target.matches('.btn-decrease, .btn-decrease *')) {
        //Decrease button:
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('decrease');
            recipeView.updateServingsAndIngredients(state.recipe);
            console.log('Adjusted', state.recipe);
        }
    }
    else if (event.target.matches('.btn-increase, .btn-increase *')) {
        //Increase button:
        state.recipe.updateServings('increase');
        recipeView.updateServingsAndIngredients(state.recipe);
        console.log('Adjusted', state.recipe);
    }
    else if (event.target.matches(`.recipe__btn--add, .recipe__btn--add *`)) {
        //Add (ingredients) to shopping list button:
        shoppingListController();
    }
    else if (event.target.matches('.recipe__love, .recipe__love *')) {
        //Likes button:
        likesController();
    }
});
