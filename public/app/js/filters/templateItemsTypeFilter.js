angular.module( 'publipostageClientApp' )
    .filter( 'templateItemsTypeFilter',
             [ '$state', 'security',
               function( $state, security ) {
                   return function ( templateItems ) {
                       return _(templateItems).select( function( templateItem ) {
                           if ( _(templateItem).has( 'showOnlyAdmin' ) ) {
                               return security.isAdmin() || security.isSuperAdmin();
                           }
                           if ( _(templateItem).has( 'showOnly' ) ) {
                               return _(templateItem.showOnly).contains( $state.params.type );
                           }

                           return true;
                       } );
                   };
               }
             ] );
