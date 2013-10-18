angular.module('restangularResource', ['restangular']).factory('restangularResource', ['Restangular', function (Restangular) {

  function RestangularResourceFactory(collectionName) {

    /*var url = MONGOLAB_CONFIG.baseUrl + MONGOLAB_CONFIG.dbName + '/collections/' + collectionName;
    var defaultParams = {};
    if (MONGOLAB_CONFIG.apiKey) {
      defaultParams.apiKey = MONGOLAB_CONFIG.apiKey;
    }
    */
    var thenFactoryMethod = function (httpPromise, successcb, errorcb, isArray) {
      var scb = successcb || angular.noop;
      var ecb = errorcb || angular.noop;

      return httpPromise.then(function (response) {
        var result;
        if (isArray) {
          result = [];
          for (var i = 0; i < response.length; i++) {
            result.push(new Resource(response[i]));
          }
        } else {
            result = new Resource(response);
        }
        scb(result, response.status, response.headers, response.config);
        return result;
      }, function (response) {
        ecb(undefined, response.status, response.headers, response.config);
        return undefined;
      });
    };

    var Resource = function (data) {
      angular.extend(this, data);
    };

    Resource.all = function (cb, errorcb) {
      return Resource.query({}, cb, errorcb);
    };

    Resource.query = function (params, successcb, errorcb) {
      var httpPromise = Restangular.all(collectionName).getList(params);
      return thenFactoryMethod(httpPromise, successcb, errorcb, true);
    };

    Resource.getById = function (id, successcb, errorcb) {
      var httpPromise = Restangular.one(collectionName, id).get();
      return thenFactoryMethod(httpPromise, successcb, errorcb);
    };

    //instance methods

    Resource.prototype.$id = function () {
      if (this.id) {
        return this.id;
      }
    };

    Resource.prototype.$save = function (successcb, errorcb) {
      var httpPromise =  Restangular.all(collectionName).post(this);
      return thenFactoryMethod(httpPromise, successcb, errorcb);
    };

    Resource.prototype.$update = function (successcb, errorcb) {
        var copy = Restangular.copy(this);
      var httpPromise = copy.put();
      return thenFactoryMethod(httpPromise, successcb, errorcb);
    };

    Resource.prototype.$remove = function (successcb, errorcb) {
        var copy = Restangular.copy(this);
      var httpPromise = copy.remove();
      return thenFactoryMethod(httpPromise, successcb, errorcb);
    };

    Resource.prototype.$saveOrUpdate = function (savecb, updatecb, errorSavecb, errorUpdatecb) {
      if (this.$id()) {
        return this.$update(updatecb, errorUpdatecb);
      } else {
        return this.$save(savecb, errorSavecb);
      }
    };

    return Resource;
  }
  return RestangularResourceFactory;
}]);
