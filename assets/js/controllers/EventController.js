
angular.module('mealingList')
  .controller('EventController', function($scope, report) {
    if (!window.location.search)
      return alert('Invalid page parameters.');

    var eventId = window.location.search.split('=')[1];

    io.socket.get('/dish?where={"event":"' + eventId + '"}', function(data, jwres) {
      if (!report('Loading dishes', jwres, true))
        return;

      $scope.$apply(function() {
        $scope.dishes = data;
      });
    });

    function findDishById(dishId) {
      for (var i = 0; i < $scope.dishes.length; i++) {
        if ($scope.dishes[i].id == dishId)
          return $scope.dishes[i];
      }
    }

    function findIngredientById(id, dish) {
      for (var i = 0; i < dish.ingredients; i++) {
        if (dish.ingredients[i].id == id)
          return dish.ingredients[i];
      }
    }

    io.socket.on('ingredient', function(event) {
      switch (event.verb) {
        case 'created':
          var dish = findDishById(event.data.dish);
          if (!dish)
            return;

          dish.ingredients.push(event.data);
          break;
        case 'updated':
          var dish = findDishById(event.data.dish);
          if (!dish)
            return;

          var ingredient = findIngredientById(event.id, dish);
          var keys = Object.keys(event.data);
          keys.forEach(function(key) {
            ingredient[key] = event.data[key];
          });
        case 'destroyed':
          var dish = findDishById(event.data.dish);
          if (!dish)
            return;

          var ingredient = findIngredientById(event.id, dish);
          dish.ingredients.splice(dish.ingredients.indexOf(ingredient), 1);
          break;
      }

      $scope.$apply();
    });

    io.socket.on('dish', function(event) {
      switch (event.verb) {
        case 'created':
          if (event.data.event != eventId)
            return;

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
    };

    $scope.createIngredient = function createIngredient() {
      if (!$scope.selectedDish)
        throw 'WTF?';

      io.socket.post('/ingredient', {
        title: $scope.createIngredientInput,
        dish: $scope.selectedDish.id
      }, function(data, jwres) {
        if (!report('Create Ingredient', jwres, true))
          return;

        $scope.$apply(function() {
          if (!$scope.selectedDish.ingredients)
            $scope.selectedDish.ingredients = [];

          $scope.selectedDish.ingredients.push(data);
          $scope.createIngredientInput = '';
        });
      });
    }
  });

