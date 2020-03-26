app.factory("ExerciseService", function ($http) {
    var exercises = null;
    var images = null;
    var nutrients = [];
    /*   $http.get("http://wger.de/api/v2/exercise/?format=json&limit=170&language=2&callback=JSON_CALLBACK&ordering=name")
        .success(function (response) {
            exercises = response.results;
            console.log("exercises length:"+exercises.length);
        });*/
    $http.get("https://wger.de/api/v2/exerciseimage/?limit=205&callback=JSON_CALLBACK")
    .success(function (response) {
        images = response.results;
        console.log("images length:" + images.length);
        //console.log(images);
    });
    $http.get("http://wger.de/api/v2/ingredient/?format=json&limit=8317&callback=JSON_CALLBACK")
        .success(function (response) {
            nutrients = response.results;
        });

    var getExercises = function () {
        return exercises;
    }
    var getImages = function () {
        return images;
    }
    var getNutrients = function () {
        return nutrients;
    }
    return {
        // getExercises: getExercises,
        getImages: getImages,
        getNutrients: getNutrients
    }
})