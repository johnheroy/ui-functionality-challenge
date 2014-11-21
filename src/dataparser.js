(function(){
  'use strict';

  angular
    .module('myApp')
    .factory('dataparser', dataparser);

  var TODAY = moment('2014-07-31'); // constant, specified by challenge reqs

  function dataparser(){
    var service = {
      filterData       : filterData,
      getPieChartData  : getPieChartData,
      getLineChartData : getLineChartData,
      getSegmentData   : getSegmentData
    };

    return service;

    function filterData(rawData, numDays, segment){
      var earliestMoment = TODAY.clone().subtract(numDays + 1, 'days');
      return _.filter(rawData, function(item){
        return (item.moment.isAfter(earliestMoment, 'day'));
      });
    }

    function getPieChartData(filteredData){

    }

    function getLineChartData(filteredData){

    }

    function getSegmentData(rawData){

    }

  }

})();
