app.controller("muscleCtrl", function ($scope, $http, $rootScope) {
    $scope.muscles = null;
    $scope.muscle1 = null;
    $scope.front_muscle = null;
    $scope.back_muscle = null;
    $scope.selected = 0;

    var front = 'http://wger.de/static/images/muscles/muscular_system_front.svg';
    var back ='http://wger.de/static/images/muscles/muscular_system_back.svg'
    $http.get("http://wger.de/api/v2/muscle/?format=json&limit=17&callback=JSON_CALLBACK")
        .success(function (response) {
            $scope.muscles = response.results;
            var muscle = $scope.muscles;
            var front_muscle = [];
            var back_muscle = [];
            console.log($scope.muscles.length);
            for (var m in muscle) {
                var id = muscle[m].id;
                var linkid = 'http://wger.de/static/images/muscles/main/muscle-' + id + '.svg';
                if (muscle[m].is_front ===true) {
                  //  console.log("true");
                    var side = front;
                    muscle[m].muscleId = linkid;
                    muscle[m].side = side;
               //     front_muscle.push(muscle[m]);
                } else{
                   // console.log("false");
                    var side = back;
                    muscle[m].muscleId = linkid;
                    muscle[m].side = side;
              //      back_muscle.push(muscle[m]);
                    }
            }
            $scope.muscles = muscle;
            $scope.muscle1 = muscle[0];
            populateExercises($scope.muscle1.id);
        });
    $scope.hover_in = function (muscle, index) {
        $scope.muscle1 = muscle;
        //console.log($scope.muscle1);
        $scope.selected = index;
        console.log("in hover in" +muscle.id)
        populateExercises(muscle.id);
    }
    var populateExercises = function (id) {
        $http.get("https://wger.de/api/v2/exercise/?muscles=" +id + "&language=2&ordering=name&callback=JSON_CALLBACK")
      .success(function (response) {
          // console.log(response.results)
          $scope.exercises = response.results;
      });
    }
});

