
angular.module('mealingList')
  .directive('mealingConfirm', function() {
    return function($scope, $element, $attrs) {
      $element.bind("keydown keypress", function(event) {
        if (event.which === 13) {
          $scope.$apply(function() {
            $scope.$eval($attrs.mealingConfirm, { 'event': event });
          });

          event.preventDefault();
        }
      });
    };
  });

