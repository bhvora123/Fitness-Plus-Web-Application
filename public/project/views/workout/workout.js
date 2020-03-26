app.controller("workCtrl", function ($scope, $http, $location, $rootScope,$modal) {

   // var userId = $rootScope.currentUser._id;
    var userId = null;
    $scope.userId = null;
    if ($rootScope.currentUser != null) {
        console.log("userid is not null");
        userId = $rootScope.currentUser._id;
        $scope.userId = userId;
        $http.get("/api/ownworkout/" + userId)
         .success(function (response) {
           $scope.ownworkouts = response;
           console.log($scope.ownworkouts);
       });
        $http.get("/api/followingworkout/" + userId)
        .success(function (response) {
          $scope.followedworkouts = response;
          console.log($scope.followedworkouts);
      });
        $http.get("/api/famousworkout_excludingcurrentuser/" + userId)
          .success(function (response) {
              $scope.publishedworkouts = response;
              $http.get("/api/users/")
                 .success(function (response) {
                     $scope.users = response;
                     for (var e in $scope.publishedworkouts) {
                         for (var u in $scope.users) {
                             if ($scope.publishedworkouts[e].userid == $scope.users[u]._id) {
                                 $scope.publishedworkouts[e].role = $scope.users[u].role;
                                 $scope.publishedworkouts[e].username = $scope.users[u].username;
                             }
                         }
                     }
                 });
          });
     } else {
        $http.get("/api/famousworkout_notuserspecific/")
          .success(function (response) {
              $scope.publishedworkouts = response;
              $http.get("/api/users/")
                 .success(function (response) {
                     $scope.users = response;
                     for (var e in $scope.publishedworkouts) {
                         for (var u in $scope.users) {
                             if ($scope.publishedworkouts[e].userid == $scope.users[u]._id) {
                                 $scope.publishedworkouts[e].role = $scope.users[u].role;
                                 $scope.publishedworkouts[e].username = $scope.users[u].username;
                             }
                         }
                     }
                 });
          });
      }
    $scope.isCollapsed = true;
    $scope.save = function () {   // add a new workout
            var name = $scope.data;
            console.log(name + " " + userId);
            var desc = { description: name };
            $http.post("/api/workout/" + userId, desc)
            .success(function (response) {
                $scope.ownworkouts = response;
            });
            $scope.isCollapsed = true; $scope.data = null;
    }
    $scope.cancel = function () {
        $scope.isCollapsed = true; $scope.data = null;
    }
    $scope.show = function () {
        $scope.isCollapsed = false;
    }
    $scope.publish = function (workoutid) {
         $http.put("/api/workout/" + workoutid, { userid: userId })
          .success(function (response) {
            $scope.ownworkouts = response;
        });
    }
    $scope.remove = function (workoutid) {
        $http.delete("/api/workout/" + workoutid) // cannt send user id here
        .success(function (response) {
            $http.get("/api/ownworkout/" + userId)
              .success(function (response) {
                  $scope.ownworkouts = response;
                //  console.log($scope.workouts);
                  // to remove all days related to this workout
                  });
        });
    }
    $scope.follow = function (workoutid) {
        var user = { userId: userId };
        console.log("in follow");
        $http.get("/api/workoutid/" +workoutid)
        .success(function (response) {
            //console.log(response);
            response[0].followersid.push(userId);
            var followerdata = { followersid: response[0].followersid, userId: userId, followers: response[0].followers + 1 };
            followUnfollow(workoutid, followerdata)
        });
       
    }
    $scope.unfollow = function (workoutid) {
        var user = { userId: userId };
        console.log("in unfollow");
        $http.get("/api/workoutid/" + workoutid)
       .success(function (response) {
           //  response[0].followersid.splice(userId);
           var index = response[0].followersid.indexOf(userId);
           response[0].followersid.splice(index, 1);
           var followerdata = { followersid: response[0].followersid, userId: userId, followers: response[0].followers - 1 };
           followUnfollow(workoutid, followerdata)
       });
    }
    var followUnfollow = function (workoutid, followerdata) {
        $http.put("/api/workoutupdate/" + workoutid, followerdata)
       .success(function (response) {
           console.log("response");
           $scope.followedworkouts = response;
           $http.get("/api/famousworkout_excludingcurrentuser/" + userId)
           .success(function (response) {
               $scope.publishedworkouts = response;
               $http.get("/api/users/")
               .success(function (response) {
                   $scope.users = response;
                   for (var e in $scope.publishedworkouts) {
                       for (var u in $scope.users) {
                           if ($scope.publishedworkouts[e].userid == $scope.users[u]._id) {
                               $scope.publishedworkouts[e].role = $scope.users[u].role;
                               $scope.publishedworkouts[e].username = $scope.users[u].username;
                           }
                       }
                   }
               });
        });
       });
    }

    $scope.edit = function (workout) {
            var modalInstance = $modal.open({
                templateUrl: 'workouContent.html',
                controller: 'workouteditCtrl',
                resolve: {
                    workout: function () {
                        return workout;
                    }
                }
            });
            modalInstance.result.then(function (selectedItem) {
                $http.get("/api/ownworkout/" + userId)
               .success(function (response) {
                  $scope.ownworkouts = response;
                  console.log($scope.ownworkouts);
         });
            });
    
    }
   
    //no longer using below functionality
    $scope.add = function (workoutid, index) {
        var newWorkoutId = null; // workout id of clone workout
        var days = [];  // cloned days
        var workout = { description: $scope.publishedworkouts[index].description, userid: userId, publish: false };
        $http.post("/api/newworkout/", workout) // to clone a workout
           .success(function (response) {
               newWorkoutId = response._id;
               $http.get("/api/days/" + workoutid) 
                     .success(function (response) {
                         $scope.days = response;
                         for (var d in $scope.days) {
                             days.push({
                                 description: $scope.days[d].description,
                                 days: $scope.days[d].days,
                                 Exercises: $scope.days[d].Exercises,
                                 workoutid :newWorkoutId
                             });
                         }
                         console.log(newWorkoutId);
                         console.log(days);
                         $http.post("/api/daysArray/", days)// to clone days
                           .success(function (response) {
                               $scope.days = response;
                           });
                     });
               $http.get("/api/workout/" + userId)  //  to get workouts
                 .success(function (response) {
                    $scope.workouts = response;
                 });
           });
        console.log($scope.publishedworkouts);
        $http.post("/api/workoutFollowers/", {workoutid:workoutid, followers: $scope.publishedworkouts[index].followers + 1 })
        .success(function (response) {
             $scope.publishedworkouts[index].followers = response[0].followers;
           
        });
       // $scope.$apply()
    }
   // $scope.element1 = null;
       
});

app.controller("workouteditCtrl", function ($scope, $http, workout, $rootScope, $modalInstance) {
    $scope.workoutname = workout.description;
    $scope.editWorkout = function (workoutname) {
        console.log(workoutname);
        $http.put("/api/editworkout/" + workout._id, { description: workoutname })
         .success(function (response) {
             console.log(response);
             $modalInstance.close();
         })
         .error(function (response) {
             
         });
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});