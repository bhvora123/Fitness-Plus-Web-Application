app.controller("exrcsDetCtrl", function ($scope, $http, $rootScope, $routeParams, ExerciseService,$sce) {
    var exerciseid = $routeParams.id;  // id of particular exercise
    var images = ExerciseService.getImages();
    var userId =null;
    if ($rootScope.currentUser != null) {
        console.log("userid is not null");
        userId = $rootScope.currentUser._id;
    }
   
    $scope.exerciseImage = [];
    console.log(exerciseid);
    $scope.exercise = null;
    var mainMuscles = [];
    var secMuscles = [];
    $scope.frontMuscle = [];
    $scope.backMuscle = [];
    $scope.frontMuscleUrl = "";
    $scope.backMuscleUrl = "";
    $scope.users = [];
    $scope.user = null;
    $scope.comments = [];
    var equipments= null;

    $http.get("/api/users/")
    .success(function (response) {
        $scope.users = response;
       // console.log(userId);
        if (userId == null || typeof userId == 'undefined') {
            $scope.user = { pic: "/project/views/exercisedetail/dummy.png" };
        } else {
            $scope.user = $rootScope.currentUser;
           /* for (var u in $scope.users) {
                if ($scope.users[u]._id == userId) {
                    $scope.user = $scope.users[u];
                   // console.log($scope.user);
                    if ($scope.user.pic == null) {
                        $scope.user.pic = "/ProjExp1/views/exercisedetail/dummy.png" ;
                    }
                }
            }*/
        }
        console.log($scope.user);
    });
    $http.get("http://wger.de/api/v2/exercise/" + exerciseid + "?&callback=JSON_CALLBACK")
       .success(function (response) {
           $scope.exercise = response;
           $scope.thisCanBeusedInsideNgBindHtml = $sce.trustAsHtml($scope.exercise.description); 
           for (var i in images) {
               if (images[i].exercise == exerciseid) {
                   $scope.exerciseImage.push("https://wger.de/media/" + images[i].image);
               }
           }
           mainMuscles = $scope.exercise.muscles; //"muscles": [  5  ], 
           secMuscles = $scope.exercise.muscles_secondary;
           $http.get("http://wger.de/api/v2/muscle/?format=json&limit=17&callback=JSON_CALLBACK")
            .success(function (response) {
                var muscles = response.results;
                $scope.exercise.musclename = [];  // assigning muscle names
                for (var m in mainMuscles) {
                    for (var n in muscles) {
                        if (mainMuscles[m] == muscles[n].id) {
                            $scope.exercise.musclename.push(muscles[n].name);
                            if (muscles[n].is_front === true) {
                                $scope.frontMuscle.push('http://wger.de/static/images/muscles/main/muscle-' + mainMuscles[m] + '.svg')
                            } else {
                                $scope.backMuscle.push('http://wger.de/static/images/muscles/main/muscle-' + mainMuscles[m] + '.svg')
                            }
                        }
                    }
                }
                for (var s in secMuscles) {
                    for (var m in muscles) {
                        if (secMuscles[s] == muscles[m].id) {
                            $scope.exercise.musclename.push(muscles[m].name);
                            if (muscles[m].is_front === true) {
                                $scope.frontMuscle.push('http://wger.de/static/images/muscles/secondary/muscle-' + secMuscles[s] + '.svg')
                            } else {
                                $scope.backMuscle.push('http://wger.de/static/images/muscles/secondary/muscle-' + secMuscles[s] + '.svg')
                            }
                        }
                    }
                }
                $scope.frontMuscleUrl = "background-image:";
                for (var f in $scope.frontMuscle) {
                    $scope.frontMuscleUrl = $scope.frontMuscleUrl + "url(" + $scope.frontMuscle[f] + "),"
                }
                $scope.frontMuscleUrl = $scope.frontMuscleUrl + "url(http://wger.de/static/images/muscles/muscular_system_front.svg)";

                $scope.backMuscleUrl = "background-image:";
                for (var f in $scope.backMuscle) {
                    $scope.backMuscleUrl = $scope.backMuscleUrl + "url(" + $scope.backMuscle[f] + "),"
                }
                $scope.backMuscleUrl = $scope.backMuscleUrl + "url(http://wger.de/static/images/muscles/muscular_system_back.svg)";

                $http.get("https://wger.de/api/v2/exercisecategory/" + $scope.exercise.category)
                .success(function (response) {
                    $scope.exercise.categoryname = response.name;
                });
                $http.get("http://wger.de/api/v2/equipment/?format=json&limit=10&callback=JSON_CALLBACK&ordering=name")
                 .success(function (response) {
                     $scope.equipments = response.results;
                     $scope.exercise.equipmentname = null;
                     for (var e in $scope.exercise.equipment) {
                         for (var r in $scope.equipments) {
                             if ($scope.exercise.equipment[e] == $scope.equipments[r].id) {
                                 if ($scope.exercise.equipmentname == null) {
                                     $scope.exercise.equipmentname = $scope.equipments[r].name;
                                 } else $scope.exercise.equipmentname = $scope.exercise.equipmentname + ' , ' + $scope.equipments[r].name;
                             }
                         }
                     }
                });


            });
       });
    
    $scope.saveComment = function () {
        var comment = { commentdesc: $scope.data, userid: userId };
        $scope.comments.unshift(comment);
       // console.log($scope.comments);
        var exercise = { exerciseid: exerciseid, comment: $scope.comments };
        console.log(exercise);
        $http.post("/api/exercisecomment/" + exerciseid, exercise)
        .success( function(response){
            console.log(response);
            var commentId = response.comment[0]._id;
            // console.log(commentId);
            var commentUser = { exerciseid: exerciseid, commentid: commentId, commentdesc: comment.commentdesc, exercisename: $scope.exercise.name };
            console.log(userId);
            $scope.user.comment.unshift(commentUser);
            $http.post("/api/usercomment/" + userId, $scope.user.comment)
            .success(function (response) {
                console.log("done");
            })
        });
        $scope.data = null;
        // for display purpose only
        for (var u in $scope.users) {
            if ($scope.users[u]._id == userId) {
                $scope.comments[0].pic = $scope.users[u].pic;
                $scope.comments[0].username = $scope.users[u].username;
                $scope.comments[0].creationdate = Date.now;
                $scope.commentslength = $scope.comments.length;
                break;
            }
        }
        // saving to user table
       // $http.put("/api/usercommentupdate")
    }
    $http.get("/api/exercisecomment/" + exerciseid)
    .success(function (response) {
        if ( response.length > 0) {
            console.log(response[0].comment);
            $scope.comments = response[0].comment;
            $scope.commentslength = $scope.comments.length;
            console.log($scope.comments);
            console.log($scope.users);
            for (var c in $scope.comments) {
                for (var u in $scope.users) {
                    if ($scope.users[u]._id === $scope.comments[c].userid) {
                        console.log($scope.users[u]._id);
                        console.log($scope.comments[c].userid);
                        $scope.comments[c].pic = $scope.users[u].pic;
                        $scope.comments[c].username = $scope.users[u].username;
                        $scope.comments[c].userid = $scope.users[u]._id;
                        console.log($scope.comments[c].username);
                        break;
                    }
                }
            }
        }
    });
    $(function () {
        $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
          //  $("#add_desc").append($scope.exercise.description);
            //$("#add_desc").append("value");
            alert("vishal is great");
        });
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