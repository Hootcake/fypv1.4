import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { FoodPalInventoryModule } from './inventory/inventory.module';
import { FoodPalCategoryModule } from './category/category.module';
/* jhipster-needle-add-entity-module-import - JHipster will add entity modules imports here */

@NgModule({
    imports: [
        FoodPalInventoryModule,
        FoodPalCategoryModule,
        /* jhipster-needle-add-entity-module - JHipster will add entity modules here */
    ],
    declarations: [],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FoodPalEntityModule {}
