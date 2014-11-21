(function(){
  'use strict';

  angular
    .module('myApp', ['tc.chartjs'])
    .controller('ChartsController', ChartsController);

  ChartsController.$inject = ['$scope', 'dataservice', 'dataparser'];

  function ChartsController($scope, dataservice, dataparser){

    $scope.currentPeriod = '';
    $scope.segment = '';
    $scope.segmentNumbers = {};
    $scope.rawCsvData = [];
    $scope.filteredData = [];

    activate();

    $scope.setCurrentPeriod = function(period){
      $scope.currentPeriod = period;
      filterAndUpdate();
    }

    $scope.setSegment = function(segment){
      $scope.segment = segment;
      console.log('segment is', $scope.segment);
      filterAndUpdate();
    }

    function filterAndUpdate(){
      var numDays = 1;
      if ($scope.currentPeriod !== 'today') {
        numDays = parseInt($scope.currentPeriod);
      }
      $scope.filteredData = dataparser.filterData($scope.rawCsvData, numDays,
        $scope.segment);
      // update charts
      $scope.pieChartData = dataparser.getPieChartData($scope.filteredData);
      $scope.segmentNumbers = dataparser.countSegments($scope.rawCsvData, numDays);
      $scope.lineChartData = dataparser.getLineChartData($scope.filteredData, numDays);
    }

    function activate(){
      getRawCsvData().then(function(){
        $scope.setSegment('all');
        $scope.setCurrentPeriod('today');
      });
    }

    function getRawCsvData(){
      return dataservice.getCsvData()
        .then(function(data){
          var parsedData = [];
          var rows = data.data.split('\n');
          // remove header ['Date', 'Time', 'Gender', 'Device', 'Activity']
          rows.shift();
          rows.forEach(function(row){
            var columns = row.split(',');
            parsedData.push({
              'moment'  : moment(columns[0] + ' ' + columns[1]),
              'gender'  : columns[2],
              'device'  : columns[3],
              'activity': columns[4]
            });
          });
          $scope.rawCsvData = parsedData;
        });
    }

    ///////////////////////////

    $scope.lineChartOptions = {

    };

    // use .generateLegend()
    $scope.pieChartOptions = {
      legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>"
    };

  }

})();
