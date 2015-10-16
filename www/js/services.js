angular.module('CurrencyExchangeRate', [])
.service('CurrencyExchangeRateService', function($http, ENDPOINT_URL, CURRENCY_CODES){
    
    var service = this;
    
    //Currently supporting american dollar, mexican peso and chinese yuan renminbi
    var currencyTable = {};
    
    //Initializing currency table with a key for every currency we are supporting
    for (var code in CURRENCY_CODES) {
        currencyTable[CURRENCY_CODES[code]] = {};
    }
    
    service.setCurrencyExchangeRate = function(fromCurrencyKey, toCurrencyKey, exchangeRate) {
        currencyTable[fromCurrencyKey][toCurrencyKey] = exchangeRate;
    };
    
    service.getCurrencyExchangeRate = function(fromCurrencyKey, toCurrencyKey) {
        return currencyTable[fromCurrencyKey][toCurrencyKey];
    };
    
    service.calculateRate = function(fromCurrencyKey, toCurrencyKey, amount) {
        var currencyRate = service.getCurrencyExchangeRate(fromCurrencyKey, toCurrencyKey);
        if(currencyRate===undefined)
            return 0;
        return amount * currencyRate;
    };
    
});