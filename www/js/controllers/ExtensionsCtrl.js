app.controller('ExtensionsCtrl', function ($scope, $stateParams, $ionicActionSheet, $timeout, $ionicLoading, $ionicModal, $ionicPopup, ionicMaterialInk) {


})
    .controller('LaporanCtrl', function ($scope, $stateParams, $ionicActionSheet, $timeout, $ionicLoading, $ionicModal, ionicMaterialMotion, ionicMaterialInk, $http) {

        // $url = api_url("api/trx/data/owner_id/" . $this->session->userdata('id_owner') . "/cust/" . $this->session->userdata('id_cust') . "/lasttrx/1/page/$offset/limit/$limit/pos/1");
        // $res = Requests::get($url, array('Content-type: application/json'));
        var response = JSON.parse(window.localStorage.getItem("nextgen.response"));
        $scope.parseInt = parseInt;
        $scope.items = [];
        var off = 0;
        var lmt = 20;
        $scope.adaData = true;
        $scope.loadMore = function () {
            $ionicLoading.show({
                template: '<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div>'
            });
            var historyUri = uri + "trx/data/owner_id/" + response.id_owner + "/cust/" + response.id_cust + "/lasttrx/1/page/" + off + "/limit/" + lmt + "/pos/1";
            $http.get(historyUri).then(function (res) {
                if (res.status == 200) {
                    for (i = 0; i < res.data.length; i++) {
                        $scope.items.push(res.data[i]);
                    }
                    if (res.data.length < lmt) {
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

                $timeout(function () {
                    ionicMaterialMotion.fadeSlideIn({
                        selector: '.animate-fade-slide-in .item'
                    });
                }, 200);
                console.log($scope.items);
            });
        };
        $scope.$on('$stateChangeSuccess', function () {
            $scope.loadMore();
        });

        // Activate ink for controller
        ionicMaterialInk.displayEffect();

    })
    .controller('MutasiCtrl', function ($scope, $stateParams, $ionicActionSheet, $timeout, $ionicLoading, $ionicModal, ionicMaterialMotion, ionicMaterialInk,$http) {

        // $url = api_url("api/trx/data/owner_id/" . $this->session->userdata('id_owner') . "/cust/" . $this->session->userdata('id_cust') . "/lasttrx/1/page/$offset/limit/$limit/pos/1");
        // $res = Requests::get($url, array('Content-type: application/json'));
        var response = JSON.parse(window.localStorage.getItem("nextgen.response"));

        ky = CryptoJS.enc.Utf8.parse(key);
        var iv = CryptoJS.enc.Base64.parse(response.iv); //nilai iv ada di response
        var p_plain =  CryptoJS.AES.decrypt(response.password, ky, {iv: iv, padding: CryptoJS.pad.ZeroPadding});
        var p = p_plain.toString(CryptoJS.enc.Utf8);
        var plaintext = CryptoJS.AES.decrypt(response.password_trx, ky, {iv: iv, padding: CryptoJS.pad.ZeroPadding}); //kata merupakan password yg terenkripsi
        var p_trx = plaintext.toString(CryptoJS.enc.Utf8);

        $scope.parseInt = parseInt;
        $scope.items = [];
        var off = 0;
        var lmt = 20;
        $scope.adaData = true;
        $scope.loadMore = function (){
            /*
             array(
             "id" => $this->session->userdata('id_cust'),
             "awal" => $this->uri->segment(4),
             "akhir" => $this->uri->segment(5),
             "offset" => $this->uri->segment(3),
             );
             $data_string = json_encode($data);
             //            echo api_url("api/journal/getJournal");
             //            echo $data_string;
             $res = Requests::post(api_url("api/journal/getJournal"),array('Content-type: application/json', 'Content-Length: ' . strlen($data_string)),$data_string);

             */
            $ionicLoading.show({ template:
                '<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div>'
            });

            var timestamp = date_php("YmdHis");
            var pass = CryptoJS.SHA1((response.username_trx + p + p_trx + timestamp)).toString();

            var historyUri = uri+"journal/getJournal/id/"+response.username_trx+"/sign/"+pass+"/timestamp/"+timestamp+"/off/"+off;
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

    })
    .controller('ProfileCtrl', function ($scope, $stateParams, $localstorage, $http,$ionicPopup) {
        // $localstorage.set("nextgen.password", res.password);
        // $localstorage.set("nextgen.response", JSON.stringify(res.data));
        var res = JSON.parse($localstorage.get("nextgen.response"));
        var ky = CryptoJS.enc.Utf8.parse(key);
        var iv = CryptoJS.enc.Base64.parse(res.iv); //nilai iv ada di response
        var plaintext = CryptoJS.AES.decrypt(res.password, ky, {
            iv: iv,
            padding: CryptoJS.pad.ZeroPadding
        }); //kata merupakan password yg terenkripsi
        var pass = plaintext.toString(CryptoJS.enc.Utf8);

        var plaintext = CryptoJS.AES.decrypt(res.password_trx, ky, {
            iv: iv,
            padding: CryptoJS.pad.ZeroPadding
        }); //kata merupakan password yg terenkripsi
        var pass_trx = plaintext.toString(CryptoJS.enc.Utf8);

        $scope.profile = {
            fullname: $localstorage.get("nextgen.username"),
            balance: $localstorage.get("nextgen.balance"),
            password : {
                oldPass : "",
                newPass : "",
                confirmPass : ""
            },
            pin :{
                newPin : "",
                confirmPin : ""
            }
        };

        $scope.rubah = function () {
            if($scope.profile.password.oldPass != ""){
                if($scope.profile.password.oldPass == pass){
                    if($scope.profile.password.newPass != $scope.profile.password.confirmPass){
                        var alertPopup = $ionicPopup.alert({
                            title: 'Password Error',
                            template: "Password tidak sama, periksa kembali password anda"
                        });
                    }else{
                        var newPass = CryptoJS.AES.encrypt($scope.profile.password.newPass,ky,{iv:iv,padding : CryptoJS.pad.ZeroPadding});
                        // console.log(res.password);
                        console.log(newPass.toString());
                        var wordArray = CryptoJS.enc.Utf8.parse(newPass.toString());
                        var base64 = CryptoJS.enc.Base64.stringify(wordArray);
                        console.log(base64);
                        var timestamp = date_php("YmdHis");
                        var sign = CryptoJS.SHA1((res.username_trx + pass + pass_trx + timestamp)).toString();
                        var row = {
                            id : res.username_trx,
                            name : $scope.profile.fullname,
                            password : newPass.toString(),
                            password2 : res.iv,
                            sign : sign,
                            timestamp : timestamp
                        };
                        $http.post(uri + "partner/profile_update",{profile:row}).then(function(resUpdate){
                            var alertPopup = $ionicPopup.alert({
                                title: 'Berhasil',
                                template: "Rubah data berhasil"
                            });
                            alertPopup.then(function(){

                            })
                        });

                    }
                }
            }
        };

    });
