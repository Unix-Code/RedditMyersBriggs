angular.module('RedditMyersBriggs.services', []).
  factory('redditAPIservice', ['$http', function($http) {
    var redditAPI = {};

    redditAPI.getRedditData = function(subreddit) {
      return $http.get("https://api.pushshift.io/reddit/search/submission/?subreddit="
        + subreddit
        + "&sort_type=score&sort=desc&size=500");
    }

    return redditAPI;
  }])
  .factory('personaAPIservice', ['$http', function($http) {
    var personaAPI = {};

    personaAPI.getPersonaResults = function(textData) {
      var params = JSON.stringify({
          'api_key': 'a0fb001e73d90238c232cac782678907',
          'persona': true,
          'data': textData
      });

      return $http.post('https://apiv2.indico.io/personality/batch', params);
    }

    return personaAPI;
  }]);
