angular.module('publipostageFilters', []).filter('templateItemsTypeFilter' , ['$state', 'security', function($state , security) {
  return function(templateItems) {
    ret = new Array();
    _.each(templateItems , function (templateItem) {
      var validEntry = true
      if(templateItem.showOnly != undefined) {
        if( !_.contains(templateItem.showOnly, $state.params['type']) ) {
          validEntry = false;
        }
      }
      if(templateItem.rolePriorityMin != undefined) {
        validEntry = security.getRoleMaxPriority() >= templateItem.rolePriorityMin ;
      }
      if(validEntry) {
        ret.push(templateItem);
      }
    });
    return ret;
  };
}]);