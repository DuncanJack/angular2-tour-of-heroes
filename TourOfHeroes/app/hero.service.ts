import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import { Hero } from './hero';
import { HEROES } from './mock-heroes';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class HeroService {

    private heroesUrl = 'app/heroes';  // URL to web api
    private headers = new Headers({'Content-Type': 'application/json'});

    constructor(private http: Http) { }

    create(name: String): Hero {
        return this.http.post(this.heroesUrl, JSON.stringify({ name: name }), { headers: this.headers })
            .toPromise()
            .then(res => res.json().data)
            .catch(this.handleError);
    }

    delete(id: number): Promise<void> {
        const url = `${this.heroesUrl}/${id}`;
        return this.http.delete(url, this.headers)
            .toPromise()
            .then(() => null)
            .catch(this.handleError);
    }

    getHero(id: number): Promise<Hero> {
        return this.getHeroes()
            .then(heroes => heroes.find(hero => hero.id === id));
    }

    getHeroesOld(): Promise<Hero[]> {
        return Promise.resolve(HEROES);
    }

    getHeroes(): Promise<Hero[]> {
        var r = this.http.get(this.heroesUrl);
        return this.http.get(this.heroesUrl)
            .toPromise()
            .then(response => response.json().data as Hero[])
            .catch(this.handleError);
    }

    update(hero: Hero): Promise<Hero> {
        const url = `${this.heroesUrl}/${hero.id}`;
        return this.http.put(url, JSON.stringify(hero), { headers: this.headers })
            .toPromise()
            .then(() => hero)
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }

    //getHeroesSlowly(): Promise<Hero[]> {
    //    return new Promise<Hero[]>(resolve =>
    //        setTimeout(resolve, 2000))
    //        .then(() => this.getHeroes());
    //}
}