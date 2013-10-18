'use strict';

angular.module('angularClientApp') 
  .controller('MainCtrl', ['$scope', 'security', '$modal', function ($scope, security, $modal) {
    $scope.search = {};
    $scope.myInterval = 5000;
    $scope.slides = [{image: 'images/slideshow/slide1.jpg', title:'Riga Cool Times 2013', text:''},
                                {image: 'images/slideshow/slide3.jpg', title:'Riga Cool Times 2013', text:''},
                                {image: 'images/slideshow/slide4.jpg', title:'Riga Cool Times 2013', text:''},
                                {image: 'images/slideshow/slide5.jpg', title:'Riga Cool Times 2013', text:''},
                                {image: 'images/slideshow/slide6.jpg', title:'Riga Cool Times 2013', text:''},
                                {image: 'images/slideshow/slide7.jpg', title:'Riga Cool Times 2013', text:''}                                
    ];

    $scope.isAuthenticated = security.isAuthenticated;
    $scope.getCurrentUser = function(){
        return security.currentUser;
    };    
  }]);  
