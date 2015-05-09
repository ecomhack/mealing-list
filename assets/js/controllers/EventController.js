
angular.module('mealingList')
  .controller('EventController', function($scope, report) {
    if (!window.location.search)
      return alert('Invalid page parameters.');

    var eventId = window.location.search.split('=')[1];

    io.socket.get('/event/' + eventId + '/dishes', function(data, jwres) {
      if (!report('Loading dishes', jwres, true))
        return;

      $scope.$apply(function() {
        $scope.dishes = data;
      });
    });

    io.socket.on('dish', function(event) {
      if (event.data.event != eventId)
        return;

      switch (event.verb) {
        case 'created':
          $scope.dishes.push(event.data);
          break;
      }

      $scope.$apply();
    });

    $scope.createDish = function createDish() {
      io.socket.post('/dish', {
        title: $scope.createDishInput,
        event: eventId
      }, function(data, jwres) {
        if (!report('Creating Dish', jwres, true))
          return;

        $scope.$apply(function() {
          $scope.dishes.push(data);
          $scope.createDishInput = '';
          $scope.selectedDish = data;
        });
      });
    };

    $scope.selectDish = function(dish) {
       $scope.selectedDish = dish;
    }
  });

