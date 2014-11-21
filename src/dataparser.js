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
      countSegments    : countSegments
    };

    return service;

    function filterData(rawData, numDays, segment){
      var earliestMoment = TODAY.clone().subtract(numDays, 'days');
      return _.filter(rawData, function(item){
        if (segment === 'all'){
          return (item.moment.isAfter(earliestMoment, 'day'));
        }
        return (item.moment.isAfter(earliestMoment, 'day') &&
          item.gender === segment);
      });
    }

    function getPieChartData(filteredData){
      var deviceCounts = _.countBy(filteredData, 'device');
      return [
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

    function countSegments(rawData, numDays){
      var earliestMoment = TODAY.clone().subtract(numDays, 'days');
      return _.countBy(_.filter(rawData, function(item){
        return (item.moment.isAfter(earliestMoment, 'day'));
      }), 'gender');
    }

    function getLineChartData(filteredData, numDays){
      var timeBuckets = _.countBy(filteredData, function(item){
        var momentClone = item.moment.clone();
        if (numDays === 1){
          return momentClone.minutes(0).toDate();
        } else if (numDays === 3){
          var roundedHours = 3 * Math.floor(momentClone.hours() / 3);
          return momentClone.hours(roundedHours).minutes(0).toDate();
        } else if (numDays === 7){
          var roundedHours = 8 * Math.floor(momentClone.hours() / 8);
          return momentClone.hours(roundedHours).minutes(0).toDate();
        } else if (numDays === 14){
          var roundedHours = 12 * Math.floor(momentClone.hours() / 12);
          return momentClone.hours(roundedHours).minutes(0).toDate();
        }
      });
      var timeSeries = [];
      _.forEach(timeBuckets, function(height, timeBucket){
        timeSeries.push([timeBucket, height]);
      })
      timeSeries = _.sortBy(timeSeries, function(item){
        return (new Date(item[0])).getTime();
      });
      var timeLabels = [];
      var bucketHeights = [];
      _.forEach(timeSeries, function(tuple){
        if (numDays === 1){
          timeLabels.push(moment(tuple[0]).format('h:00a'));
        } else if (numDays === 3){
          timeLabels.push(moment(tuple[0]).format('M/D h:00a'));
        } else if (numDays === 7){
          timeLabels.push(moment(tuple[0]).format('M/D h:00a'));
        } else if (numDays === 14){
          timeLabels.push(moment(tuple[0]).format('M/D A'));
        }
        bucketHeights.push(tuple[1]);
      });
      return {
        labels: timeLabels,
        datasets: [
          {
            label: "Activity",
            fillColor: "rgba(151,187,205,0.2)",
            strokeColor: "rgba(151,187,205,1)",
            pointColor: "rgba(151,187,205,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(151,187,205,1)",
            data: bucketHeights
          }
        ]
      };
    }

  }

})();
