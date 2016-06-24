app.controller('SetupCtrl', function($scope, $stateParams) {
	
    $http.post(link, {username : $scope.data.username}).then(function (res){
        $scope.response = res.data;
    });
});