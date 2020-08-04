import axios from 'axios';
import { recipeApiBaseUri } from '../config';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }
    async getRecipe() {
        try {
            const url = `${recipeApiBaseUri}/get?rId=${this.id}`;
            console.log(`Getting recipe details [${url}]`);
            const response = await axios(url);
            this.title = response.data.recipe.title;
            this.author = response.data.recipe.publisher;
            this.img = response.data.recipe.image_url;
            this.url = response.data.recipe.source_url;
            this.ingredients = response.data.recipe.ingredients;
        }
        catch(error) {
            alert(error);
        }
    }
    calcTime() {
        //Assume we need 15 minutes for each 3 ingredients:
        const nbrOfIngredients = this.ingredients.length;
        const nbrOfPeriods = Math.ceil(nbrOfIngredients / 3);
        this.time = nbrOfPeriods * 15;
    }
    calcServings() {
        //Could be some complex algorithm here:
        this.servings = 4;
    }
    parseIngredients() {
        //IMPORTANT: Does NOT cover all of the edge cases, but pretty close!!!
        const longUnits  = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const shortUnits = ['tbsp',        'tbsp',       'oz',     'oz',     'tsp',      'tsp',      'cup',  'pound'];
        const units = [...shortUnits, 'kg', 'g'];        //NOTE: Uses ES6 destructuring!!!
        const newIngredients = this.ingredients.map(element => {
            //Translate long units to short ones:
            let ingredient = element.toLowerCase();
            longUnits.forEach((longUnit, index) => {
                ingredient = ingredient.replace(longUnit, shortUnits[index]);
            });

            //Remove text between parentheses:
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

            //Parse ingredient into count, unit and text:
            const ingredientArray = ingredient.split(' ');
            const unitIndex = ingredientArray.findIndex(element => units.includes(element));
            console.log('Ingredient unit index is [' + unitIndex + '] in [' + ingredientArray + ']');
            let ingredientObject;
            if (unitIndex > -1) {
                //Has unit:
                //Example 1: '4 cups'     then countArray ['4']
                //Example 2: '4 1/2 cups' then countArray ['4', '1/2'] --> eval('4+1/2') --> 4.5
                //Example 3: '1-1/3 cup'  then countArray ['3', '1/3'] --> eval('1+1/3') --> 1.334 
                const countArray = ingredientArray.slice(0, unitIndex);
                let count;
                if (countArray.length === 1) {
                    count = eval(ingredientArray[0].replace('-', '+'));
                }
                else {
                    count = eval(ingredientArray.slice(0, unitIndex).join('+'));
                }
                ingredientObject = {
                    count,     //NOTE: Do not need property name if its the same
                    unit: ingredientArray[unitIndex],
                    text: ingredientArray.slice(unitIndex + 1).join(' ')
                };
            }
            else if (parseInt(ingredientArray[0])) {
                //Has a number, but no unit:
                ingredientObject = {
                    count: parseInt(ingredientArray[0]),
                    unit: '',
                    text: ingredientArray.slice(1).join(' ')
                };
            }
            else if (unitIndex === -1) {
                //NO unit and NO number in 1st position:
                ingredientObject = {
                    count: 1,
                    unit: '',
                    text: ingredient
                };
            }
            return ingredientObject;
        });
        this.ingredients = newIngredients;
    }
    updateServings(type) {
        const newServings = type === 'decrease' ? this.servings - 1 : this.servings + 1;
        this.ingredients.forEach(ingredient => {
            ingredient.count *= (newServings / this.servings);  //Adjust each ingredient
        });
        this.servings = newServings;
    }
}
