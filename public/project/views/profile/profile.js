app.controller("ProfileController", function ($scope, $http, $location, $rootScope, $routeParams) {
    var userId = null;
    if ($routeParams.id != null) {
        if ($rootScope.currentUser != null && $routeParams.id == $rootScope.currentUser._id) {
            userId = $rootScope.currentUser._id;
             $http.get("/api/user/" + userId)
			            .success(function (response) {
                $rootScope.currentUser = response[0];
			});
            $scope.unfollowflag = true;
            //console.log("f");
        } else {
            $scope.unfollowflag = false;
            console.log("s");
            userId = $routeParams.id;
            $http.get("/api/user/" + userId)
            .success(function (response) {
                $scope.currentUser = response[0];
              //  console.log($scope.currentUser);
            });
        }
    } else if ($rootScope.currentUser != null) {
        userId = $rootScope.currentUser._id;
        $scope.unfollowflag = true;
        console.log($scope.unfollow);
        $http.get("/api/user/" + userId)
					            .success(function (response) {
		                $rootScope.currentUser = response[0];
			});
    }
  //  console.log($rootScope.currentUser.comment);
    $http.get("/api/famousworkout_userspecific/" + userId)
          .success(function (response) {
              $scope.followedWorkouts = response;
          });
    $http.get("/api/followingworkout/" + userId)
      .success(function (response) {
          $scope.followingworkouts = response;
          $http.get("/api/users/")
               .success(function (response) {
                   $scope.users = response;
                   for (var e in $scope.followingworkouts) {
                       for (var u in $scope.users) {
                           if ($scope.followingworkouts[e].userid == $scope.users[u]._id) {
                               $scope.followingworkouts[e].role = $scope.users[u].role;
                               $scope.followingworkouts[e].username = $scope.users[u].username;
                           }
                       }
                   }
               });
        //  console.log($scope.followedworkouts);
      });
    // functionality for unfollow
    $scope.unfollow = function (workoutid) {
        var user = { userId: userId };
        console.log("in unfollow");
        $http.get("/api/workoutid/" + workoutid)
       .success(function (response) {
           response[0].followersid.splice(userId);
           var followerdata = { followersid: response[0].followersid, userId: userId, followers: response[0].followers - 1 };
           followUnfollow(workoutid, followerdata)
       });
    }
    var followUnfollow = function (workoutid, followerdata) {
        $http.put("/api/workoutupdate/" + workoutid, followerdata)
       .success(function (response) {
           console.log("response");
           console.log(response);
           $scope.followingworkouts = response;

       });
    }

});