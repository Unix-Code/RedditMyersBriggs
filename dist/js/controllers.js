angular.module('RedditMyersBriggs.controllers', ['chart.js']).
  controller('personasController', ['$scope', 'redditAPIservice', 'personaAPIservice', function($scope, redditAPIservice, personaAPIservice) {
    $scope.subTitle = "";
    $scope.type = "radar";
    $scope.subreddit = "INTP";
    $scope.personaResults = [];
    $scope.personas = [];
    $scope.chartHeight = window.innerHeight * 0.12;

    $scope.toggleGraph = function() {
      $scope.type = ($scope.type === "radar") ? "polarArea" : "radar";
    }

    var extractSelfTexts = function(data) {
      return data.map(d => d.selftext).filter(x => x && x !== "[deleted]" && x !== "[removed]");
    }

    var averagePersonaResults = function(personaResults) {
      var averagedResults = [];

      var personas = Object.keys(personaResults.results[0]); // all archetypes

      for (var i = 0; i < personas.length; i++) {
        var persona = personas[i];
        var total = 0;
        for (var j = 0; j < personaResults.results.length; j++) {
          var personaResult = personaResults.results[j];
          total += personaResult[persona];
        }
        var objStr = '{ "'  + personas[i] + '": ' + (100 * (total/(personaResults.results.length))).toPrecision(3) + "}";
        console.log(objStr);
        averagedResults.push(JSON.parse(objStr));
      }
      return averagedResults;
    }
    $scope.submitRequest = function() {
        $scope.subTitle = $scope.subreddit
        $scope.warning = "";
        $scope.personas = [];
        $scope.personaResults = [];
        redditAPIservice.getRedditData($scope.subreddit).then(function (response) {
            $scope.selfTexts = extractSelfTexts(response.data.data);
            if ($scope.selfTexts.length > 10) {
              personaAPIservice.getPersonaResults($scope.selfTexts).then(function (response) {
                var results = averagePersonaResults(response.data);
                $scope.personas = results.map(x => Object.keys(x)[0]);
                $scope.personaResults = results.map(x => Object.values(x)[0]);
              })
            } else {
              $scope.warning = "Not Enough Data for Analysis"
            }
        });
      };
  }]);
