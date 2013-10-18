angular.module('admin-users-edit',['services.crud', 'services.i18nNotifications', 'resources.users','validators.users'])

.controller('AdminUsersEditCtrl', ['$scope', '$location', 'i18nNotifications', 'user', 'COUNTRY_LIST', function ($scope, $location, i18nNotifications, user, COUNTRY_LIST) {

  $scope.user = user;
  $scope.original_user = angular.extend({}, user);

    $scope.askEditPassword = function(show){
        if (show == null) {
            return $scope.showEditPassword;
        }
        $scope.showEditPassword = (user.id == null || show) ? 'true' : 'false';
        return $scope.showEditPassword;
    }
    $scope.showEditPassword = $scope.askEditPassword(false);
   
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
  $scope.info_payments_class = 'success';
  $scope.paypal_enabled = false;  
  $scope.isRegistration = (user.id == null);

  var default_msg = "There is nothing to be paid."
  
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
              $scope.due_amount = user.getFullName() + " has to pay Euro "+amount+" (plus Euro 2 if he pays by paypal)";
              $scope.info_payments_class = 'warning';
          } else if (amount == paid_amount) {
              $scope.paypal_enabled = false;
              $scope.due_amount = user.getFullName() + " has paid Euro "+amount+".";
              $scope.info_payments_class = 'success';
          } else if (amount < paid_amount) {
              $scope.paypal_enabled = false;
              $scope.due_amount = user.getFullName() + " has paid more than Euro "+amount+".";
              $scope.info_payments_class = 'success';
          } else if (amount > paid_amount) {
              $scope.paypal_enabled = true;
              $scope.due_amount = user.getFullName() + " has paid less than Euro "+amount+" and still has to pay the balance of Euro " + (amount - paid_amount) +".";
              $scope.info_payments_class = 'warning';
          }

      }
  };
  updateAmount();

  $scope.isFrozen = function(field){
      return $scope.user.paid_amount && $scope.original_user[field] && $scope.user[field];
  }
  
  $scope.getCountryList = function() {
      return COUNTRY_LIST;
  };
  
  $scope.updateAmount = function() {
      updateAmount();
  }

  $scope.onSave = function (user) {
    i18nNotifications.pushForNextRoute('crud.user.save.success', 'success', {id : user.$id()});
    $location.path('/admin/users');
  };

  $scope.onError = function() {
    i18nNotifications.pushForCurrentRoute('crud.user.save.error', 'danger');
  };

  $scope.onRemove = function(user) {
    i18nNotifications.pushForNextRoute('crud.user.remove.success', 'success', {id : user.$id()});
    $location.path('/admin/users');
  };

}]);