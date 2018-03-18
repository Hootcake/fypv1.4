/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { Headers } from '@angular/http';

import { FoodPalTestModule } from '../../../test.module';
import { RecommendComponent } from '../../../../../../main/webapp/app/entities/recommend/recommend.component';
import { RecommendService } from '../../../../../../main/webapp/app/entities/recommend/recommend.service';
import { Recommend } from '../../../../../../main/webapp/app/entities/recommend/recommend.model';

describe('Component Tests', () => {

    describe('Recommend Management Component', () => {
        let comp: RecommendComponent;
        let fixture: ComponentFixture<RecommendComponent>;
        let service: RecommendService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [FoodPalTestModule],
                declarations: [RecommendComponent],
                providers: [
                    RecommendService
                ]
            })
            .overrideTemplate(RecommendComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(RecommendComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(RecommendService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new Headers();
                headers.append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of({
                    json: [new Recommend(123)],
                    headers
                }));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.recommends[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
