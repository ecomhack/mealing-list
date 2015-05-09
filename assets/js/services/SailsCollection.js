
angular.module('mealingList')
  .factory('SailsCollection', function() {

    return function createSailsCollection(id, $scope) {
      io.socket.get('/' + id);

      var collection = $scope[id];
      if (!collection)
        $scope[id] = collection = [];

      function findById(id) {
        for (var i = 0; i < collection.length; i++) {
          if (collection[i].id == id)
            return collection[i];
        }
      }

      io.socket.on(id, function(event) {
        switch (event.verb) {
          case 'created':
            collection.push(event.data);
            break;
          case 'updated':
            var data = findById(event.id);
            if (!data)
              break;

            var keys = Object.keys(event.data);
            keys.forEach(function(key) {
              data[key] = event.data[key];
            });
            break;
          case 'addedTo':
            break;
          case 'removedFrom':
            break;
          case 'destroyed':
            var data = findById(event.id);
            if (!data)
              break;

            collection.splice(collection.indexOf(data), 1);
            break;
        }
      });
    };
  });

