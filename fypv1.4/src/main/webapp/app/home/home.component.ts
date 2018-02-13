import { Component, OnInit, Input } from '@angular/core';
import { NgbModalRef, NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';
import { Account, LoginModalService, Principal, RecipeListService } from '../shared';

@Component({
  selector: 'ngbd-modal-content',
  template: `
    <div class="modal-header">
      <h4 class="modal-title">Recipe info</h4>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <p>Recipe name: {{name}}!</p>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-outline-dark" (click)="activeModal.close('Close click')">Close</button>
    </div>
  `
})
export class NgbdModalContent {
  @Input() name;

  constructor(public activeModal: NgbActiveModal) {}
}


@Component({
    selector: 'jhi-home',
    templateUrl: './home.component.html',
    styleUrls: [
        'home.css'
    ]

})
export class HomeComponent implements OnInit {
    account: Account;
    modalRef: NgbModalRef;
    recipes: any[];
    ingredients = new Array();
    recipeParam: string = "";
    public details;
    model = {
            left: false,
            middle: false,
            right: false
          };
    recipeFound: boolean = false;
    recipeDetailsFound: boolean = false;
    constructor(
        private principal: Principal,
        private loginModalService: LoginModalService,
        private eventManager: JhiEventManager,
        private _recipeListService: RecipeListService,
        private modalService: NgbModal
        ) {
    }

    ngOnInit() {
        this.principal.identity().then((account) => {
            this.account = account;
        });
        this.registerAuthenticationSuccess();
    }

    registerAuthenticationSuccess() {
        this.eventManager.subscribe('authenticationSuccess', (message) => {
            this.principal.identity().then((account) => {
                this.account = account;
            });
        });
    }

    isAuthenticated() {
        return this.principal.isAuthenticated();
    }

    login() {
        this.modalRef = this.loginModalService.open();
    }
    handleSuccess(data){
        this.recipeFound = true;
        this.recipes = data.matches;
        console.log(data.matches);
    }
    
    handleDetails(data, recipeDetail){
        this.recipeDetailsFound = true;
        recipeDetail = data.yield;
        console.log(data.id);
        console.log(recipeDetail); 
        this.open(recipeDetail)
    }
    
    handleError(error){
        console.log(error);
    }
    
    searchDetail(query: string){
        return this._recipeListService.getDetails(query).subscribe(
                data => this.handleDetails(data, query),
                error => this.handleError(error),
                () => console.log("Request Complete!"))
    }
    
    deleteIngredient(ingredient: string){
        console.log(this.ingredients.indexOf(ingredient));
        this.ingredients.splice(this.ingredients.indexOf(ingredient), 1);
        this.refreshSearch();
    }
    
    refreshSearch(){
        this.recipeParam = "";
        for(let ingredient of this.ingredients){
            this.recipeParam += '&allowedIngredient=' + ingredient;
        }
        if(this.model.middle == true){
            this.recipeParam += '&allowedDiet[]=388^Lacto vegetarian';
        }
        return this._recipeListService.getRecipe(this.recipeParam).subscribe(
                data => this.handleSuccess(data),
                error => this.handleError(error),
                () => console.log("Request Complete!"))
    }
    
    searchRecipes(query: string){
        this.recipeParam = "";
        this.ingredients.push(query);
        console.log(this.ingredients);
        for(let ingredient of this.ingredients){
            this.recipeParam += '&allowedIngredient=' + ingredient;
        }
        if(this.model.middle == true){
            this.recipeParam += '&allowedDiet[]=388^Lacto vegetarian';
        }
        return this._recipeListService.getRecipe(this.recipeParam).subscribe(
                data => this.handleSuccess(data),
                error => this.handleError(error),
                () => console.log("Request Complete!"))
    }
    
    open(query: string) {
      const modalRef = this.modalService.open(NgbdModalContent);
      modalRef.componentInstance.name = query;
      console.log(query + 'TEST')
    }
}
