app.controller("LoginCtrl", function ($scope, $http, $location, $rootScope, $modalInstance) {
    $scope.red = false; // for displaying error message
    $scope.login = function (user) {
        //console.log(user);
        $http.post("/api/login", user)
         .success(function (response) {
             $rootScope.currentUser = response;
             console.log(response);
             $location.url("/profile/");
             $modalInstance.close();
         })
         .error(function (response) {
             console.log("username is incorrect");
             $scope.red = true;
         });
     };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.change = function (response) {
        $scope.red = false;
    }
});