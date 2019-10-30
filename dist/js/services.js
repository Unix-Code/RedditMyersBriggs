angular.module('RedditMyersBriggs.services', [])
    .factory('redditPersonaAPIService', ['$http', function ($http) {
        var redditPersonaAPIService = {};

        redditPersonaAPIService.getPersonaResults = function (subreddit) {
            return $http.get("http://redditmyersbriggs-env.jq9336vacz.us-east-1.elasticbeanstalk.com/personas/stats/" + subreddit);
        }

        return redditPersonaAPIService;
    }]);
