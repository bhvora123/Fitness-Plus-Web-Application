"use strict"
var app = angular.module("PassportApp", ["ngRoute", 'ui.bootstrap']);


app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.
     when('/home', {
         templateUrl: 'views/home/home.html',
         controller: 'homeCtrl'
     })
     .when('/profile/', {
         templateUrl: 'views/profile/profile.html',
         controller: 'ProfileController',
         resolve: {
             loggedin :checkLoggedin
         }
     })
     .when('/profile/:id', {
        templateUrl: 'views/profile/profile.html',
        controller: 'ProfileController'
        })
      .when('/workout', {
            templateUrl: 'views/workout/workout.html',
            controller: 'workCtrl'
     })
    .when('/workout/:id', {
           templateUrl: 'views/workoutdetail/workoutdetail.html',
           controller: 'workdetCtrl'
    })
    .when('/exercise/', {
          templateUrl: 'views/exercise/exercise.html',
          controller: 'exrcsCtrl'
    })
    .when('/exercise/:id', {
          templateUrl: 'views/exercisedetail/exercisedetail.html',
          controller: 'exrcsDetCtrl'
    })
    .when('/muscle', {
         templateUrl: 'views/muscle/muscle.html',
         controller: 'muscleCtrl'
    })
    .when('/signup/', {
         templateUrl: 'views/signup/signup.html',
         controller: 'signupCtrl'
    })
   .when('/equipment/', {
       templateUrl: 'views/equipment/equipment.html',
       controller: 'equipCtrl'
   })
    .when('/nutrition/', {
        templateUrl: 'views/nutrition/nutrition.html',
        controller: 'nutriCtrl'
    })
    .when('/nutrition/:id', {
        templateUrl: 'views/nutritiondetail/nutritiondetail.html',
        controller: 'nutriDetCtrl'
        
    })
     .otherwise({
         redirectTo: '/home',

     });
}]);
app.controller("navCntrl", function ($scope, $http, $location, $rootScope, ExerciseService, $modal) {
    $rootScope.currentUser = null;
    $scope.logout = function () {
        $http.post("/api/logout")
        .success(function (res) {
            $rootScope.currentUser = null;
            $location.url("/home");
        });
    }
    //for login
    $scope.open = function () {
        var modalInstance = $modal.open({
            templateUrl: 'loginContent.html',
            controller: 'LoginCtrl',
            
            });
    }
});



var checkLoggedin = function ($q, $timeout, $http, $location, $rootScope) {
    var deferred = $q.defer();
    $http.get('/api/loggedin').success(function (user) {
        $rootScope.errorMessage = null;
        //user is Authenticated
       // console.log(user);
        if (user != '0') {
            $rootScope.currentUser = user;
            deferred.resolve();
        } else {
            $rootScope.errorMessage = "you need to login";
            deferred.reject();
            $location.url("/login");
        }
    });
}

