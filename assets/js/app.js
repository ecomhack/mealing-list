
angular.module('mealingList', [])
  .constant('report', function report(msg, err, checkFirst) {
    var status = err.statusCode || err.status;
    if (checkFirst && status < 300)
      return true;

    status = status || 'Kein Code';
    var detail = err.message || JSON.stringify(err.body) || 'Keine Details.';
    alert(msg + ' ist fehlgeschlagen! (' + status + ')\n\n' + detail);
  });
