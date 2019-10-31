angular.module('RedditMyersBriggs.controllers', ['chart.js']).controller('personasController', ['$scope', 'redditPersonaAPIService', ($scope, redditPersonaAPIService) => {
    $scope.subTitle = "";
    $scope.type1 = "radar";
    $scope.type2 = "bar"
    $scope.subreddit = "INTP";
    $scope.chartHeight = window.innerHeight * 0.12;
    $scope.data = {}

    $scope.maxCountOptions = {
        title: {
            display: true,
            text: 'Percentage of Posts That Are Primarily a Persona'
        },
        scales: {
            xAxes: [{
                ticks: {
                    autoSkip: false
                }
            }]
        }
    };

    $scope.averagePersonaOptions = {
        title: {
            display: true,
            text: 'Average Probability of Persona Type'
        }
    };

    $scope.getAdjustedMaxCountsOptions = () => {
        let newOptions;
        if ($scope.type2 === "pie") {
            newOptions = {
                title: {
                    display: true,
                    text: 'Percentage of Posts That Are Primarily a Persona'
                }
            };
        } else {
            newOptions = {
                title: {
                    display: true,
                    text: 'Percentage of Posts That Are Primarily a Persona'
                },
                scales: {
                    xAxes: [{
                        ticks: {
                            autoSkip: false
                        }
                    }]
                }
            };
        }
        return newOptions;
    };

    $scope.toggleGraph = () => {
        $scope.type1 = ($scope.type1 === "radar") ? "polarArea" : "radar";
    };

    $scope.toggleGraph2 = () => {
        $scope.type2 = ($scope.type2 === "bar") ? "pie" : "bar";
        $scope.maxCountOptions = $scope.getAdjustedMaxCountsOptions();
    };

    $scope.submitRequest = () => {
        $scope.subTitle = $scope.subreddit;
        $scope.warning = "";
        $scope.haveResults = false;
        redditPersonaAPIService.getPersonaResults($scope.subreddit).then((response) => {
            $scope.data = response.data.data;
            $scope.haveResults = true;
        }).catch((err) => {
            console.log(err)
            $scope.warning = "Not Enough Data for Analysis"
        })
    };
}]);
