import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SERVER_API_URL } from '../app.constants';

@Injectable()
export class CloudImageService {

    private resourceUrl =  SERVER_API_URL + 'api/imageurls';
    private imageUrls: any = null;

    constructor(private http: HttpClient) { }

    loadImageUrls() : string[] {
        console.debug("Load image urls ...");
        if (this.imageUrls === null) {
            console.debug("Load image urls from cloud ...");
            this.http.get<string[]>(this.resourceUrl, { params: {}, observe: 'response' })
                .subscribe(
                    data => {
                        console.debug("Imageurls loaded ...");
                        console.debug(data.body);
                        this.imageUrls = data.body;
                        console.debug(data);
                        console.debug(this.imageUrls);
                    },
                    err => console.log(err)
                );
        }
        return this.imageUrls;
    }
}
