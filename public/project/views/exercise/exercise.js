app.controller("exrcsCtrl", function ($scope, $http, $location, $rootScope, $routeParams, ExerciseService) {

    var categories =[];
    $scope.categories =[];
    $scope.exercises=[];
    var images =[];   // for loading
    var exercises =[];  // for loading
    $http.get("http://wger.de/api/v2/exercisecategory/?format=json&limit=10&callback=JSON_CALLBACK&ordering=id")
      .success(function (response) {
          $scope.categories = response.results;
          loadExercises(8);
      });
    $scope.select = function (cat) {
        loadExercises(cat.id);
    }
    var loadExercises = function (id) {
        $http.get("http://wger.de/api/v2/exercise/?format=json&limit=35&language=2&callback=JSON_CALLBACK&ordering=name&category="+id)
      .success(function (response) {
         
          exercises = response.results;
          images = ExerciseService.getImages();
          mappingExerciseImages();
          $scope.exercises = exercises;
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

    // commenting as no longer using jquery hence saving lot of redundant code
  /*  var value = 8;
     exercises = ExerciseService.getExercises();
    if (typeof exercises == 'undefined' || exercises == null) {
        $http.get("http://wger.de/api/v2/exercise/?format=json&limit=170&language=2&callback=JSON_CALLBACK&ordering=name")
       .success(function (response) {
           exercises = response.results;
           console.log(exercises.length);
           for (var e in exercises) {  // needed to load up default image
               exercises[e].images = "/ProjExp1/views/exercise/image-placeholder.svg";
           }
           changeExercises(value);
       });
    } else {
        var images = ExerciseService.getImages();
        $scope.categoryExercises = [];
        mappingExerciseImages();
        changeExercises(value);
    }
  
    function changeExercises(value) {
        $scope.categoryExercises = [];
        for (var e in exercises) {
            if (exercises[e].category == value) {
                $scope.categoryExercises.push(exercises[e]);
             }
        }
    }
   
    $scope.link_back = function () {
        changeExercises(12);
      }
    $scope.link_arms = function () {
        changeExercises(8);
        $scope.tab = "tab1";
    }
    $scope.link_legs = function () {
        changeExercises(9);
        $scope.tab = "tab2";
    }
    $scope.link_abs = function () {
        changeExercises(10);
    }
    $scope.link_chest = function () {
        changeExercises(11);
    }
    $scope.link_shoulder = function () {
        changeExercises(13);
    }
    $scope.link_calves = function () {
        changeExercises(14);
    }*/
   
});

