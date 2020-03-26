app.controller("nutriDetCtrl", function ($scope, $http, $location, $rootScope, $routeParams) {

    $scope.nutrientid = $routeParams.id;
    $http.get("https://wger.de/api/v2/ingredient/" + $scope.nutrientid)
               .success(function (response) {
                   $scope.nutrient = response;
               });
    //console.log($scope.nutrientname);
   // console.log("hello1");
});

