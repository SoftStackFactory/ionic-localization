// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'starter.controllers', 'pascalprecht.translate', 'RESTConnection', 'CurrencyExchangeRate', 'tmh.dynamicLocale', 'SSFAlerts'])
.constant("LANGUAGE_CODES", {
        "ENGLISH": "en",
        "SPANISH": "es",
        "CHINESE": "cmn"
})
.constant("CURRENCY_CODES", {
    "DOLLAR": "USD",
    "PESO": "MXN",
    "YUAN": "CNY"
})
.constant("CURRENCY_SYMBOLS", {
    "DOLLAR": "$",
    "PESO": "$",
    "YUAN": "¥"
})
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
.config(function($translateProvider, LANGUAGE_CODES) {
  $translateProvider
  //Load languages files from path 
    .useStaticFilesLoader({
      prefix: 'languages/',
      suffix: '.json'
    })
   
    .preferredLanguage(LANGUAGE_CODES.ENGLISH)
    .fallbackLanguage(LANGUAGE_CODES.ENGLISH);
})
.config(function(tmhDynamicLocaleProvider) {
  tmhDynamicLocaleProvider.localeLocationPattern("lib/angular-locales/angular-locale_{{locale}}.js");
})

.config(function($stateProvider, $urlRouterProvider, LANGUAGE_CODES) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.english', {
    url: '/english',
    views: {
      'tab-english': {
        templateUrl: 'templates/exchange.html',
        controller: 'ExchangeCtrl',
        resolve:{
          language: function() {
              return {code: LANGUAGE_CODES.ENGLISH};
          }
        }
      }
    }
  })
  
  .state('tab.spanish', {
    url: '/spanish',
    views: {
      'tab-spanish': {
        templateUrl: 'templates/exchange.html',
        controller: 'ExchangeCtrl',
        resolve:{
          language: function() {
              return {code: LANGUAGE_CODES.SPANISH};
          }
        }
      }
    }
  })
    .state('tab.chinese', {
    url: '/chinese',
    views: {
      'tab-chinese': {
        templateUrl: 'templates/exchange.html',
        controller: 'ExchangeCtrl',
        resolve:{
          language: function() {
              return {code: LANGUAGE_CODES.CHINESE};
          }
        }
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/english');

});
