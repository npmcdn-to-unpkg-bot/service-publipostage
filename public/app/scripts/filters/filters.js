angular.module('publipostageFilters', [])
  .filter("templateItemsTypeFilter", ['$state', 'security', 
      function($state , security) {
        return function(templateItems) {
          ret = new Array();
          _.each(templateItems , function (templateItem) {
            var validEntry = true
            if(templateItem.showOnly != undefined) {
              if( !_.contains(templateItem.showOnly, $state.params['type']) ) {
                validEntry = false;
              }
            }
            if(validEntry && templateItem.showOnlyAdmin != undefined) {
              validEntry = (security.isAdmin || security.isSuperAdmin);
            }
            if(validEntry) {
              ret.push(templateItem);
            }
          });
          return ret;
        };
      }
  ])

.filter('myfilter', ['$state', 'security',
    function ($state , security) {
        return function (dest) {
          var text = dest.toSource();
          return text.replace('/\},/g', '}, <br/>');
        };
    }
  ])

