angular.module('resources.users', ['restangular', 'restangularResource']);
angular.module('resources.users').factory('Users', ['restangularResource', function (restangularResource) {

  var userResource = restangularResource('users');
  userResource.prototype.getFullName = function () {
    return this.firstname + " " + this.surname; // + " (" + this.email + ")";
  };

  return userResource;
}]);
