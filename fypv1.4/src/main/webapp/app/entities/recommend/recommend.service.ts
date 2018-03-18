import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { Recommend } from './recommend.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class RecommendService {

    private resourceUrl =  SERVER_API_URL + 'api/recommends';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/recommends';

    constructor(private http: Http) { }

    create(recommend: Recommend): Observable<Recommend> {
        const copy = this.convert(recommend);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    update(recommend: Recommend): Observable<Recommend> {
        const copy = this.convert(recommend);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    find(id: number): Observable<Recommend> {
        return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    query(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http.get(this.resourceUrl, options)
            .map((res: Response) => this.convertResponse(res));
    }

    delete(id: number): Observable<Response> {
        return this.http.delete(`${this.resourceUrl}/${id}`);
    }

    search(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http.get(this.resourceSearchUrl, options)
            .map((res: any) => this.convertResponse(res));
    }

    private convertResponse(res: Response): ResponseWrapper {
        const jsonResponse = res.json();
        const result = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            result.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return new ResponseWrapper(res.headers, result, res.status);
    }

    /**
     * Convert a returned JSON object to Recommend.
     */
    private convertItemFromServer(json: any): Recommend {
        const entity: Recommend = Object.assign(new Recommend(), json);
        return entity;
    }

    /**
     * Convert a Recommend to a JSON which can be sent to the server.
     */
    private convert(recommend: Recommend): Recommend {
        const copy: Recommend = Object.assign({}, recommend);
        return copy;
    }
}
