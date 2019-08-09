using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DadJokesApp.Models
{
    public class DadJokeSearch
    {
        public string SearchTerm { get; set; }
        public List<DadJoke> Results { get; set; }
        public int Status { get; set; }
        public int JokeCount { get; set; }

        public const int SearchCount = 30;
    }
}
