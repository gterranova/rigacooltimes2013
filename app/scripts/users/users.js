angular.module('users', ['resources.users', 'services.crud','security', 'security.authorization', 'services.i18nNotifications', 'directives.gravatar', 'validators.users', 'angularLocalStorage'])

.config(['crudRouteProvider', 'securityAuthorizationProvider', function (crudRouteProvider, securityAuthorizationProvider) {

  crudRouteProvider.routesFor('Users', 'scripts', '')
    .whenList({
      users: ['Users', function(Users) { return Users.all(); }]
    })
    .whenNew({
      user: ['Users', function(Users) { return new Users(); }],
    })
    .whenEdit({
      user:['$route', 'Users', function ($route, Users) {
        return Users.getById($route.current.params.itemId);
      }],
      currentUser: ['$route', function($route) {
              securityAuthorizationProvider.requireOwnerOrAdminUser($route.current.params.itemId);
      }]
    })
    .when('/users/:itemId/show', {
            templateUrl: 'scripts/users/users-show.tpl.html',
            controller: 'UsersShowCtrl',
            resolve: {
                user:['$route', 'Users', function ($route, Users) {
                        return Users.getById($route.current.params.itemId);
                }]
            }
    })
}])

.controller('UsersListCtrl', ['$scope', '$location', 'crudListMethods', 'users', 'i18nNotifications', 'security', function ($scope, $location, crudListMethods, users, i18nNotifications, security) {
            
  $scope.users = users;

  $scope.showOrEdit = function(userId) {
      if (security.isOwner(userId)) {
           $scope.edit(userId);
      } else {
          $location.path('/users/'+userId+'/show');
      }
  }
  
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
             
  angular.extend($scope, crudListMethods('/users'));
}])

.controller('UsersEditCtrl', ['$scope', '$location', 'i18nNotifications', 'user', 'COUNTRY_LIST', 'security', 'DataService', '$modal', 'storage',
        function ($scope, $location, i18nNotifications, user, COUNTRY_LIST, security, DataService, $modal, storage) {

    $scope.askEditPassword = function(show){
        if (show == null) {
            return $scope.showEditPassword;
        }
        $scope.showEditPassword = (user.id == null || show) ? 'true' : 'false';
        return $scope.showEditPassword;
    }
    $scope.showEditPassword = $scope.askEditPassword(false);

    // get store and cart from service
    $scope.store = DataService.store;
    $scope.cart = DataService.cart;
    
  if (user && user.gender && user.gender != 'M' && user.gender != 'F') {
      user.gender = '';
  }
  if (user && user.due_amount) {
      user.due_amount = parseFloat(user.due_amount);
  }
  if (user && user.paid_amount) {
      user.paid_amount = parseFloat(user.paid_amount);
  }
  
  $scope.user = user;
  $scope.original_user = angular.extend({}, user);
  
  $scope.info_payments_class = 'success';
  $scope.paypal_enabled = false;  
  $scope.isRegistration = (user.id == null);

  var default_msg = "There is nothing to be paid... Are you sure you are coming?"
  
  var updateAmount = function() {
      var amount = 0;
      amount += $scope.user.dinner ? 10 : 0;
      amount += ($scope.user.party_with_sauna && $scope.user.party_bus) ? 15 : 0;
      amount += ($scope.user.party_with_sauna && !$scope.user.party_bus) ? 12 : 0;
      amount += (!$scope.user.party_with_sauna && $scope.user.party_bus) ? 5 : 0;
      amount += ($scope.user.accomodation) ? 5 : 0;
      $scope.user.due_amount = amount;
      
      if (amount == 0) {
          $scope.due_amount = default_msg;
          $scope.info_payments_class = 'success';
          $scope.paypal_enabled = false;
      } else {
          var paid_amount = 0;
          if (user.paid_amount) {
              paid_amount = user.paid_amount;
          }
          if (paid_amount == 0) {
              $scope.paypal_enabled = true;
              $scope.due_amount = "Your bill, Sir: Euro "+amount+" (plus Euro 2 if you pay by paypal)";
              $scope.info_payments_class = 'warning';
          } else if (amount == paid_amount) {
              $scope.paypal_enabled = false;
              $scope.due_amount = "We received your payment of Euro "+amount+". Thanks!";
              $scope.info_payments_class = 'success';
          } else if (amount < paid_amount) {
              $scope.paypal_enabled = false;
              $scope.due_amount = "We received more than Euro "+amount+". Thanks for your generosity, the extra money will be given to the webmaster for his cool job!";
              $scope.info_payments_class = 'success';
          } else if (amount > paid_amount) {
              $scope.paypal_enabled = true;
              $scope.due_amount = "We received less than Euro "+amount+". Please pay the balance of Euro " + (amount - paid_amount) +".";
              $scope.info_payments_class = 'warning';
          }

      }
  };
  updateAmount();

  $scope.isFrozen = function(field){
      return user.paid_amount && $scope.original_user[field] && $scope.user[field];
  }
  
  $scope.getCountryList = function() {
      return COUNTRY_LIST;
  };
  
  $scope.checkOut = function(){
      var amount = 0;
      var paid_amount = 0;
      if (user.paid_amount) {
          paid_amount = user.paid_amount;
      }
      
      amount += $scope.user.dinner ? 10 : 0;
      amount += ($scope.user.party_with_sauna && $scope.user.party_bus) ? 15 : 0;
      amount += ($scope.user.party_with_sauna && !$scope.user.party_bus) ? 12 : 0;
      amount += (!$scope.user.party_with_sauna && $scope.user.party_bus) ? 5 : 0;
      amount += ($scope.user.accomodation) ? 5 : 0;
      amount -= paid_amount;
      
      $scope.cart.clearItems();
      if ($scope.user.dinner) {
          $scope.cart.addItem("RC0", "Dinner on friday", 0, 1);
      }
      if ($scope.user.party_with_sauna) {
          $scope.cart.addItem("RC1", "Party with sauna", 0, 1);          
      }
      if ($scope.user.party_bus) {
          $scope.cart.addItem("RC2", "Party Bus", 0, 1);          
      }
      if ($scope.user.accomodation) {
          $scope.cart.addItem("RC3", "Accomodation at sauna place", 0, 1);          
      }
      $scope.cart.addItem("PPL", "Payment commissions", 2, 1);          

      if (!user.paid_amount) {
          $scope.cart.addItem("RCT", "Fees for RCT 2013", amount, 1);
      } else {
          $scope.cart.addItem("RCT", "Integration fee for RCT 2013", amount, 1);          
      }
      $scope.cart.checkout("PayPal", true);
  }

  $scope.updateAmount = function() {
      updateAmount();
  }
  $scope.onSave = function (user) {
    if (!security.currentUser) {
        i18nNotifications.pushForNextRoute('crud.user.save.success', 'success', {id : user.$id()});
        storage.set('currentUser', user);
        $scope.user = user;
        security.requestCurrentUser();
        $location.path('/users/'+user.id);
    } else {
        i18nNotifications.pushForCurrentRoute('crud.user.save.success', 'success', {id : user.$id()});
    }
  };

  $scope.onError = function() {
    i18nNotifications.pushForCurrentRoute('crud.user.save.error', 'danger');
  };

  $scope.onRemove = function(user) {
    i18nNotifications.pushForNextRoute('crud.user.remove.success', 'success', {id : user.$id()});
    $location.path('/users');
  };
  
}])

.controller('UsersShowCtrl', ['$scope', '$location', 'i18nNotifications', 'user', 'COUNTRY_LIST', 'security', function ($scope, $location, i18nNotifications, user, COUNTRY_LIST, security) {
  $scope.user = user;
}]);