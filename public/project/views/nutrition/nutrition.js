app.controller("nutriCtrl", function ($scope, $http, $location, $rootScope, $routeParams, ExerciseService) {

    $scope.filteredTodos = [],
     $scope.currentPage = 1,
     $scope.numPerPage = 30, // items to be displayed on a page
     $scope.maxSize = 5,   // pagination limit to be shown
     $scope.nutritients = [];
    $scope.nutrientsname = [];  //names to be shown in autocomplete

    var loadPage = function (pageno) {
        console.log(pageno);
        $http.get("http://wger.de/api/v2/ingredient/?format=json&limit=30&page=1&callback=JSON_CALLBACK&ordering=name&page="+pageno)
           .success(function (response) {
        $scope.filterednutrients = response.results;
        console.log("done");
       });
    }
    loadPage(1);

    var nutrients = ExerciseService.getNutrients();  // getting all nutrients from a service
    console.log(nutrients.length);
      for (var n in nutrients) {
             $scope.nutrientsname.push(nutrients[n].name);  // require names here
       }
     
    $scope.select = function(index){
        console.log(index);
    }
  
   $scope.numPages = function () {
       return 278;
    };

    $scope.$watch('currentPage + numPerPage', function () {
       // var begin = (($scope.currentPage - 1) * $scope.numPerPage)
        //, end = begin + $scope.numPerPage;

        //$scope.filterednutrients = $scope.nutritients.slice(begin, end);
        loadPage($scope.currentPage);
    });
   // for travelling to different window
    var movetodetail = function (name) {
        console.log(name);
        var id = null;
        for (var n in nutrients) {
            if (nutrients[n].name == name) {
                 id = nutrients[n].id;
                console.log(id);
                window.location.href = "#/nutrition/"+id;
            }
        }
       }
    $scope.travel = function () {
        $location.url("/nutrition/611");
    }

    $(function () {
        $("#ingredient-search").autocomplete({
            source: $scope.nutrientsname,
            select: function (event, ui) {
              movetodetail(ui.item.value);
            }
        });
    });
});

