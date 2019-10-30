angular.module('RedditMyersBriggs.services', [])
    .factory('redditPersonaAPIService', ['$http', function ($http) {
        var redditPersonaAPIService = {};

        redditPersonaAPIService.getPersonaResults = function (subreddit) {
            return $http.get("http://127.0.0.1:5000/personas/stats/" + subreddit);
        }

        return redditPersonaAPIService;
    }]);
