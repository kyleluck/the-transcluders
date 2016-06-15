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

//global variable to test active class on pills
var activetab;

// define routing
app.config(function($routeProvider) {
  $routeProvider
  .when('/map', {
    templateUrl: 'map.html',
    controller: 'MapController',
    activetab: 'map'
  })
  .when('/analyzer', {
    templateUrl: 'analyzer.html',
    controller: 'AnalyzerController',
    activetab: 'analyzer'
  })
  .when('/home', {
    templateUrl: 'main.html',
    controller: 'MainController',
    activetab: 'search'
  })
  .otherwise({redirectTo: '/home'});
});

//controller to show active tab depending on route
app.controller('RouteChangeController', function($scope, $route, $rootScope) {
  //change activetab when route changes
  $rootScope.$on("$routeChangeSuccess", function(event, current, previous) {
    $scope.activetab = current.$$route.activetab;
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
          console.log('Response status was ERROR', response.data.statusInfo);
          return;
        }
        //push each city's result to resultSet array
        $scope.resultSet.push(response.data.result.docs);
        //calculate average Sentiment score
        var avgSentiment = 0;
        var totalSentiment = 0;
        var numberArticles = 0;
        var numberPostive = 0;
        var numberNegative = 0;
        var numberNeutral = 0;
        response.data.result.docs.forEach(function(article) {
          var sentimentScore = article.source.enriched.url.docSentiment.score;
          if (article.source.enriched.url.docSentiment.type === 'positive') {
            numberPostive++;
          } else if (article.source.enriched.url.docSentiment.type === 'negative') {
            numberNegative++;
          } else {
            numberNeutral++;
          }
          totalSentiment += sentimentScore;
          numberArticles++;
        });
        city.numberArticles = numberArticles;
        city.numberPostive = numberPostive;
        city.numberNegative = numberNegative;
        city.numberNeutral = numberNeutral;

        avgSentiment = Number(totalSentiment / numberArticles);
        //set avgSentiment per city
        city.avgSentiment = avgSentiment;
        console.log(response);
      }, function(response) {
        alert('API Error. Check Console!');
        console.log('API Error was: ', response);
      });
    });
  });
// });

app.controller('AnalyzerController', function($scope, Alchemy) {
  $scope.analyzeUrl = function(url) {
    Alchemy.urlData(url, function(response) {
      $scope.sentiment = response.data.docSentiment.type;
      $scope.sentimentScore = response.data.docSentiment.score;
      $scope.text = response.data.text;
    });

    Alchemy.getEmotions(url, function(response) {
      $scope.anger = false;
      $scope.disgust = false;
      $scope.fear = false;
      $scope.joy = false;
      $scope.sadness = false;

      console.log(response);
      if (response.data.docEmotions.anger >= 0.5) {
        $scope.anger = true;
      }
      if (response.data.docEmotions.disgust >= 0.5) {
        $scope.disgust = true;
      }
      if (response.data.docEmotions.fear >= 0.5) {
        $scope.fear = true;
      }
      if (response.data.docEmotions.joy >= 0.5) {
        $scope.joy = true;
      }
      if (response.data.docEmotions.sadness >= 0.5) {
        $scope.sadness = true;
      }
    });
  };
});

// MapController creates a map and circles for each city
app.controller('MapController', function(GoogleMapsService, Alchemy) {
  var map = GoogleMapsService.createMap();
  GoogleMapsService.showLegend(map);
  var fillColor;
  var radiusSize;
  cities.forEach(function(city) {
    if (city.avgSentiment >= 0.1) {
      fillColor = "#8FB996"; //green for positive sentiment
      radiusSize = city.numberPostive / city.numberArticles * 100;
    } else if (city.avgSentiment <= -0.01) {
      fillColor = "#A20900"; //red for negative sentiment
      radiusSize = city.numberNegative / city.numberArticles * 100;
    } else {
      fillColor = "#0353A4"; //blue for neutral
      radiusSize = city.numberNeutral / city.numberArticles * 100;
    }
    radiusSize *= 300000;
    GoogleMapsService.createCircle("#ccc", fillColor, city.center, map, radiusSize); //parameters are strokeColor, fillColor, center, map
  });
  Alchemy.getJsonFile(city.name, searchQuery, function(response) {
    
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
    },
    urlData: function(url, callback) {
      $http({
        url: "http://gateway-a.watsonplatform.net/calls/url/URLGetTextSentiment",
        params: {
          apikey: APIKEY,
          url: url,
          outputMode: 'json',
          showSourceText: 1
        }
      }).then(callback);
    },
    getEmotions: function(url, callback) {
      $http({
        url: "http://gateway-a.watsonplatform.net/calls/url/URLGetEmotion",
        params: {
          apikey: APIKEY,
          url: url,
          outputMode: 'json'
        }
      }).then(callback);
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
