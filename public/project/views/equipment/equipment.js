app.controller("equipCtrl", function ($scope, $http, $location, $rootScope, $routeParams, ExerciseService) {

    $scope.equipments = [];
    $scope.exercises = [];
    var images = [];
    var exercises = [];
    $http.get("http://wger.de/api/v2/equipment/?format=json&limit=10&callback=JSON_CALLBACK&ordering=name")
              .success(function (response) {
                  $scope.equipments = response.results;
              });

    // once a equipment is selected
    $scope.select = function (response) { // response is the selected equipment
        console.log(response);
        $http.get("http://wger.de/api/v2/exercise/?format=json&limit=30&language=2&callback=JSON_CALLBACK&equipment="
            + response.id + "&ordering=name")
      .success(function (response) {
           images = ExerciseService.getImages();
           exercises = response.results;
           mappingExerciseImages();
           if (exercises.length == 0) {
             //  $scope.exercises = {}
           }else  $scope.exercises = exercises;
      });
    }

    function mappingExerciseImages() {
        for (var e in exercises) {
            var flag = false;
            for (var i in images) {
                if (exercises[e].id == images[i].exercise) {
                    exercises[e].images = "https://wger.de/media/" + images[i].image;
                    flag = true;
                    break;
                }
                if (flag == false) {
                    exercises[e].images = "/ProjExp1/views/exercise/image-placeholder.svg";
                }
            }
        }
    }
});
