var app = angular.module("ExerciseApp", []);

app.controller("ExerciseController",
    function ($scope, $http) {

        var oldExercises = [];
        var exercisesWithCategories = [];
        $http.get("http://wger.de/api/v2/exercise/?format=json&limit=170&language=2&callback=JSON_CALLBACK")
       .success(function (response) {
           $scope.exercises = response.results;
           console.log($scope.exercises.length);
           oldExercises = $scope.exercises;
        var categories =null;
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
            console.log(exercisesWithCategories[0].name + " " + exercisesWithCategories[0].label);
        });
       
       });
        $scope.addset = function(){
            console.log("value" + $(id_sets).val());
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
       
        $(function () {
            // data for reference
            var data = [
              { label: "anders", category: "mail" }
              
            ];

            $("#id_exer").catcomplete({
                delay: 0,
                source: exercisesWithCategories
            });
            $("#slider").slider({
                value: 4,
                min: 0,
                max: 10,
                step: 1,
                slide: function (event, ui) {
                    $("#id_sets_value").val( + ui.value);
                }
            });
            $("#id_sets_value").val($("#slider").slider("value"));
        }); 
    });