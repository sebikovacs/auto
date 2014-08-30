app
  .filter('tagged', function() {
    return function(input, tags) {
      
      var out = [];
      input = input || '';
      tags = tags || '';



      tags = tags.replace(/\+/g,",").replace(/_/g," ").split(',');

      angular.forEach(tags, function (tag) {
        
        angular.forEach(input, function (element) {
          if (element.tags && element.tags.indexOf(tag) >= 0) {

            out.push(element);
            
          }
        });
      });

      return out;
    };
  });