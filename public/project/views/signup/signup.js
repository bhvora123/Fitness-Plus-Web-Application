app.controller("signupCtrl", function ($scope, $http, $rootScope, $routeParams, ExerciseService,$location) {
    $scope.red = false;
    $scope.signup = function (user) {
        user.pic = "/project/views/exercisedetail/dummy.png";
        var flag=true;

        $http.get("/api/users/")
                .success(function (response) {
                    $scope.users = response;
                    for (var u in $scope.users) {
                        if (user.username == $scope.users[u].username) {
                            flag = false; break;
                        }
                    }
                    if (flag) {
                        $scope.red = false;
                        $http.post("/api/signup/", user)
                        .success(function (response) {
                            //  $rootScope.currentUser = response;
                            console.log(response);
                            var user = { username: response.username, password: response.password };
                            $http.post("/api/login", user)
                                .success(function (response) {
                                    $rootScope.currentUser = response;
                                    console.log(response);
                                    $location.url("/profile/");

                                })
                             .error(function (response) {
                                 console.log("username is incorrect");
                                 console.log(response);
                             });
                        });
                    }
                    else {
                        $scope.red = true;
                      //  alert("user is taken");
                    }
                });
    };
    $scope.change = function (response) {
        $scope.red = false;
    }
});




 