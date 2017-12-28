import { Injectable } from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
@Injectable()
export class RecipeSearchService{
    private query: string;
    private API_KEY: string = "44fa9c8a86df0132b658b7b8556058c6";
    private API_URL: string = "http://api.yummly.com/v1/api/recipes?_app_id=eb1cba50&_app_key=";
    private URL: string = this.API_URL + this.API_KEY + '&allowedIngredient=';
    constructor(private _http: Http){
    }
    
    getRecipe(query){
        return this._http.get(this.URL + query)
        .map(res => res.json());
        
        
    }

}