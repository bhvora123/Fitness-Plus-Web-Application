app.controller("workdetCtrl", function ($scope, $http, $location, $rootScope, $routeParams, $modal) {

    var userId = null;
    $scope.userId = null;
    
    if ($rootScope.currentUser != null) {
        console.log("userid is not null");
        $scope.userId = $rootScope.currentUser._id;
        userId = $scope.userId;
        console.log(userId);
    }
    var id = $routeParams.id; // workout id
    //console.log(id);
   
    $http.get("/api/workoutdetail/" + id )
    .success(function (response) {
        $scope.workout = response;
        $http.get("/api/users/")
                .success(function (response) {
                    $scope.users = response;
                        for (var u in $scope.users) {
                            if ($scope.workout.userid == $scope.users[u]._id) {
                                $scope.workout.role = $scope.users[u].role;
                                $scope.workout.username = $scope.users[u].username;
                            }
                       }
                });
    });
    $scope.days = null;
    var weekday = [];
    var fetchDaysForWorkout = function (id) {
        $http.get("/api/days/" + id)    // fetch days for a workout id
        .success(function (response) {
            $scope.days = response;  //days for a workout
            $http.get("http://wger.de/api/v2/daysofweek/?format=json&limit=7&callback=JSON_CALLBACK")
            .success(function (response) {
                $scope.nameofdays = response.results;
                namingdays($scope.days, response.results);
            });
            //console.log("days " +response);
        });
    }
    $scope.removeDay = function (day,index) {
        $scope.days.splice(index, 1);
        $http.delete("/api/removeworkoutday/" + day._id)
           .success(function (response) {
           });
    }
    $scope.removeExercise = function (day, exercise, index) {
        day.exercises.splice(index,1);
        // console.log(day);
            $http.put("/api/removeexercisefromday/" + day._id, day.exercises)
            .success(function (response) {
            });
    }
    fetchDaysForWorkout(id);
    var namingdays = function (daysScope, results) {
      //  console.log(daysScope);
       // console.log(results);
        for (day in daysScope) { // returns a array
        //    for (day in daysScope[days]) {   //element of ths array
                for (wd in results) {
                    if(daysScope[day].days == results[wd].id){
                      //  console.log(daysScope[day].days);
                        weekday.push(results[wd].day_of_week);
                        daysScope[day].weekday = results[wd].day_of_week;
                    }
              //  }
            }
           // daysScope[day].weekday = weekday;
        }
        $scope.days=daysScope;
    }
    function addDay() {
        var description = $scope.description;
        var days = $scope.dayvalue;
     //   console.log("desc" + description);
       // console.log("days" + days);
        var day = { workoutid: id, description: description, days: days };
        $http.post("/api/days/" , day)
        .success(function (response) {
            $scope.days = response;
            namingdays($scope.days, $scope.nameofdays);
        })
    }

    /*  for adding exercises, used in dropdown */
    var oldExercises = [];
    var exercisesWithCategories = [];
    $http.get("http://wger.de/api/v2/exercise/?format=json&limit=170&language=2&callback=JSON_CALLBACK")
   .success(function (response) {
       $scope.exercises = response.results;
       console.log($scope.exercises.length);
       oldExercises = $scope.exercises;
       var categories = null;
       $http.get(" https://wger.de/api/v2/exercisecategory/?format=json&callback=JSON_CALLBACK")
       .success(function (response) {
           categories = response.results;
           var exercise = null;
           for (var e in oldExercises) {
               exercise = oldExercises[e];
               for (var cat in categories) {
                   if (exercise.category == categories[cat].id) {
                       exercise.label = exercise.name;
                       exercise.category = categories[cat].name;
                       exercisesWithCategories.push(exercise);
                       //  console.log(exercise.category);
                       break;
                   }
               }
           }
           console.log(exercisesWithCategories.length);
          // console.log(exercisesWithCategories[0].name + " " + exercisesWithCategories[0].label);
       });

   });
    $scope.gettingIndex = function (index) {
        console.log("index");
        console.log(index);
        $scope.record = index;
    }
    $scope.selected = 100;
    $scope.hover_in = function (exercise, index) {
        //    $scope.muscle1 = muscle;
        //console.log($scope.muscle1);
        $scope.selected = index;
       
    }
    function addexercise() {
        console.log("exercisename:" + $(id_exer).val());
        console.log("sets:" + $(id_sets_value).val());
        console.log("value:" + $scope.repetitions);
        var exercisename = $(id_exer).val();
        var sets = $(id_sets_value).val();
        var repetitions = $scope.repetitions;
        var index = $scope.record;
        var day = $scope.days[index];
        console.log(day);
        var exercises = day.exercises;
        var exercise = { exercisename: exercisename, sets: sets, reps: repetitions };
        exercises.push(exercise);
        console.log(exercises);
        
       $http.post("/api/adddays/" + day._id, exercises)
        .success(function (response) {
            fetchDaysForWorkout(id);
        });
        $scope.exercisename = null;
        $scope.repetitions = null;
    }
    $.widget("custom.catcomplete", $.ui.autocomplete, {
        _create: function () {
            this._super();
            this.widget().menu("option", "items", "> :not(.ui-autocomplete-category)");
        },
        _renderMenu: function (ul, items) {
            var that = this,
              currentCategory = "";
            $.each(items, function (index, item) {
                var li;
                if (item.category != currentCategory) {
                    ul.append("<li class='ui-autocomplete-category'>" + item.category + "</li>");
                    currentCategory = item.category;
                }
                li = that._renderItemData(ul, item);
                if (item.category) {
                    li.attr("aria-label", item.category + " : " + item.label);
                }
            });
        }
    });
   

    /*-----------------------*/

    $(function () {
        var dialog, form, dialog1;
        dialog = $("#dialog-form").dialog({
            autoOpen: false,
            height: 400,
            width: 500,
            modal: true,
            buttons: {
                //"Create an account : addUser,"
                "Save": function () {
                    addDay();
                    dialog.dialog("close");
                },
                Cancel: function () {
                    dialog.dialog("close");
                }
            }
        });
        dialog1 = $("#dialog-form1").dialog({
            autoOpen: false,
            height: 590,
            width: 600,
            modal: true,
            buttons: {
                //"Create an account : addUser,"
                "Save": function () {
                    addexercise();
                    dialog1.dialog("close");
                },
                Cancel: function () {
                    dialog1.dialog("close");
                }
            }

        });
        $("#create-day").button().on("click", function () {
            dialog.dialog("open");
        });
        $("a#create-day").click(function (e) {
         //   console.log("inside day");
            dialog.dialog("open");
        });
       
        $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
            $(".create-exercise1").click(function (e) {
                dialog1.dialog("open");
               // console.log($(e.target));
                //   alert($(e.target).val());
            });
            $(".create-exercise").button().on("click", function () {
               // console.log("button");
                dialog1.dialog("open");
            });
        });
       
       
        $("#id_exer").catcomplete({
            delay: 0,
            source: exercisesWithCategories,
            scroll: scroll
        });
        $("#slider").slider({
            value: 4,
            min: 0,
            max: 10,
            step: 1,
            slide: function (event, ui) {
                $("#id_sets_value").val(+ui.value);
            }
        });
        $("#id_sets_value").val($("#slider").slider("value"));
    });
   
});

app.directive('onFinishRender', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function () {
                    scope.$emit('ngRepeatFinished');
                });
            }
        }
    }
});