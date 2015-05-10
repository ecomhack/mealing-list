
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

    $scope.associationUnset = function(foreignKey) {
      return !foreignKey || foreignKey == '0';
    };

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

          // subscribe to events
          io.socket.get('/ingredient/' + event.id);
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
        case 'updated':
          var dish = findDishById(event.id);
          if (!dish)
            return;

          // check if we got thrown out
          if (event.data.locked &&
              !$scope.ownsDishes(dish) &&
              $scope.selectedDish == dish) {
            $scope.selectedDish = undefined;
          }

          var keys = Object.keys(event.data);
          keys.forEach(function(key) {
            dish[key] = event.data[key];
          });
          break;
        case 'destroyed':
          var dish = findDishById(event.data.dish);
          if (!dish)
            return;

          dish.splice(dish.indexOf(dish), 1);
          break;
      }

      $scope.$apply();
    });

    $scope.createDish = function createDish() {
      io.socket.post('/dish', {
        title: $scope.createDishInput,
        creator: localStorage.userId,
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
      if (dish && dish.locked && !$scope.ownsDishes(dish))
        return;

       $scope.selectedDish = dish;
    };

    $scope.ownsDishes = function(dish) {
      return (typeof dish.creator === 'object' ? dish.creator.id : dish.creator) == localStorage.userId;
    }

    $scope.getGravatar = function(participant) {
      console.log('GET', participant);
      var url = 'http://www.gravatar.com/avatar/' + participant.emailHash + 's=56&d=mm';

      return url;
    };

    $scope.toggleProvidedBy = function toggleProvidedBy(ingredient, event) {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }

      var val = localStorage.userId;
      io.socket.put('/ingredient/' + ingredient.id, {
        providedBy: $scope.associationUnset(ingredient.providedBy) ? val : 0
      }, function(data, jwres) {
        if (!report('Picking Ingredient', jwres, true))
          return;

        $scope.$apply(function() {
          ingredient.providedBy = data.providedBy;
        });
      });
    };

    $scope.toggleLocked = function toggleLocked(dish, event) {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }

      if (!$scope.ownsDishes(dish))
        return;

      io.socket.put('/dish/' + dish.id, {
        locked: !dish.locked
      }, function(data, jwres) {
        if (!report('Locking Event', jwres, true))
          return;

        $scope.$apply(function() {
          dish.locked = data.locked;
        });
      });
    }

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

