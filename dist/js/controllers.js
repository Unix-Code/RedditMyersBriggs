angular.module('RedditMyersBriggs.controllers', ['chart.js']).
  controller('personasController', ['$scope', 'redditAPIservice', 'personaAPIservice', function($scope, redditAPIservice, personaAPIservice) {
    $scope.subTitle = "";
    $scope.type1 = "radar";
    $scope.type2 = "bar"
    $scope.subreddit = "INTP";
    $scope.personaResults = [];
    $scope.personas = [];
    $scope.chartHeight = window.innerHeight * 0.12;

    $scope.maxCountOptions = {
        title: {
            display: true,
            text: 'Percentage of Posts That Are Primarily a Persona'
        }
    };

    $scope.averagePersonaOptions = {
      title: {
        display: true,
        text: 'Average Probability of Persona Type'
      }
    }

    $scope.toggleGraph = function() {
      $scope.type1 = ($scope.type1 === "radar") ? "polarArea" : "radar";
    }

    $scope.toggleGraph2 = function() {
      $scope.type2 = ($scope.type2 === "bar") ? "pie" : "bar";
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

    var maxCountsPersonaResults = function(personaResults) {
      var maxCountsResults = [];

      var maxCountsKeys = [];
      for (var i = 0; i < personaResults.results.length; i++) {
        var personaResult = personaResults.results[i];
        var maxCountPersonaKey = Object.keys(personaResult).reduce((a, b) => (personaResult[a] > personaResult[b]) ? a : b );

        maxCountsKeys.push(maxCountPersonaKey);
      }

      maxCountsKeys.forEach(i => maxCountsResults[i] = (maxCountsResults[i]||0) + 1);

      var totalCount = Object.values(maxCountsResults).reduce((a, b) => a + b);

      var completeResults = Object.keys(maxCountsResults).map(a =>
        JSON.parse('{ "' + a + '": ' + ((maxCountsResults[a] / personaResults.results.length) * 100).toPrecision(3) + '}'));
      var sortedCompleteResults = completeResults.sort((a, b) => Object.values(b)[0] - Object.values(a)[0]);

      return sortedCompleteResults;
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
                var maxCountsResults = maxCountsPersonaResults(response.data);
                var averagedPersonaResults = averagePersonaResults(response.data);
                $scope.personas = averagedPersonaResults.map(x => Object.keys(x)[0]);
                $scope.personaResults = averagedPersonaResults.map(x => Object.values(x)[0]);
                $scope.maxCountPersonas = maxCountsResults.map(x => Object.keys(x)[0]);
                $scope.maxCountPersonaResults = maxCountsResults.map(x => Object.values(x)[0]);
              })
            } else {
              $scope.warning = "Not Enough Data for Analysis"
            }
        });
      };
  }]);
