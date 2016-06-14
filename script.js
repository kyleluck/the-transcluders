// var APIKEY = "43bcbd9c821513cf95efd29956339792155c7ed3"; //regan
 var APIKEY = "3ddc099bbb19af0cd00f41ee78920c7b2bb90f7d"; //kyle1
//var APIKEY = "a2a76189999ce286d4a26875b8ec1d37eec6fc4e"; //kyle2
// var APIKEY = "88d4c0a96e942887a933223c884fb6281dcebafc"; //anthony

// array of city objects
var cities = [
  {name: "New York", center: {lat: 40.714, lng: -74.005}, population: 8491079},
  {name: "San Francisco", center: {lat: 37.775, lng: -122.419}, population: 852469},
  {name: "Chicago", center: {lat: 41.878, lng: -87.629}, population: 2722389},
  {name: "Houston", center: {lat: 29.760, lng: -95.370}, population: 2239558},
  {name: "Atlanta", center: {lat: 33.749, lng: -84.388}, population: 4500000}
];

// define angular app
var app = angular.module('app', ['ngRoute']);

// define routing
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

// MainController populates resultSet array with arrays of objects (articles)
app.controller('MainController', function($scope, Alchemy) {
  $scope.resultSet = [];
  var searchQuery = 2; // REMEMBER TO FIX THIS
  // $scope.search = function(searchQuery) {
    cities.forEach(function(city) {
      //Alchemy.getData(city.name, searchQuery, function(response) {
      Alchemy.getJsonFile(city.name, searchQuery, function(response) {
        // log error
        if (response.data.status === "ERROR") {
          console.log('ERROR in API', response.data.statusInfo);
          return;
        }
        //push each city's result to resultSet array
        $scope.resultSet.push(response.data.result.docs);
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
        //set avgSentiment per city
        city.avgSentiment = avgSentiment;
        console.log(response);
        console.log(city.name + " avgSentiment is " + city.avgSentiment);
      }, function(response) {
        alert('API Error. Check Console!');
        console.log('API Error was: ', response);
      });
    });
  });
// });

// MapController creates a map and circles for each city
app.controller('MapController', function(GoogleMapsService) {
  var map = GoogleMapsService.createMap();
  GoogleMapsService.showLegend(map);

  var fillColor;
  cities.forEach(function(city) {
    console.log("inside map controler: " + city.name + " avgSentiment is " + city.avgSentiment);
    if (city.avgSentiment >= 0.1) {
      fillColor = "#8FB996"; //green for positive sentiment
    } else if (city.avgSentiment <= -0.1) {
      fillColor = "#A20900"; //red for negative sentiment
    } else {
      fillColor = "#0353A4"; //blue for neutral
    }
    GoogleMapsService.createCircle("#ccc", fillColor, city.center, map, city.population); //parameters are strokeColor, fillColor, center, map
  });
});

// Alchemy service calls AlchemyAPI with proper parameters
// getData method calls the API
// getJsonFile gets data from /json/<city>.json
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

// GoogleMapsService service returns an object with two methods
// createMap returns a new Google map
// createCircle returns a new circle
app.factory('GoogleMapsService', function() {

  return {
    createMap: function() {
      var mapElement = document.getElementById('map');
      return new google.maps.Map(mapElement, {
        center: {lat: 39.099727, lng: -94.578567},
        zoom: 4
      });
    },
    createCircle: function(strokeColor, fillColor, center, map, population) {
      return new google.maps.Circle({
        strokeColor: strokeColor,
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: fillColor,
        fillOpacity: 0.65,
        map: map,
        center: center,
        radius: Math.sqrt(population) * 100
      });
    },
    showLegend: function(map) {
      //show legend on map
      var legend = document.getElementById('legend');
      map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(legend);
    }
  };
});

// angular directive for search form
app.directive('searchForm', function() {
  return {
    restrict: 'E',
    templateUrl: 'search-form.html'
  };
});

//angular directive for results
app.directive('results', function() {
  return {
    restrict: 'E',
    templateUrl: 'results.html'
  };
});
