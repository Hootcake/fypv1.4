import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Recommend } from './recommend.model';
import { RecommendService } from './recommend.service';
import { Principal, ResponseWrapper } from '../../shared';
import { InventoryService } from "../inventory/inventory.service";
import { Inventory } from "../inventory/inventory.model";


@Component({
    selector: 'jhi-recommend',
    templateUrl: './recommend.component.html'
})
export class RecommendComponent implements OnInit, OnDestroy {
    userInventory = new Array();
    categories = new Array();
    ingredientNames = new Array();
    fruitInventory = new Array();
    vegInventory = new Array();
    meatInventory = new Array();
    grainInventory = new Array();
    testVar: Boolean = true;
    itemCategory: Boolean = false;
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;

    
    constructor(
        private RecommendService: RecommendService,
        private inventoryService: InventoryService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private activatedRoute: ActivatedRoute,
        private principal: Principal
    ) {
        this.currentSearch = this.activatedRoute.snapshot && this.activatedRoute.snapshot.params['search'] ?
            this.activatedRoute.snapshot.params['search'] : '';
    }

    loadAll() {
        this.userInventory = this.userInventory;
        return this.userInventory; 
    }

    search(query) {
        if (!query) {
            return this.clear();
        }
        this.currentSearch = query;
        this.loadAll();
    }

    clear() {
        this.currentSearch = '';
        this.loadAll();
    }
    
    ngOnInit() {
        this.inventoryService.query().subscribe(
                (res: ResponseWrapper) => {
                    this.userInventory = res.json;
                    console.log(this.userInventory);
                    this.findInventoryCategoryAndName(this.userInventory);
                },
                (res: ResponseWrapper) => this.onError(res.json)
            );
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
      
        this.registerChangeInRecommends();

    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: Recommend) {
        return item.id;
    }
    
    findInventoryCategoryAndName(inventories){
        for(let inventory of inventories){
           if(inventory.category.id === 3)
               this.fruitInventory.push(inventory);
           if(inventory.category.id === 1)
               this.meatInventory.push(inventory); 
           if(inventory.category.id === 4)
               this.vegInventory.push(inventory);
           if(inventory.category.id === 2)
               this.grainInventory.push(inventory);
           this.ingredientNames.push(inventory.ingredient_name.toLowerCase());
        }
        console.log( this.categories );
        console.log( this.ingredientNames );
        console.log( this.fruitInventory );
    }
    
    test(){
        this.testVar = false;
        this.itemCategory = true;
    }
    
    listIngredients(query: string){
            switch(query){
            case "meat":
                 console.log("mmm meat");
            }
    }
    
    registerChangeInRecommends() {
        this.eventSubscriber = this.eventManager.subscribe('recommendListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
