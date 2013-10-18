angular.module('validators.users', ['resources.users'])
/**
 * A validation directive to ensure that the model contains a unique email address
 * @param  Users service to provide access to the server's user database
  */
.directive('unique', ["Users", function (Users) {
  return {
    require:'ngModel',
    restrict:'A',
    link:function (scope, el, attrs, ctrl) {

      //TODO: We need to check that the value is different to the original
      
      //using push() here to run it as the last parser, after we are sure that other validators were run
      ctrl.$parsers.push(function (viewValue) {

        if (viewValue) {
            var filter = {};
            filter[attrs['name']] = viewValue;
            filter['exclude_deleted'] = 0;
          Users.query(filter, function (users) {
            if (users.length === 0) {
              ctrl.$setValidity('unique', true);
            } else {
              ctrl.$setValidity('unique', false);
            }
          });
          return viewValue;
        }
      });
    }
  };
}])

/**
 * A validation directive to ensure that this model has the same value as some other
 */
.directive('validateEquals', function() {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {

      function validateEqual(myValue, otherValue) {
        if (myValue === otherValue) {
          ctrl.$setValidity('equal', true);
          return myValue;
        } else {
          ctrl.$setValidity('equal', false);
          return undefined;
        }
      }

      scope.$watch(attrs.validateEquals, function(otherModelValue) {
        ctrl.$setValidity('equal', ctrl.$viewValue === otherModelValue);
      });

      ctrl.$parsers.push(function(viewValue) {
        return validateEqual(viewValue, scope.$eval(attrs.validateEquals));
      });

      ctrl.$formatters.push(function(modelValue) {
        return validateEqual(modelValue, scope.$eval(attrs.validateEquals));
      });
    }
  };
})