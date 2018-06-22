import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {JhiAlertService, JhiEventManager} from 'ng-jhipster';

import {BlogEntryService} from '../entities/blog-entry';
import {BlogService} from '../entities/blog';

import {Account, LoginModalService, Principal} from '../shared';
import {BlogEntry} from '../entities/blog-entry';
import {Blog} from '../entities/blog';
import {HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {ActivatedRoute, Params} from '@angular/router'
import {DomSanitizer, SafeValue} from "@angular/platform-browser";
import {SafeHtml} from "@angular/platform-browser/src/security/dom_sanitization_service";
import {HttpClient} from "@angular/common/http";


@Component({
    selector: 'jhi-demo',
    templateUrl: './demo.component.html',
    styleUrls: [
        'demo.scss'
    ], inputs: [
    ]

})
export class DemoComponent implements OnInit {
    account: Account;
    modalRef: NgbModalRef;
    blog: Blog;
    blogEntries: BlogEntry[] = [{id: 'id', title: 'title'}];

    evenCategoryEarlyTravelBlogEntries: BlogEntry[] = [];
    oddCategoryEarlyTravelBlogEntries: BlogEntry[] = [];
    evenCategoryTravelBlogEntries: BlogEntry[] = [];
    oddCategoryTravelBlogEntries: BlogEntry[] = [];
    categoryEarlyTravelBlogEntries: BlogEntry[] = [];
    evenCategoryInspirationBlogEntries: BlogEntry[] = [];
    oddCategoryInspirationBlogEntries: BlogEntry[] = [];

    currentBlogEntry: BlogEntry;
    currentBlogEntryText: SafeHtml;
    imageUrls: any;
    currentBlogEntryGalleryUrls: SafeValue[] = [];
    isNavbarCollapsed: boolean;

    isOverview = true;
    @Output()
    adminButtonToggled: EventEmitter<boolean> = new EventEmitter<boolean>();

    slideIndex = 1;


    constructor(private principal: Principal,
                private loginModalService: LoginModalService,
                private eventManager: JhiEventManager,
                private jhiAlertService: JhiAlertService,
                private blogService: BlogService,
                private blogEntryService: BlogEntryService,
                private activatedRoute: ActivatedRoute,
                private domSanitizer: DomSanitizer,
                private http: HttpClient
    ) {
        this.isNavbarCollapsed = true;
    }

    ngOnInit() {
        console.log("load blog entries ...");
        this.loadBlogEntries();
        this.loadImageUrls();

        //this.showSlides(this.slideIndex);
        console.log("demo component constructed ... ");
    }

    /**
     * Todo: extract to service or resource
     */
    private loadBlogEntries() {
        this.blogEntryService.query().subscribe(
            (res: HttpResponse<BlogEntry[]>) => {
                this.blogEntries = res.body;
                this.assignEvenAndOddBlogEntries();
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    /**
     * Todo: extract to service or resource
     */
    private loadImageUrls() {
        this.http.get<string[]>('api/imageurls', { params: {}, observe: 'response' })
            .subscribe(
                data => {
                    console.log(data.body);
                    this.imageUrls = data.body;
                    console.log(data);
                    console.log("Imageurls loaded ...");
                    console.dir(this.imageUrls);
                },
                err => console.log(err)
            );
    }

    private assignEvenAndOddBlogEntries() {

        for (let i = 0; i < this.blogEntries.length; i++) {
            if (i % 2 === 0) {
                if (this.blogEntries[i].category === "travel") {
                    this.evenCategoryTravelBlogEntries.push(this.blogEntries[i]);
                } else if (this.blogEntries[i].category === "earlyTravel") {
                    this.categoryEarlyTravelBlogEntries.push(this.blogEntries[i]);
                } else if (this.blogEntries[i].category === "inspiration") {
                    this.evenCategoryInspirationBlogEntries.push(this.blogEntries[i]);
                }

            } else {
                if (this.blogEntries[i].category === "travel") {
                    this.oddCategoryTravelBlogEntries.push(this.blogEntries[i]);
                } else if (this.blogEntries[i].category === "earlyTravel") {
                    this.categoryEarlyTravelBlogEntries.push(this.blogEntries[i]);
                } else if (this.blogEntries[i].category === "inspiration") {
                    this.oddCategoryInspirationBlogEntries.push(this.blogEntries[i]);
                }
            }
        }
    }


    createImageUrlFor(blogEntry: BlogEntry): string {
        return 'data:' + blogEntry.pictureContentType + ';base64,' + blogEntry.picture;
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }

    toggleAdmin() {
        console.log("admin toggled in component demo.component");
        this.adminButtonToggled.emit(true);
    }

    showBlogEntry(blogEntry: BlogEntry) {
        console.log("-----------> showBlogEntry ##############################################");
        this.isOverview = false;
        this.currentBlogEntry = blogEntry;
        this.currentBlogEntryText = this.trustHtml(this.currentBlogEntry.text);

        console.log("-----------> set currentBlogEntryGalleryUrls to length 0 and display #####");
        this.currentBlogEntryGalleryUrls.length = 0;
        console.dir(this.currentBlogEntryGalleryUrls);

        console.log("-----------> display imageUrls ###########################################");
        console.dir(this.imageUrls);


        console.log("-----------> display currentBlogEntry.cloudDirectorydisplay ##############");
        console.log(this.currentBlogEntry.cloudDirectory);

        console.log("-----------> set currentBlogEntryGalleryUrls to imageUrls and display ####");
        if (this.imageUrls[this.currentBlogEntry.cloudDirectory]) {
            this.currentBlogEntryGalleryUrls = this.imageUrls[this.currentBlogEntry.cloudDirectory].slice();
        }
        console.dir(this.currentBlogEntryGalleryUrls);
    }

    showHomePageAndToggleNavbar() {
        this.isOverview = true;
        this.toggleNavbar();
    }

    toggleNavbar() {
        this.isNavbarCollapsed = !this.isNavbarCollapsed;
    }

    trustHtml(text: string) {
        return this.domSanitizer.bypassSecurityTrustHtml(text);
    }

    trustUrl(url: string) {
        return this.domSanitizer.bypassSecurityTrustUrl(url)
    }

    openModal(){
        console.log("open Modal");
        document.getElementById('myModal').style.display = "block";
    }


    closeModal() {
        console.log("close Modal");
        document.getElementById('myModal').style.display = "none";
        this.showNavbar(true);

    }

    // Next/previous controls
    plusSlides(n) {
        let newSlideIndex = this.slideIndex += n;
        this.showSlides(newSlideIndex);
    }

    // Thumbnail image controls
    currentSlide(n) {
        this.slideIndex = n;
        this.showSlides(n);
    }

    showSlides(n) {
        console.log("n: " + n);
        console.log("slideIndex: " + this.slideIndex);
        this.showNavbar(false);
        console.dir(this.currentBlogEntryGalleryUrls);

        let slides = document.getElementsByClassName("mySlides");
        let dots = document.getElementsByClassName("demo");
        let captionText = document.getElementById("caption");
        if (n >= slides.length) {this.slideIndex = 0}
        if (n < 0) {this.slideIndex = slides.length}
        for (let i = 0; i < slides.length; i++) {
            slides[i]['style'].display = "none";
        }
        for (let i = 0; i < dots.length; i++) {
            dots[i].className = dots[i].className.replace(" active", "");
        }
        slides[this.slideIndex]['style'].display = "block";
        dots[this.slideIndex].className += " active";
        captionText.innerHTML = dots[this.slideIndex]['alt'];
    }

    private showNavbar(show) {
        let navbar = document.getElementsByClassName("navbar");
        for (let i = 0; i < navbar.length; i++) {
            if (show) {
                navbar[i]['style'].display = "block";
            } else {
                navbar[i]['style'].display = "none";
            }
        }
    }
}
