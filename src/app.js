(function(){
  'use strict';

  var myApp = angular.module('myApp', ['tc.chartjs']);

  myApp.controller('ChartsController', ['$scope', 'dataservice', function($scope, dataservice){

    var TODAY = moment('2014-07-31');
    $scope.currentPeriod = 'today';
    $scope.rawCsvData = [];
    $scope.filteredData = [];

    activate();

    function activate(){
      getRawCsvData().then(function(){
        console.log('got raw csv data');
        console.log($scope.rawCsvData);
        filterData(1);
        console.log($scope.filteredData);
      });
    }

    $scope.setCurrentPeriod = function(period){
      $scope.currentPeriod = period;
      // filter data
      // update charts
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

    function filterData(numDays){
      var earliestMoment = TODAY.subtract(numDays + 1, 'days');
      $scope.filteredData = _.filter($scope.rawCsvData, function(item){
        return (item.moment.isAfter(earliestMoment, 'day'));
      });
    }

    function updateLineChartData(){

    }

    function updatePieChartData(){

    }

    function updateTotals(){

    }

    // line chart
    $scope.activityData = {
      labels: ["January", "February", "March", "April", "May", "June", "July"],
      datasets: [
        {
          label: "My First dataset",
          fillColor: "rgba(220,220,220,0.2)",
          strokeColor: "rgba(220,220,220,1)",
          pointColor: "rgba(220,220,220,1)",
          pointStrokeColor: "#fff",
          pointHighlightFill: "#fff",
          pointHighlightStroke: "rgba(220,220,220,1)",
          data: [65, 59, 80, 81, 56, 55, 40]
        },
        {
          label: "My Second dataset",
          fillColor: "rgba(151,187,205,0.2)",
          strokeColor: "rgba(151,187,205,1)",
          pointColor: "rgba(151,187,205,1)",
          pointStrokeColor: "#fff",
          pointHighlightFill: "#fff",
          pointHighlightStroke: "rgba(151,187,205,1)",
          data: [28, 48, 40, 19, 86, 27, 90]
        }
      ]
    };

    $scope.activityOptions = {

    };

    $scope.myData = [
      { value : 50, color : "#F7464A" },
      { value : 90, color : "#E2EAE9" },
      { value : 75, color : "#D4CCC5" },
      { value : 30, color : "#949FB1"}
    ];

    $scope.myOptions =  {
      // Chart.js options can go here.
    };

  }]);

})();
