
app.controller("homeCtrl", function ($scope, $http, $location, $rootScope) {

    $scope.myInterval = 5000;
    var slides = [];
    slides.push({
        image: "/ProjExp1/Images/motivation.jpg"
    });
    slides.push({
        image: "/ProjExp1/Images/bicep.jpg"
    });
    slides.push({
        image: "/ProjExp1/Images/fitness.png"
    });
    slides.push({
        image: "/ProjExp1/Images/Hrithik.jpg"
    });
   
    $scope.slides = slides;
});