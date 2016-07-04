app.controller('ListsCtrl', function ($scope, $stateParams, ionicMaterialMotion, $http, $state, $ionicPopup, $ionicHistory, $ionicLoading) {

    var reset = function () {
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

    $scope.ripple = function () {
        reset();
        document.getElementsByTagName('ion-list')[0].className += ' animate-ripple';
        setTimeout(function () {
            ionicMaterialMotion.ripple();
        }, 500);
    };

    $scope.fadeSlideInRight = function () {
        reset();
        document.getElementsByTagName('ion-list')[0].className += ' animate-fade-slide-in-right';
        setTimeout(function () {
            ionicMaterialMotion.fadeSlideInRight();
        }, 500);
    };

    $scope.fadeSlideIn = function () {
        reset();
        document.getElementsByTagName('ion-list')[0].className += ' animate-fade-slide-in';
        setTimeout(function () {
            ionicMaterialMotion.fadeSlideIn();
        }, 500);
    };

    $scope.blinds = function () {
        reset();
        document.getElementsByTagName('ion-list')[0].className += ' animate-blinds';
        setTimeout(function () {
            ionicMaterialMotion.blinds(); // ionic.material.motion.blinds(); //ionicMaterialMotion
        }, 500);
    };

    $scope.blinds();

    $scope.login = function () {

        $ionicLoading.show({
            template: '<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div>'
        });

        var link = uri + "partner/login";
        var data = {"u": $scope.data.username, "p": $scope.data.password};

        $scope.options = $scope.options || {};
        $http.post(link, data).then(function (res) {
            $ionicLoading.hide();
            if (res.status = 200) {
                if (res.data.noerr == 0) {
                    $scope.fullname = res.data.fullname;
                    window.localStorage.setItem("nextgen.username", res.data.fullname);
                    window.localStorage.setItem("nextgen.password", res.password);
                    window.localStorage.setItem("nextgen.response", JSON.stringify(res.data));
                    ky = CryptoJS.enc.Utf8.parse(key);
                    var iv = CryptoJS.enc.Base64.parse(res.data.iv); //nilai iv ada di response
                    var plaintext = CryptoJS.AES.decrypt(res.data.password_trx, ky, {
                        iv: iv,
                        padding: CryptoJS.pad.ZeroPadding
                    }); //kata merupakan password yg terenkripsi
                    var pass = plaintext.toString(CryptoJS.enc.Utf8);
                    var timestamp = date_php("YmdHis");
                    var pass = CryptoJS.SHA1((res.data.username_trx + pass + timestamp)).toString();
                    var link_balance = uri + 'routers/balance/userid/' + res.data.username_trx + '/sign/' + pass + '/timestamp/' + timestamp;
                    $http.get(link_balance).then(function (row_b) {
                        $scope.balance = row_b.data.balance;
                        window.localStorage.setItem("nextgen.balance", $scope.balance);
                    });
                    $state.go("app.mainmenu");
                    $ionicHistory.nextViewOptions({
                        disableBack: true
                    });
                } else if(res.data.noerr == 2) {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Login gagal',
                        template: "Username sedang digunakan"
                    });
                } else {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Login gagal',
                        template: "Username / Password salah"
                    });
                }
            } else {
                var alertPopup = $ionicPopup.alert({
                    title: 'Login gagal',
                    template: "Username / Password salah"
                });
            }

        });
    };

    $scope.reg = {
        nik: "",
        username: "",
        password: "",
        confirmpass: "",
        name: "",
        phone: "",
    };
    $scope.register = function () {

        $ionicLoading.show({
            template: '<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div>'
        });

        if($scope.reg.password != $scope.reg.confirmpass){
            var alertPopup = $ionicPopup.alert({
                title: "Password tidak sama",
                template: 'Password tidak sama, periksa kembali password yg anda masukkan'
            });
            return false;
        }

        var link = uri + "reg/pos/id/0";
        var data = {
            nik: $scope.reg.nik,
            name: $scope.reg.name,
            address: "",
            kelurahan: "",
            kecamatan: "",
            kodepos: "",
            store_name: "",
            email: $scope.reg.email,
            phone: $scope.reg.phone,
            id_owner: 2,
            deposit: 0,
            id_parent: 0
        };

        $scope.options = $scope.options || {};
        $http.post(link, data).then(function (res) {
            $ionicLoading.hide();
            if (res.status = 200) {
                if(parseInt(res.data.noerr) == 100){
                    var alertPopup = $ionicPopup.alert({
                        title: 'Registrasi Berhasil',
                        template: 'Registrasi Berhasil, tunggu email konfirmasi'
                    });
                    $state.go("app.login");
                    $ionicHistory.nextViewOptions({
                        disableBack: true
                    });
                }else if(parseInt(res.data.noerr)==530){
                    var alertPopup = $ionicPopup.alert({
                        title: 'Registrasi gagal',
                        template: 'Email sudah terdaftar, gunakan email lain'
                    });
                }

            } else {
                var alertPopup = $ionicPopup.alert({
                    title: 'Registrasi gagal',
                    template: 'Registrasi gagal, silahkan diulangi'
                });
            }

        });
    };

});
