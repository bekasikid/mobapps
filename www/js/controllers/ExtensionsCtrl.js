app.controller('ExtensionsCtrl', function ($scope, $stateParams, $ionicActionSheet, $timeout, $ionicLoading, $ionicModal, $ionicPopup, ionicMaterialInk) {


}).controller('LaporanCtrl', function ($scope, $stateParams, $ionicActionSheet, $timeout, $ionicLoading, $ionicModal, ionicMaterialMotion, ionicMaterialInk,$http) {

    // $url = api_url("api/trx/data/owner_id/" . $this->session->userdata('id_owner') . "/cust/" . $this->session->userdata('id_cust') . "/lasttrx/1/page/$offset/limit/$limit/pos/1");
    // $res = Requests::get($url, array('Content-type: application/json'));
    var response = JSON.parse(window.localStorage.getItem("nextgen.response"));
    $scope.parseInt = parseInt;
    $scope.items = [];
    var off = 0;
    var lmt = 20;
    $scope.adaData = true;
    $scope.loadMore = function (){
        $ionicLoading.show({ template:
            '<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div>'
        });
        var historyUri = uri+"trx/data/owner_id/"+response.id_owner+"/cust/"+response.id_cust+"/lasttrx/1/page/"+off+"/limit/"+lmt+"/pos/1";
        $http.get(historyUri).then(function(res){
            if(res.status ==200) {
                for(i=0;i<res.data.length;i++){
                    $scope.items.push(res.data[i]);
                }
                if(res.data.length<lmt){
                    $scope.adaData = false;
                }
                off += res.data.length;
            }
            $scope.$broadcast('scroll.infiniteScrollComplete');
            $ionicLoading.hide();
            $scope.$parent.showHeader();
            $scope.$parent.clearFabs();
            $scope.isExpanded = true;
            $scope.$parent.setExpanded(true);
            $scope.$parent.setHeaderFab('right');

            $timeout(function() {
                ionicMaterialMotion.fadeSlideIn({
                    selector: '.animate-fade-slide-in .item'
                });
            }, 200);
            console.log($scope.items);
        });
    };
    $scope.$on('$stateChangeSuccess', function() {
        $scope.loadMore();
    });

    // Activate ink for controller
    ionicMaterialInk.displayEffect();

});
