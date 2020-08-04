import axios from 'axios';
import { recipeApiBaseUri } from '../config';

export default class Search {
    constructor(query) {
        this.query = query;
    }
    async getRecipes() {
        try {
            const url = `${recipeApiBaseUri}/search?q=${this.query}`;
            console.log(`Getting recipes [${url}]`);
            const response = await axios(url);
            this.recipes = response.data.recipes;     
        }
        catch(error) {
            alert(error);
        }
    }
}
