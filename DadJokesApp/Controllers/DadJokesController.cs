using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using DadJokesApp.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace DadJokesApp.Controllers
{
    [Microsoft.AspNetCore.Mvc.Route("api/DadJokes")]
    [ApiController]
    public class DadJokesController : ControllerBase
    {
        public DadJokesController()
        { }

        public string BaseUrl = "https://icanhazdadjoke.com/";

        //GET: api/getRandomJoke
        [Microsoft.AspNetCore.Mvc.HttpGet("getRandomJoke")]
        public async Task<DadJoke> GetRandomJoke()
        {
            HttpClient client = new HttpClient();
            client.BaseAddress = new Uri(BaseUrl);
            client.DefaultRequestHeaders.Accept.Add(new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json"));

            var result = await client.GetStringAsync(BaseUrl).ConfigureAwait(false);
            return JsonConvert.DeserializeObject<DadJoke>(result);
        }

        //GET: api/search
        [Microsoft.AspNetCore.Mvc.HttpGet("search")]
        public async Task<List<string>> Search([FromUri]string searchTerm)
        {
            HttpClient client = new HttpClient();
            client.BaseAddress = new Uri(BaseUrl);
            client.DefaultRequestHeaders.Accept.Add(new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json"));

            var url = BaseUrl + "/search?term={0}&page={1}&limit={2}";
            var search = string.Format(url, searchTerm, 1, DadJokeSearch.SearchCount);
            var results = await client.GetStringAsync(search).ConfigureAwait(false);
            var data = JsonConvert.DeserializeObject<DadJokeSearch>(results);

            var jokeList = new List<string>();

            data.Results.ForEach(dadJoke =>
            {
                jokeList.Add(dadJoke.joke);
            });

            SortByLength(jokeList);
            return jokeList;
        }

        private static IEnumerable<string> SortByLength(IEnumerable<string> e)
        {
            var sorted = from s in e
                         orderby s.Length ascending
                         select s;
            return sorted;
        } 
    }
}