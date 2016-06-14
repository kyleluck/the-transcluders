// var APIKEY = "43bcbd9c821513cf95efd29956339792155c7ed3"; //regan
 var APIKEY = "3ddc099bbb19af0cd00f41ee78920c7b2bb90f7d"; //kyle1
//var APIKEY = "a2a76189999ce286d4a26875b8ec1d37eec6fc4e"; //kyle2
// var APIKEY = "88d4c0a96e942887a933223c884fb6281dcebafc"; //anthony

var cities = [
  {name: "New York", center: {lat: 40.714, lng: -74.005}},
  {name: "San Francisco", center: {lat: 37.775, lng: -122.419}},
  {name: "Chicago", center: {lat: 41.878, lng: -87.629}},
  {name: "Houston", center: {lat: 29.760, lng: -95.370}},
  {name: "Atlanta", center: {lat: 33.749, lng: -84.388}}
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
      //Alchemy.getData(city.name, searchQuery, function(response) {
      Alchemy.getJsonFile(city.name, searchQuery, function(response) {
        if (response.data.status === "ERROR") {
          console.log('ERROR in API', response.data.statusInfo);
          return;
        }
        $scope.resultSet = response.data.result.docs;
        //calculate average Sentiment score
        var avgSentiment = 0;
        var totalSentiment = 0;
        var numberArticles = 0;
        response.data.result.docs.forEach(function(article) {
          var sentimentScore = article.source.enriched.url.docSentiment.score;
          totalSentiment += sentimentScore;
          numberArticles++;
        });
        avgSentiment = Number(totalSentiment / numberArticles);
        city.avgSentiment = avgSentiment;
        //console.log('avg sentiment:', avgSentiment);
        console.log(response);
      }, function(response) {
        alert('API Error. Check Console!');
        console.log('API Error was: ', response);
      });
    });
    console.log(cities);
  };
});

app.controller('MapController', function(GoogleMapsService) {
  var map = GoogleMapsService.createMap();
  cities.forEach(function(city) {
    GoogleMapsService.createCircle("#ccc", "#ccc", city.center, map);
  });
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
    },
    getJsonFile: function(city, searchQuery, callback, errorCallback) {
      $http({
        url: "json/" + city + ".json"
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
    createCircle: function(strokeColor, fillColor, center, map) {
      return new google.maps.Circle({
        strokeColor: strokeColor,
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: fillColor,
        fillOpacity: 0.35,
        map: map,
        center: center,
        radius: 80000
      });
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
