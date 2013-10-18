'use strict';

angular.module('angularClientApp', [
    'templates.app',        
    'ngRoute',
    'ui.bootstrap',
    'services.breadcrumbs',
    'services.i18nNotifications',
    'services.httpRequestTracker',
    'users',
    'admin',
    'security',
    'directives.crud',
    'restangular',
    'datastore',
    'ngSocial',
    'ngDisqus',
    'services.modal',
    'validators.users',
    'ga'
    ])
  .config(function ($routeProvider, RestangularProvider, SERVER_URL) {
          
    $routeProvider
      .when('/', {
        templateUrl: 'scripts/main.tpl.html',
        controller: 'MainCtrl'
      })
      .when('/programme', {
        templateUrl: 'scripts/programme.tpl.html',
        controller: 'MainCtrl',
      });
      
    RestangularProvider.setBaseUrl(SERVER_URL.host+SERVER_URL.path);      
  })
      
angular.module('angularClientApp').config(['$locationProvider', '$httpProvider', '$disqusProvider', function($locationProvider, $httpProvider, $disqusProvider) {
        $locationProvider.hashPrefix('!');
        $disqusProvider.setShortname('terranovanet');
        //$httpProvider.defaults.useXDomain = true;
        //delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }
]);

angular.module('angularClientApp').run(function($timeout, $rootScope, $location, $anchorScroll, $routeParams, createDialog, i18nNotifications, ga) {
        
      $rootScope.notifications = i18nNotifications;
    
      $rootScope.removeNotification = function (notification) {
        i18nNotifications.remove(notification);
      };
    
      $rootScope.$on('$routeChangeError', function(event, current, previous, rejection){
        i18nNotifications.pushForCurrentRoute('errors.route.changeError', 'danger', {}, {rejection: rejection});
      });
        
    $rootScope.$on('$routeChangeSuccess', function(scope, newUrl, oldUrl) {
             $timeout(function() {
                 ga('send', 'pageview');
                $('h1').each(function(){
                  var elem = $(this);
                  elem.css('color','#000').attr('data-title', elem.text());
                });
             },0);
            $location.hash($routeParams.scrollTo);
            $anchorScroll();               
    });        
    $rootScope.createDialog = createDialog;
});

//TODO: move those messages to a separate module
angular.module('angularClientApp').constant('SERVER_URL', {
        host: 'http://www.terranovanet.it',
        path:'/rct2013'
        //host: 'http://localhost:8000',
        //path:'/cgi-bin/newfenix/index.py?q='
});

angular.module('angularClientApp').constant('PAYPAL_ACCOUNT', 'venjka@gmail.com');
        
angular.module('angularClientApp').constant('COUNTRY_LIST', [
      "Afghanistan", "Aland Islands", "Albania", "Algeria", "American Samoa", "Andorra", "Angola",
      "Anguilla", "Antarctica", "Antigua And Barbuda", "Argentina", "Armenia", "Aruba", "Australia", "Austria",
      "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin",
      "Bermuda", "Bhutan", "Bolivia, Plurinational State of", "Bonaire, Sint Eustatius and Saba", "Bosnia and Herzegovina",
      "Botswana", "Bouvet Island", "Brazil",
      "British Indian Ocean Territory", "Brunei Darussalam", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia",
      "Cameroon", "Canada", "Cape Verde", "Cayman Islands", "Central African Republic", "Chad", "Chile", "China",
      "Christmas Island", "Cocos (Keeling) Islands", "Colombia", "Comoros", "Congo",
      "Congo, the Democratic Republic of the", "Cook Islands", "Costa Rica", "Cote d'Ivoire", "Croatia", "Cuba",
      "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt",
      "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Falkland Islands (Malvinas)",
      "Faroe Islands", "Fiji", "Finland", "France", "French Guiana", "French Polynesia",
      "French Southern Territories", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Gibraltar", "Greece",
      "Greenland", "Grenada", "Guadeloupe", "Guam", "Guatemala", "Guernsey", "Guinea",
      "Guinea-Bissau", "Guyana", "Haiti", "Heard Island and McDonald Islands", "Holy See (Vatican City State)",
      "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iran, Islamic Republic of", "Iraq",
      "Ireland", "Isle of Man", "Israel", "Italy", "Jamaica", "Japan", "Jersey", "Jordan", "Kazakhstan", "Kenya",
      "Kiribati", "Korea, Democratic People's Republic of", "Korea, Republic of", "Kuwait", "Kyrgyzstan",
      "Lao People's Democratic Republic", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya",
      "Liechtenstein", "Lithuania", "Luxembourg", "Macao", "Macedonia, The Former Yugoslav Republic Of",
      "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Martinique",
      "Mauritania", "Mauritius", "Mayotte", "Mexico", "Micronesia, Federated States of", "Moldova, Republic of",
      "Monaco", "Mongolia", "Montenegro", "Montserrat", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru",
      "Nepal", "Netherlands", "New Caledonia", "New Zealand", "Nicaragua", "Niger",
      "Nigeria", "Niue", "Norfolk Island", "Northern Mariana Islands", "Norway", "Oman", "Pakistan", "Palau",
      "Palestinian Territory, Occupied", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines",
      "Pitcairn", "Poland", "Portugal", "Puerto Rico", "Qatar", "Reunion", "Romania", "Russian Federation",
      "Rwanda", "Saint Barthelemy", "Saint Helena, Ascension and Tristan da Cunha", "Saint Kitts and Nevis", "Saint Lucia",
      "Saint Martin (French Part)", "Saint Pierre and Miquelon", "Saint Vincent and the Grenadines", "Samoa", "San Marino",
      "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore",
      "Sint Maarten (Dutch Part)", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa",
      "South Georgia and the South Sandwich Islands", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname",
      "Svalbard and Jan Mayen", "Swaziland", "Sweden", "Switzerland", "Syrian Arab Republic",
      "Taiwan, Province of China", "Tajikistan", "Tanzania, United Republic of", "Thailand", "Timor-Leste",
      "Togo", "Tokelau", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan",
      "Turks and Caicos Islands", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom",
      "United States", "United States Minor Outlying Islands", "Uruguay", "Uzbekistan", "Vanuatu",
      "Venezuela, Bolivarian Republic of", "Viet Nam", "Virgin Islands, British", "Virgin Islands, U.S.",
      "Wallis and Futuna", "Western Sahara", "Yemen", "Zambia", "Zimbabwe"
    ]);
    
//TODO: move those messages to a separate module
angular.module('angularClientApp').constant('I18N.MESSAGES', {
  'errors.route.changeError':'Route change error',
  'crud.user.save.success':"A user with id '{{id}}' was saved successfully.",
  'crud.user.remove.success':"A user with id '{{id}}' was removed successfully.",
  'crud.user.remove.error':"Something went wrong when removing user with id '{{id}}'.",
  'crud.user.save.error':"Something went wrong when saving a user...",
  'crud.project.save.success':"A project with id '{{id}}' was saved successfully.",
  'crud.project.remove.success':"A project with id '{{id}}' was removed successfully.",
  'crud.project.save.error':"Something went wrong when saving a project...",
  'login.reason.notAuthorized':"You do not have the necessary access permissions.  Do you want to login as someone else?",
  'login.reason.notAuthenticated':"You must be logged in to access this part of the application.",
  'login.error.invalidCredentials': "Login failed.  Please check your credentials and try again.",
  'login.error.serverError': "There was a problem with authenticating: {{exception}}."
});

angular.module('angularClientApp').run(['security', function(security) {
  // Get the current user when the application starts
  // (in case they are still logged in from a previous session)
  security.requestCurrentUser();
}]);

angular.module('angularClientApp')
  .controller('HeaderCtrl', ['$scope', '$location', '$route', 'security', 'breadcrumbs', 'notifications', 'httpRequestTracker',
  function ($scope, $location, $route, security, breadcrumbs, notifications, httpRequestTracker) {
      $scope.isActive = function (viewLocation) {
          return viewLocation === $location.path();
      };
      
      var closeMenu = function() {
          $(".navbar-ex1-collapse").removeClass('in').addClass('collapse');
      };
    $scope.$on('$routeChangeSuccess', function(scope, newUrl, oldUrl) {
           closeMenu();
    });        
    
    $scope.$watch(function() {
            return security.isDialogOpen();
    }, function(isOpen) {
        if (isOpen) {
            closeMenu();
        }
    });
      
      $scope.location = $location;
      $scope.breadcrumbs = breadcrumbs;
    
      $scope.isAuthenticated = security.isAuthenticated;
      $scope.isAdmin = security.isAdmin;
    
      /*
      $scope.home = function () {
        if (security.isAuthenticated()) {
          $location.path('/dashboard');
        } else {
          $location.path('/');
        }
      };
      */      
      $scope.isNavbarActive = function (navBarPath) {
        return navBarPath === breadcrumbs.getFirst().name;
      };
    
      $scope.hasPendingRequests = function () {
        return httpRequestTracker.hasPendingRequests();
      };
      
  }])

.directive("scrollTo", ["$window", function($window){
    return {
      restrict : "AC",
      compile : function(){

        var document = $window.document;
        
        function scrollInto(idOrName) {//find element with the given id or name and scroll to the first element it finds
          if(!idOrName) //move to top if idOrName is not provided
            $window.scrollTo(0, 0);

          //check if an element can be found with id attribute
          var el = document.getElementById(idOrName);
          if(!el) {//check if an element can be found with name attribute if there is no such id
            el = document.getElementsByName(idOrName);

            if(el && el.length)
              el = el[0];
            else
              el = null;
          }

          if(el) //if an element is found, scroll to the element
            el.scrollIntoView();
          //otherwise, ignore
        }

        return function(scope, element, attr) {
          element.bind("click", function(event){
            scrollInto(attr.scrollTo);
          });
        };
      }
    };
}])
.directive('eatClick', function() {
    return function(scope, element, attrs) {
        $(element).click(function(event) {
            event.preventDefault();
        });
    }
});
