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
    $scope.meanLineShown = false;
    $scope.trendLineShown = false;

    activate();

    $scope.setCurrentPeriod = function(period){
      $scope.currentPeriod = period;
      filterAndUpdate();
    }

    $scope.setSegment = function(segment){
      $scope.segment = segment;
      filterAndUpdate();
    }

    $scope.toggleMeanLine = function(){
      $scope.meanLineShown = !$scope.meanLineShown;
      updateMeanLine();
    }

    $scope.toggleTrendLine = function(){
      $scope.trendLineShown = !$scope.trendLineShown;
      updateTrendLine();
    }

    function updateMeanLine(){
      if ($scope.meanLineShown){
        $scope.lineChartData.datasets.push(
          dataparser.getMeanLineData($scope.lineChartData)
        );
      } else {
        var meanLineIndex = _.findIndex($scope.lineChartData.datasets, function(dataset){
          return dataset.label === 'Mean';
        });
        if (meanLineIndex >= 0){
          $scope.lineChartData.datasets.splice(meanLineIndex, 1);
        }
      }
    }

    function updateTrendLine(){
      if ($scope.trendLineShown){
        $scope.lineChartData.datasets.push(
          dataparser.getTrendLineData($scope.lineChartData)
        );
      } else {
        var trendLineIndex = _.findIndex($scope.lineChartData.datasets, function(dataset){
          return dataset.label === 'Trend';
        });
        if (trendLineIndex >= 0){
          $scope.lineChartData.datasets.splice(trendLineIndex, 1);
        }
      }
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
      updateMeanLine();
      updateTrendLine();
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

    $scope.pieChartOptions = {

    };

  }

})();
