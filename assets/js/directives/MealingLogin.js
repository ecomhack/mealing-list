
angular.module('mealingList')
  .directive('mealingLogin', function(report) {
    return {
      link: function($scope, $element, $attrs) {
        $scope.working = false;

        $scope.twitterSignIn = function() {
          $scope.working = true;
          window.open('/auth/twitter');
        };

        $scope.manualSignIn = function() {
          $scope.working = true;

          io.socket.post('/participant', {
            name: $scope.name
          }, function(data, jwres) {
            $scope.working = false;

            if (!report('Creating Account', jwres, true))
              return;

            localStorage.userId = data.id;
            $element.find('.modal').modal('hide');
          });
        }

        if (!localStorage.userId)
          $element.find('.modal').modal('show');
      },
      templateUrl: '/templates/login.html'
    };
  });

