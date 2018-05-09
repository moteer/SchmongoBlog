import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService, JhiDataUtils } from 'ng-jhipster';

import { Blog } from './blog.model';
import { BlogService } from './blog.service';
import { Principal } from '../../shared';

@Component({
    selector: 'jhi-blog',
    templateUrl: './blog.component.html'
})
export class BlogComponent implements OnInit, OnDestroy {
    blogs: Blog[];
    currentAccount: any;
    eventSubscriber: Subscription;
    //latestBlog: Blog = new Blog("0", "Intial Title", "initialPictureContentType", "initialPicture");
    latestBlog: Blog = {
        id: "0",
        title: "Intial Title",
        pictureContentType: "initialPictureContentType",
        picture: "initialPicture"
    };
    imageUrl: string = "";

    constructor(
        private blogService: BlogService,
        private jhiAlertService: JhiAlertService,
        private dataUtils: JhiDataUtils,
        private eventManager: JhiEventManager,
        private principal: Principal
    ) {
    }



    loadAll() {
        this.blogService.query().subscribe(
            (res: HttpResponse<Blog[]>) => {
                this.blogs = res.body;
                this.latestBlog = this.blogs[0];
                console.log(this.latestBlog.pictureContentType);
                console.log(this.latestBlog.picture);

                this.imageUrl = 'data:' + this.latestBlog.pictureContentType + ';base64,' + this.latestBlog.picture;
                console.log("*************************************************************************************");
                console.log('data:' + this.latestBlog.pictureContentType + ';base64,' + this.latestBlog.picture);
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }
    ngOnInit() {
        this.loadAll();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInBlogs();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: Blog) {
        return item.id;
    }

    byteSize(field) {
        return this.dataUtils.byteSize(field);
    }

    openFile(contentType, field) {
        return this.dataUtils.openFile(contentType, field);
    }

    registerChangeInBlogs() {
        this.eventSubscriber = this.eventManager.subscribe('blogListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
