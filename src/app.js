(function(){
  'use strict';

  var myApp = angular.module('myApp', ['tc.chartjs']);

  myApp.controller('ChartsController', ['$scope', 'dataservice', function($scope, dataservice){

    $scope.currentPeriod = 'today';

    $scope.setCurrentPeriod = function(period){
      $scope.currentPeriod = period;
    }

    activate();

    function activate(){
      return getRawCsvData();
    }

    function getRawCsvData(){
      return dataservice.getCsvData()
        .then(function(data){
          $scope.rawCsvData = data;
          console.log(data);
        });
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
