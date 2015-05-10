
angular.module('mealingList')
  .directive('mealingLogin', function(report) {
    return {
      scope: {
        user: '='
      },
      link: function($scope, $element, $attrs) {
        $scope.working = false;

        $scope.twitterSignIn = function() {
          $scope.working = true;
          window.open('/auth/twitter');
        };

        $scope.manualSignIn = function() {
          if (!$scope.name || !$scope.email)
            return;

          $scope.working = true;

          io.socket.post('/participant', {
            name: $scope.name,
            email: $scope.email
          }, function(data, jwres) {
            $scope.working = false;

            if (!report('Creating Account', jwres, true))
              return;

            localStorage.userId = data.id;
            $element.find('.modal').modal('hide');
          });
        }

        $scope.userId = localStorage.userId;

        $element.find('.modal').modal('show');
        if (localStorage.userId) {
          io.socket.get('/participant/' + localStorage.userId, function(data, jwres) {
            if (!report('Fetching Userinfo', jwres, true))
              return;

            $scope.user = data;
            $element.find('.modal').modal('hide');
          });
        }
      },
      templateUrl: '/templates/login.html'
    };
  });

