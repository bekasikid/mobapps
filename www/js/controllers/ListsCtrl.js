app.controller('ListsCtrl', function ($scope, $stateParams, ionicMaterialMotion,$http,$state,$ionicPopup,$ionicHistory,$ionicLoading) {

    var reset = function() {
        var inClass = document.querySelectorAll('.in');
        for (var i = 0; i < inClass.length; i++) {
            inClass[i].classList.remove('in');
            inClass[i].removeAttribute('style');
        }
        var done = document.querySelectorAll('.done');
        for (var i = 0; i < done.length; i++) {
            done[i].classList.remove('done');
            done[i].removeAttribute('style');
        }
        var ionList = document.getElementsByTagName('ion-list');
        for (var i = 0; i < ionList.length; i++) {
            var toRemove = ionList[i].className;
            if (/animate-/.test(toRemove)) {
                ionList[i].className = ionList[i].className.replace(/(?:^|\s)animate-\S*(?:$|\s)/, '');
            }
        }
    };

    $scope.ripple = function() {
        reset();
        document.getElementsByTagName('ion-list')[0].className += ' animate-ripple';
        setTimeout(function() {
            ionicMaterialMotion.ripple();
        }, 500);
    };

    $scope.fadeSlideInRight = function() {
        reset();
        document.getElementsByTagName('ion-list')[0].className += ' animate-fade-slide-in-right';
        setTimeout(function() {
            ionicMaterialMotion.fadeSlideInRight();
        }, 500);
    };

    $scope.fadeSlideIn = function() {
        reset();
        document.getElementsByTagName('ion-list')[0].className += ' animate-fade-slide-in';
        setTimeout(function() {
            ionicMaterialMotion.fadeSlideIn();
        }, 500);
    };

    $scope.blinds = function() {
        reset();
        document.getElementsByTagName('ion-list')[0].className += ' animate-blinds';
        setTimeout(function() {
            ionicMaterialMotion.blinds(); // ionic.material.motion.blinds(); //ionicMaterialMotion
        }, 500);
    };

    $scope.blinds();

    $scope.login = function() {

        $ionicLoading.show({ template:
            '<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div>'
        });

        var link = uri+"partner/login";
        var data = {"u" : $scope.data.username, "p": $scope.data.password};

        $scope.options = $scope.options || {};
        $http.post(link,data).then(function(res){
            $ionicLoading.hide();
            if(res.status = 200){
                if(res.data.noerr==0){
                    $scope.fullname = res.data.fullname;
                    window.localStorage.setItem("nextgen.username", res.data.fullname);
                    window.localStorage.setItem("nextgen.password", res.password);
                    window.localStorage.setItem("nextgen.response", JSON.stringify(res.data));
                    ky = CryptoJS.enc.Utf8.parse(key);
                    var iv = CryptoJS.enc.Base64.parse(res.data.iv); //nilai iv ada di response
                    var plaintext = CryptoJS.AES.decrypt(res.data.password_trx, ky, {iv: iv, padding: CryptoJS.pad.ZeroPadding}); //kata merupakan password yg terenkripsi
                    var pass = plaintext.toString(CryptoJS.enc.Utf8);
                    var timestamp = date_php("YmdHis");
                    var pass = CryptoJS.SHA1((res.data.username_trx + pass + timestamp)).toString();
                    var link_balance = uri + 'routers/balance/userid/'+res.data.username_trx+'/sign/'+pass+'/timestamp/'+timestamp;
                    $http.get(link_balance).success(function(row_b){
                        window.localStorage.setItem("nextgen.balance", row_b.balance);
                        $scope.balance = row_b.balance;
                        $scope.balance = window.localStorage.getItem("nextgen.balance");
                    });
                    $state.go("app.mainmenu");
                    $ionicHistory.nextViewOptions({
                        disableBack: true
                    });
                }else{
                    var alertPopup = $ionicPopup.alert({
                        title: 'Username / pasword salah',
                        template: res.data.status
                    });
                }
            }else{
                var alertPopup = $ionicPopup.alert({
                    title: 'Username / pasword salah',
                    template: res.data.status
                });
            }

        });
    };

});
