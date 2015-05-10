$('#datepicker').change(function(){
    $('#datepicker').css('color', 'black');   
})

angular.module('mealingList')
  .controller('CreateEventController', function($scope, report) {
    $scope.createEvent = function createEvent() {
      io.socket.post('/event', {
        location: $scope.location,
        title: $scope.title,
        // date: $scope.date
      }, function(data, jwres) {
        console.log(jwres);
        if (!report('Creating Event', jwres, true))
          return;

        window.location = '/event/view/' + data.id;
      });
    };
  });

