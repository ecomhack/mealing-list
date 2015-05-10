
angular.module('mealingList')
  .controller('PayController', function($scope) {
    function addTrailingZeros(num) {
      var parts = num.split('.');
      if (parts.length == 2)
        return parts[1].length != 2 ? num + '0' : num;
      else
        return num + '.00';
    }

    function updateButton() {
      setTimeout(function() {
        $('#pay-button').button('refresh');
      });
    }

    function getAccessToken() {
      var xml = new XMLHttpRequest();
      xml.onload = function() {
        var token = xml.responseText;
        //console.log(token);

        braintree.setup(token, "dropin", {
          container: "payment-form",
          currency: 'EUR'
        });
      };
      xml.open('GET', '/bt-token');
      xml.send();
    }

    getAccessToken();
    $scope.amount = '';
    $scope.persons = '';

    $scope.$watch('amount', updateButton);
    $scope.$watch('persons', updateButton);

    $scope.numberIsValid = function(amount, persons) {
      var inputIsValid = amount.match(/^\d+(?:\.\d{1,2})?$/);   //Regular Expression to match only number with a decimal or without

      return persons && amount && inputIsValid;
    }
    $scope.getInputText = function(amount, persons) {
      if (!$scope.numberIsValid(amount,persons))
        return 'No Valid Amount';

      persons = parseInt(persons);
      amount = parseFloat(amount);

      if (isNaN(persons) || isNaN(amount))
        return 'No Valid Amount';

      var num = (Math.ceil(amount / persons * 100) / 100).toString(); //Calculate the right amount per person

      return "Pay " +  addTrailingZeros(num) + "€"; //always a decimal number with two digits
    };
  });

