(function(){
  'use strict';

  var myApp = angular.module('myApp', ['tc.chartjs']);

  myApp.controller('AppController', ['$scope', function($scope){

    $scope.someNumber = 123;

    $scope.myData = [
      { value : 50, color : "#F7464A" },
      { value : 90, color : "#E2EAE9" },
      { value : 75, color : "#D4CCC5" },
      { value : 30, color : "#949FB1"}
    ];

    $scope.myOptions =  {
      // Chart.js options can go here.
    };

    $scope.changeItUp = function(){
      $scope.myData[0].value += 10;
    }

  }]);

})();
