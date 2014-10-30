angular.module('publipostageFilters', []).filter('templateItemsTypeFilter', ['$state',function($state) {
  return function(templateItems) {
    ret = new Array();
    _.each(templateItems , function (templateItem) {
      if(templateItem.showOnly != undefined) {
        if( _.contains(templateItem.showOnly, $state.params['type']) ) {
          ret.push(templateItem);
        }
      } else {
        ret.push(templateItem);
      }
    });
    return ret;
  };
}]);