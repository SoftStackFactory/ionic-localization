/* global angular*/
angular.module('starter.controllers', [])
//language is passed as a parameter to know in which tab we are.
//language can have the values en, es or cmn.
.controller('ExchangeCtrl', ["$scope", "$rootScope", "$window", "language", "$translate", "ExchangeRestService", "CurrencyExchangeRateService", 
"LANGUAGE_CODES", "CURRENCY_CODES", "CURRENCY_SYMBOLS", "$filter", "tmhDynamicLocale", "SSFAlertsService",
function($scope, $rootScope, $window, language, $translate, ExchangeRestService, CurrencyExchangeRateService, 
LANGUAGE_CODES, CURRENCY_CODES, CURRENCY_SYMBOLS, $filter, tmhDynamicLocale, SSFAlertsService) {
    
    $scope.currentCurrencyCode;
    //Choose currency code based on language. 
    switch(language.code) {
        case LANGUAGE_CODES.ENGLISH:
            $scope.currentCurrencyCode = CURRENCY_CODES.DOLLAR;
            break;
            
        case LANGUAGE_CODES.SPANISH:
            $scope.currentCurrencyCode = CURRENCY_CODES.PESO;
            break;
            
        case LANGUAGE_CODES.CHINESE:
            $scope.currentCurrencyCode = CURRENCY_CODES.YUAN;
            break;
    }
    
    $scope.otherCurrencies = [];
   
    //Need to present an object with this structure to the translate filter, to parse the variables
    $scope.currentDate =  {
        'currentDate' : ""
    };
    
    //ng-model for fields
    $scope.currencyData = {
        quantity : 1,
        currencyCode : ""
    };
    
    //Result
    $scope.exchangeRate = 0;
    $scope.result = 0;
    $scope.quantityToShow = 0;
    $scope.currentSymbol = symbolFromCurrencyCode($scope.currentCurrencyCode);
    $scope.convertToSymbol = "";
    $scope.convertToCode = "";
    $scope.showResult = false;

    //Global event emitted after successfully change language
    //Used to translate properly
    $rootScope.$on('$translateChangeSuccess', function () {
        //Get an array of other currencies
        if($scope.otherCurrencies.length == 0) {
            getOtherCurrenciesArray($scope.currentCurrencyCode);
        }
    });
    
    $translate.use(language.code);
    
    //Things needed to reload on page enter
    $scope.$on('$ionicView.enter', function() {
        //Changing locale is asynchronous
        setLocale()
        .then(function() {
            $translate.use(language.code);
        });
    });
    
    $scope.onSelect = function(selectItem) {
        console.log(selectItem);
        console.log($scope.currencyData);
    };
    
    //Fired after hitting the translate button
    $scope.convertCurrency = function() {
        //isNaN returns true if it is not a number
        if(isNaN($scope.currencyData["quantity"]) || $scope.currencyData["quantity"] === null) {
            $translate(['ERROR_TITLE','QUANTITY_ERROR']).then(function(translation){
                SSFAlertsService.showAlert(translation.ERROR_TITLE, translation.QUANTITY_ERROR);
            });
        //Check if a currency is selected
        }else if($scope.currencyData["currencyCode"].length == 0) {
            $translate(['ERROR_TITLE','CURRENCY_ERROR']).then(function(translation){
                SSFAlertsService.showAlert(translation.ERROR_TITLE, translation.CURRENCY_ERROR);
            });
        }else {
            if(CurrencyExchangeRateService.getCurrencyExchangeRate($scope.currentCurrencyCode, $scope.currencyData["currencyCode"]) === undefined) {
                fetchCurrencyRate($scope.currencyData["currencyCode"]);
            }else {
                showResult();
            }
        }
    };
    
    function showResult() {
        $scope.showResult = true;
        $scope.currentDate.currentDate = $filter('date')(new Date(), 'fullDate');
        $scope.result = CurrencyExchangeRateService.calculateRate($scope.currentCurrencyCode, $scope.currencyData["currencyCode"], $scope.currencyData["quantity"]);
        $scope.convertToSymbol = symbolFromCurrencyCode($scope.currencyData["currencyCode"]);
        $scope.convertToCode = angular.copy($scope.currencyData["currencyCode"]);
        $scope.quantityToShow = angular.copy($scope.currencyData["quantity"]);
    }
    
    //Get an array of all other currency codes
    function getOtherCurrenciesArray(currencyCode) {
        for (var code in CURRENCY_CODES) {
            if(CURRENCY_CODES[code] !== currencyCode) {
                currencyObjectFromCode(CURRENCY_CODES[code]);
            }
        }
    }
    
    //Actual call to the REST service
    function fetchCurrencyRate(toCurrencyCode) {
        ExchangeRestService.getCurrencyRate($scope.currentCurrencyCode, toCurrencyCode)
        .then(function(response){
            console.log(response);
            if(response.status === 200) {
                CurrencyExchangeRateService.setCurrencyExchangeRate($scope.currentCurrencyCode, toCurrencyCode, response.data["rate"]);
                showResult();
            }else {
                $translate(['ERROR_TITLE','EXCHANGE_ERROR']).then(function(translation){
                    SSFAlertsService.showAlert(translation.ERROR_TITLE, translation.EXCHANGE_ERROR);
                });
            }
        }, function(response){
            $translate(['ERROR_TITLE','EXCHANGE_ERROR']).then(function(translation){
                SSFAlertsService.showAlert(translation.ERROR_TITLE, translation.EXCHANGE_ERROR);
            });
        });
    }
    
    //Change the name of angular's locale scripts to match the codes used here
    //Using external library to switch locales
    function setLocale() {
        //Is a promise
        return tmhDynamicLocale.set(language.code);
    }
    
    //Not the best approach, need to write one case for each new currency.
    function currencyObjectFromCode(code) {
       
        var currencyObject = {};
        switch(code) {
            case CURRENCY_CODES.DOLLAR:
                //Translate returns a promise
                $translate('DOLLARS').then(function(translation){
                    currencyObject["code"] = code;
                    currencyObject["name"] = translation;
                   
                    //Needed to push the object here, because of the promise
                    $scope.otherCurrencies.push(currencyObject);
                });
                
                break;
            case CURRENCY_CODES.PESO:
                $translate('PESOS').then(function(translation){
                    currencyObject["code"] = code;
                    currencyObject["name"] = translation;
                    $scope.otherCurrencies.push(currencyObject);
                });
                break;
            case CURRENCY_CODES.YUAN:
                $translate('YUANS').then(function(translation){
                    currencyObject["code"] = code;
                    currencyObject["name"] = translation;
                    $scope.otherCurrencies.push(currencyObject);
                });
                break;
        }
    }
    
    function symbolFromCurrencyCode(code) {
        var symbol = "";
        switch(code) {
            case CURRENCY_CODES.DOLLAR:
                symbol = CURRENCY_SYMBOLS.DOLLAR;
                break;
            case CURRENCY_CODES.PESO:
                symbol = CURRENCY_SYMBOLS.PESO;
                break;
            case CURRENCY_CODES.YUAN:
                symbol = CURRENCY_SYMBOLS.YUAN;
                break;
        }
        return symbol;
    }
}]);