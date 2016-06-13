// var APIKEY = "43bcbd9c821513cf95efd29956339792155c7ed3"; //regan
// var APIKEY = "3ddc099bbb19af0cd00f41ee78920c7b2bb90f7d"; //kyle1
// var APIKEY = "a2a76189999ce286d4a26875b8ec1d37eec6fc4e"; //kyle2
var APIKEY = "88d4c0a96e942887a933223c884fb6281dcebafc"; //anthony

var cities = [
  {name: "New York"},
  {name: "San Francisco"},
  {name: "Chicago"},
  {name: "Houston"},
  {name: "Atlanta"}
];

var app = angular.module('app', ['ngRoute']);

app.config(function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: 'main.html',
    controller: 'MainController',
  })
  .when('/map', {
    templateUrl: 'map.html',
    controller: 'MapController'
  });
});

app.controller('MainController', function($scope, Alchemy) {
  $scope.search = function(searchQuery) {
    cities.forEach(function(city) {
      Alchemy.getData(city.name, searchQuery, function(response) {
        if (response.data.status === "ERROR") {
          console.log('ERROR in API', response.data.statusInfo);
          return;
        }
        $scope.resultSet = response.data.result.docs;
        console.log(response);
      }, function(response) {
        alert('API Error. Check Console!');
        console.log('API Error was: ', response);
      });
    });
  };
});

app.controller('MapController', function(GoogleMapsService) {
  var map = GoogleMapsService.createMap();
});

app.factory('Alchemy', function($http) {
  return {
    getData: function(city, searchQuery, callback, errorCallback) {
      $http({
        url: "https://gateway-a.watsonplatform.net/calls/data/GetNews",
        params: {
          apikey: APIKEY,
          outputMode: 'json',
          start: "now-3h",
          end: "now",
          count: 5,
          return: "enriched",
          // 'q.enriched.url.text': "A[" + city + "^" + searchQuery+ "]"
          'q.enriched.url.title': city,
          'q.enriched.url.text': searchQuery

        }
      }).then(callback, errorCallback);
    }
  };
});

app.factory('GoogleMapsService', function() {
  var mapElement = document.getElementById('map');

  return {
    createMap: function() {
      return new google.maps.Map(mapElement, {
        center: {lat: 39.099727, lng: -94.578567},
        zoom: 4
      });
    },
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
