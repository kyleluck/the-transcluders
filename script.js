var APIKEY = "43bcbd9c821513cf95efd29956339792155c7ed3"; //regan
// var APIKEY = "3ddc099bbb19af0cd00f41ee78920c7b2bb90f7d"; //kyle1
// var APIKEY = "a2a76189999ce286d4a26875b8ec1d37eec6fc4e"; //kyle2
// var APIKEY = "88d4c0a96e942887a933223c884fb6281dcebafc"; //anthony

var app = angular.module('app', []);

app.controller('MainController', function($scope, Alchemy) {
  $scope.search = function(searchQuery) {
    Alchemy.getData(searchQuery, function(response) {
      $scope.resultSet = response.data.result.docs;
      console.log(response);
    });
  };
});

app.factory('Alchemy', function($http) {
  return {
    getData: function(searchQuery, callback) {
      $http({
        url: "https://gateway-a.watsonplatform.net/calls/data/GetNews",
        params: {
          apikey: APIKEY,
          outputMode: 'json',
          start: "now-3h",
          end: "now",
          count: 5,
          return: "enriched",
          'q.enriched.url.title': searchQuery
        }
      }).then(callback);
    }
  };
});

app.directive('searchForm', function() {
  return {
    restrict: 'E',
    templateUrl: 'search-form.html'
  };
});

app.directive('results', function() {
  return {
    restrict: 'E',
    templateUrl: 'results.html'
  };
});
