(function(){
  'use strict';

  angular
    .module('myApp', ['tc.chartjs'])
    .controller('ChartsController', ChartsController);

  ChartsController.$inject = ['$scope', 'dataservice', 'dataparser'];

  function ChartsController($scope, dataservice, dataparser){

    $scope.currentPeriod = 'today';
    $scope.rawCsvData = [];
    $scope.filteredData = [];

    activate();

    $scope.setCurrentPeriod = function(period){
      $scope.currentPeriod = period;
      // filter data
      if (period === 'today'){
        $scope.filteredData = dataparser.filterData($scope.rawCsvData, 1);
      } else {
        $scope.filteredData = dataparser.filterData($scope.rawCsvData, parseInt(period));
      }
      // update charts
      updatePieChartData();
    }

    function activate(){
      getRawCsvData().then(function(){
        $scope.filteredData = dataparser.filterData($scope.rawCsvData, 1);
        updatePieChartData();
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

    function updateLineChartData(){

    }

    function updatePieChartData(){
      var deviceCounts = _.countBy($scope.filteredData, 'device');
      $scope.pieChartData = [
        {
            value: deviceCounts['desktop'],
            color:"#F7464A",
            highlight: "#FF5A5E",
            label: "Desktop"
        },
        {
            value: deviceCounts['mobile'],
            color: "#46BFBD",
            highlight: "#5AD3D1",
            label: "Mobile"
        },
        {
            value: deviceCounts['tablet'],
            color: "#FDB45C",
            highlight: "#FFC870",
            label: "Tablet"
        }
      ];
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

    // use .generateLegend()
    $scope.pieChartOptions = {
      legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>"
    };

  }

})();
