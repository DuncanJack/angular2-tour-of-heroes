import { Component, OnInit }  from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { HeroSearchService } from './hero-search.service';
import { Hero } from './hero';

@Component({
    moduleId: module.id,
    selector: 'hero-search',
    templateUrl: 'hero-search.component.html',
    styleUrls: ['hero-search.component.css'],
    providers: [HeroSearchService]
})
export class HeroSearchComponent implements OnInit {
    private heroes: Observable<Hero[]>;

    // A Subject is a producer of an observable event stream.
    // searchTerms produces an Observable of strings, the filter criteria for the name search.
    // Each call to search puts a new string into this subject's observable stream by calling next.
    private searchTerms = new Subject<string>();    

    constructor(private heroSearchService: HeroSearchService, private router: Router) {
    }

    search(term: string): void {
        // Push a search term into the observable stream
        this.searchTerms.next(term);
    }

    ngOnInit(): void {
        this.heroes = this.searchTerms
            .debounceTime(300)                          // wait for 300ms pause in events
            .distinctUntilChanged()                     // ignore if next search term is same as previous
            .switchMap(term => term                     // switch to new observable each time
                ? this.heroSearchService.search(term)       // return the http search observable
                : Observable.of<Hero[]>([]))                // or the observable of empty heros if no search term
            .catch(error => {
                console.log(error);
                return Observable.of<Hero[]>([]);
            });
    }

    gotoDetail(hero: Hero): void {
        let link = ['/detail', hero.id];
        this.router.navigate(link);
    }
}