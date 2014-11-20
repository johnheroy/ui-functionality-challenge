(function(){
  'use strict';

  angular
    .module('myApp')
    .factory('dataservice', dataservice);

  dataservice.$inject = ['$http'];

  function dataservice($http){
    var service = {
      getCsvData: getCsvData
    };

    return service;

    function getCsvData(){
      return $http({method: 'GET', url: 'data/sample_data.csv'})
        .success(function(data, status, headers, config){
          return data;
        })
        .error(function(data, status, headers, config){
          console.error('could not get csv data');
        });
    }
  }

})();
