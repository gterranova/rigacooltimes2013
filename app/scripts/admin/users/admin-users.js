angular.module('admin-users', ['admin-users-edit', 'services.crud', 'security.authorization', 'services.i18nNotifications']) //, 'directives.gravatar'])

.config(['crudRouteProvider', 'securityAuthorizationProvider', function (crudRouteProvider, securityAuthorizationProvider) {

  crudRouteProvider.routesFor('Users', 'scripts/admin', 'admin', 'Admin')
    .whenList({
      users: ['Users', function(Users) { return Users.all(); }],
      currentUser: securityAuthorizationProvider.requireAdminUser
    })
    .whenNew({
      user: ['Users', function(Users) { return new Users(); }],
      currentUser: securityAuthorizationProvider.requireAdminUser
    })
    .whenEdit({
      user:['$route', 'Users', function ($route, Users) {
        return Users.getById($route.current.params.itemId);
      }],
      currentUser: securityAuthorizationProvider.requireAdminUser
    });
}])

.controller('AdminUsersListCtrl', ['$scope', 'crudListMethods', 'users', 'i18nNotifications', function ($scope, crudListMethods, users, i18nNotifications) {
  $scope.users = users;

  $scope.search = {};
  $scope.searchCriteria = {};
  
  var add_watch = function(field) {
      $scope.$watch(function() { return $scope.searchCriteria[field]; },
          function(newValue, oldValue){
              if (eval(newValue) == 1) {
                  $scope.search[field] = true;
              } else {
                  delete $scope.search[field];
                  if (field == 'dinner' || field == 'party_bus') {
                      delete $scope.search[field+'_option'];
                  }
              }
          });
  };
  add_watch('dinner');
  add_watch('party_with_sauna');
  add_watch('party_bus');
  add_watch('accomodation');
  add_watch('scary_game');

  angular.extend($scope, crudListMethods('/admin/users'));

  $scope.remove = function(user, $index, $event) {
    // Don't let the click bubble up to the ng-click on the enclosing div, which will try to trigger
    // an edit of this item.
    $event.stopPropagation();

    // Remove this user
    user.$remove(function() {
      // It is gone from the DB so we can remove it from the local list too
      $scope.users.splice($index,1);
      i18nNotifications.pushForCurrentRoute('crud.user.remove.success', 'success', {id : user.$id()});
    }, function() {
      i18nNotifications.pushForCurrentRoute('crud.user.remove.error', 'danger', {id : user.$id()});
    });
  };
}]);