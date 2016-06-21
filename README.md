# SentiMotion

## Overview:
SentiMotion allows a user to view sentiment and emotion information on multiple forms of data. Throughout SentiMotion, sentiment is displayed in a number of ways. Sentiment type can be positive, negative, or neutral. Sentiment score is a float between -1.0 and 1.0. We also display sentiment as colors: green represents positive, blue represents neutral, and red represents negative.
Emotion is displayed with icons and can be one or more of the following values: anger, disgust, fear, joy, or sadness.

* The "URL Analyzer" will analyze a provided url to a news story and display sentiment type, sentiment score, and emotion found within the text.
* The "Text Analyzer" will analyze a provided block of text and display sentiment type, sentiment score, and the number of stars based on the sentiment score. The stars represent a suggested rating if the block of text was a review.
* "Map" displays average sentiment for 100 articles across 5 cities. The size of the circle is dependent on the ratio of positive, negative, or neutral articles to the overall number of articles for each city. Clicking on a circle displays the articles used in calculating average sentiment for that city. Each article is displayed with the title, sentiment, sentiment score, and link to original article.

## Technologies
* [AlchemyAPI](http://www.alchemyapi.com/) is utilized throughout SentiMotion to analyze sentiment and emotion. Examples of AlchemyAPI methods used are: GetNews, URLGetTextSentiment, TextGetTextSentiment, URLGetEmotion.
* [Google Maps API](https://developers.google.com/maps/documentation/javascript/) is used in our Map module to display the map and circles.
* [Firebase](https://firebase.google.com/) is used to handle user authentication.

## Frameworks
* Bootstrap
* AngularJS
* jQuery

## Programming Languages
* JavaScript
* HTML
* CSS

## Contributors
* [Kyle Luck](https://github.com/kyleluck)
* [Anthony Thompson](https://github.com/Athompsonjr26)
* [Regan Co](https://github.com/rrgn)

We utilized [Mob Programming](https://en.wikipedia.org/wiki/Mob_programming) throughout the development of SentiMotion.

## Screenshots
### Landing Page
![landing page](/images/landing-page.png)

### URL Analyzer
![url analyzer](/images/url-analyzer.png)

### Text Analyzer
![text analyzer](/images/text-analyzer.png)

### Map Analyzer
![map analyzer](/images/map-analyzer.png)

## Contribute to this project
1. Move Firebase code into Angular
2. Add process to automate creation of city json files.
2. Allow user to choose which cities are analyzed on the map.
3. Robust error handling.

## Live Link
[View Here](http://digitalcrafts-may-2016-cohort.github.io/the-transcluders/)
