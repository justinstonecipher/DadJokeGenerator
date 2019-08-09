import { Component, OnInit, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DadJoke } from './Models/DadJoke';
import { timeout } from 'q';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Dad Joke Generator';
  recentJoke: DadJoke;
  jokeHistoryList: DadJoke[] = [];
  searchTerm: string = '';
  searchResults: any;
  shortJokes = [];
  mediumJokes = [];
  longJokes = [];
  randomDadJokeSelected: boolean = false;
  loading: boolean = false;
  searchTimeout: any;
  generatingNewJoke: boolean = false;

  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

  getRandomDadJoke() {
    if (this.randomDadJokeSelected) {
      //initial http request
      this.loading = true;
      this.http.get('/api/DadJokes/GetRandomJoke').subscribe((result: DadJoke) => {
        this.recentJoke = result;
        this.setHistory(result);
        this.loading = false;
      });

      //set 10 second interval for random joke
      setInterval(() => {
        this.generatingNewJoke = true;
        this.http.get('/api/DadJokes/GetRandomJoke').subscribe((result: DadJoke) => {
          this.recentJoke = result;
          this.setHistory(result);
          this.generatingNewJoke = false;
        })
      }, 10000)
    }
  }

  setHistory(result: DadJoke) {
    this.jokeHistoryList.push(result);
  }

  searchDadJokes() {
    this.shortJokes = [];
    this.mediumJokes = [];
    this.longJokes = [];
    this.loading = true;
    this.randomDadJokeSelected = false;
    this.http.get(`/api/DadJokes/Search`, {
      params: {
        searchTerm: this.searchTerm
      }
    }).subscribe(results => {
      this.searchResults = results;
      this.organizeJokeList(this.searchResults);
      this.loading = false;
    });
  }

  organizeJokeList(jokes) {
    jokes.forEach(joke => {
      let count = this.getWordCount(joke);
      joke = joke.replace(this.searchTerm, `<b>${this.searchTerm}</b>`);
      if (count < 10) {
        this.shortJokes.push(joke);
      } else if (count >= 10 && count < 20) {
        this.mediumJokes.push(joke);
      } else {
        this.longJokes.push(joke);
      }
    });
  }

  getWordCount(str) {
    return str.split(' ')
      .filter(function (n) { return n != '' })
      .length;
  }

  setGenerateRandom() {
    this.randomDadJokeSelected = !this.randomDadJokeSelected;
    this.getRandomDadJoke();
  }

  // removing this to add a search button instead
  // setSearch(newTerm: string) {
  //   this.searchTerm = newTerm;
  //   clearTimeout(this.searchTimeout);
  //   this, this.searchTimeout = setTimeout(() => {
  //     this.searchDadJokes();
  //   }, 300);
  // }
}
