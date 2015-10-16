angular.module('RESTConnection', [])
.constant('ENDPOINT_URL', 'https://currency-api.appspot.com/api/')
//Needed for CORS
.constant('ApiEndpoint', {
  url: 'https://localization-andy-eagle.c9.io/api/'
})

.service('ExchangeRestService', [ '$http', 'ENDPOINT_URL', 'ApiEndpoint', function($http, ENDPOINT_URL, ApiEndpoint){
    var service = this;
    //TODO: need to change ApiEndpoint.url to ENDPOINT_URL, 
    service.getCurrencyRate = function(fromCurrencyCode, toCurrencyCode) {
        return $http.get(ENDPOINT_URL + fromCurrencyCode +"/" + toCurrencyCode + ".json");
    };
}]);