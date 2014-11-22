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
      countSegments    : countSegments,
      getMeanLineData  : getMeanLineData
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

    function getTimeBucket(item, numDays){
      var momentClone = item.moment.clone();
      var roundedHours;
      if (numDays === 1){
        roundedHours = momentClone.hours();
      } else if (numDays === 3){
        roundedHours = 3 * Math.floor(momentClone.hours() / 3);
      } else if (numDays === 7){
        roundedHours = 8 * Math.floor(momentClone.hours() / 8);
      } else if (numDays === 14){
        roundedHours = 12 * Math.floor(momentClone.hours() / 12);
      }
      return momentClone.hours(roundedHours).minutes(0).toDate();
    }

    function getMeanLineData(lineChartData){
      var heights = lineChartData.datasets[0].data;
      var mean = _.reduce(heights, function(sum, num){
        return sum + (num / heights.length);
      }, 0).toFixed(2);
      var meanHeights = _.map(new Array(heights.length), function(){
        return mean;
      });
      return {
        label: "Mean",
        fillColor: "rgba(68,105,236,0.1)",
        strokeColor: "rgba(68,105,236,1)",
        pointColor: "rgba(68,105,236,1)",
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(68,105,236,1)",
        data: meanHeights
      };
    }

    function getLineChartData(filteredData, numDays){
      var timeBucketsTotal = _.countBy(filteredData, function(item){
        return getTimeBucket(item, numDays);
      });

      var timeBucketsActive = _.countBy(filteredData, function(item){
        if (item.activity === '0'){
          return 'inactive';
        }
        return getTimeBucket(item, numDays);
      });

      var timeBucketsPercentage = {};
      for (var period in timeBucketsTotal){
        if (timeBucketsTotal[period] === 0 ||
            timeBucketsTotal[period] === undefined ||
            timeBucketsActive[period] === undefined){
          timeBucketsPercentage[period] = 0;
        } else {
          timeBucketsPercentage[period] = 1.00 * timeBucketsActive[period] /
            timeBucketsTotal[period];
        }
      }

      var timeSeries = [];
      _.forEach(timeBucketsPercentage, function(height, timeBucket){
        timeSeries.push([timeBucket, height.toFixed(2)]);
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
