app.controller('PulsaCtrl', function ($scope,$state, $stateParams, ionicMaterialInk, $http, $ionicPopup, $cordovaGeolocation,$ionicLoading,$timeout) {
    var axisObj = ["0831", "0832", "0836", "0837", "0838", "0835", "0839"];
    var sfObj = ["0889", "0886", "0887", "0888", "0881", "0882", "0883"];
    var isatObj = ["0814", "0815", "0816", "0855", "0856", "0857", "0858"];
    var tselObj = ["0811", "0812", "0813", "0821", "0822", "0823", "0852", "0853", "0851"];
    var triObj = ["0895", "0896", "0897", "0898", "0899"];
    var xlObj = ["0817", "0818", "0819", "0859", "0877", "0878", "0879"];
    var esiaObj = ["0218", "0219", "0214", "0215", "0219", "0711"];
    var flexiObj = ["0212", "0217", "0711"];
    var boltObj = ["999"];

    var response = JSON.parse(window.localStorage.getItem("nextgen.response"));
    ky = CryptoJS.enc.Utf8.parse(key);
    var iv = CryptoJS.enc.Base64.parse(response.iv); //nilai iv ada di response
    var plaintext = CryptoJS.AES.decrypt(response.password_trx, ky, {iv: iv, padding: CryptoJS.pad.ZeroPadding}); //kata merupakan password yg terenkripsi
    var text = plaintext.toString(CryptoJS.enc.Utf8);

    var res = response.username_trx;
    var password = text;

    var posOptions = {timeout: 10000, enableHighAccuracy: true};
    var tsel = false;
    $scope.prepaid = {
        telco: 0,
        nominal: 0,
        opLogo : "",
        opCode : ""
    };
    $scope.getLogo = function(){
        var logo = "../img/"+$scope.prepaid.opLogo;
        return logo;
    };
    $scope.valid = false;
    $cordovaGeolocation
        .getCurrentPosition(posOptions)
        .then(function (position) {
            var lat = position.coords.latitude
            var long = position.coords.longitude
            // console.log();
            console.log(geolib.isPointInside({latitude: lat, longitude: long}, geom));
            if (geolib.isPointInside({latitude: lat, longitude: long}, geom) == true) {
                tsel = true;
            } else {
                tsel = false;
            }
            // $scope.valid = tsel;
        }, function (err) {
            // error
        });

    $scope.checkOperator = function () {
        // console.log($scope.prepaid.telco);
        // console.log($scope.prepaid.nominal);
        if ($scope.prepaid.telco != 'tsel') {
            $scope.valid = true;
        } else {
            $scope.valid = tsel;
        }
        // console.log($scope.valid);
    };

    var opCode = "";

    $scope.validateOperator = function () {
        if($scope.prepaid.notelp==undefined){
            return false;
        }
        var prefixNo = $scope.prepaid.notelp.substring(0, 4);
        // console.log(prefixNo);
        if (axisObj.indexOf(prefixNo) != -1) {
            opCode = "axis";
            $scope.valid = true;
            $scope.prepaid.opLogo = "axis.png";
        } else if (sfObj.indexOf(prefixNo) != -1) {
            opCode = "sf";
            $scope.valid = true;
            $scope.prepaid.opLogo = "smartfren.jpg";
        } else if (isatObj.indexOf(prefixNo) != -1) {
            opCode = "isat";
            $scope.valid = true;
            $scope.prepaid.opLogo = "im3-ooredoo-logo.png";
        } else if (tselObj.indexOf(prefixNo) != -1) {
            opCode = "tsel";
            if($scope.prepaid.nominal!=50 && $scope.prepaid.nominal!=100){
                $scope.valid = tsel;
            }else{
                $scope.valid = true;
            }
            $scope.prepaid.opLogo = "simpati1.png";
        } else if (triObj.indexOf(prefixNo) != -1) {
            opCode = "tri";
            $scope.valid = true;
            $scope.prepaid.opLogo = "3.png";
        } else if (xlObj.indexOf(prefixNo) != -1) {
            opCode = "xl";
            $scope.valid = true;
            $scope.prepaid.opLogo = "xl.png";
        } else if (esiaObj.indexOf(prefixNo) != -1) {
            opCode = "esia";
            $scope.valid = true;
        } else if (flexiObj.indexOf(prefixNo) != -1) {
            opCode = "flexi";
            $scope.valid = true;
        } else {
            var prefixNo = $scope.prepaid.notelp.substring(0, 4);
            if (prefixNo == "999") {
                opCode = "bolt";
                $scope.valid = true;
                $scope.prepaid.opLogo = "bolt.jpg";
            }
        }
        $scope.prepaid.opCode = opCode;
        console.log($scope.prepaid.opLogo);
        // console.log(opCode);
    };

    $scope.beli = function () {
        $scope.loadingIndicator = $ionicLoading.show({
            template:'<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div>'
        });
        $timeout(function(){
            $ionicLoading.hide();
            $state.go('app.laporan');
        },18000);

        var timestamp = date_php("YmdHis");
        var pass = CryptoJS.SHA1(('' + res + password + timestamp)).toString();
        var data = {
            "userid": response.username_trx,
            "reffid": "Mobile-" + timestamp + "-" + Math.floor(Math.random() * 700),
            "target": $scope.prepaid.notelp,
            "amount": 0,
            "terminal": "terminal-mobapps-1",
            "timestamp": timestamp,
            "sign": pass,
            "prodName": opCode + $scope.prepaid.nominal
        };
        // console.log(data);
        var link_beli = uri+"routers/router";
        $http({
            method: 'POST',
            url: link_beli,
            data: data,
            headers: {'Content-Type': 'application/json'}
        }).then(function (res) {
            $scope.prepaid = {
                notelp : "",
                nominal : ""
            };
            $ionicLoading.hide();
            if (res.status == 200) {
                // console.log(res.data);
                if (res.data.status != "FAILED") {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Beli Pulsa Berhasil',
                        template: 'Selamat anda telah membeli pulsa'
                    });
                } else {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Beli Pulsa Gagal',
                        template: res.data.message
                    });
                }
            } else {
                var alertPopup = $ionicPopup.alert({
                    title: 'Beli Pulsa Gagal',
                    template: res.data.status
                });
            }
        });
    }
})

    .controller('BpjsCtrl', function ($scope, $stateParams, ionicMaterialInk, $http, $ionicPopup) {
        $scope.bpjs = {
            target: "",
            nama: "",
            cabang: "",
            tagihan: 0,
            admin: 0,
            total: 0
        };

        $scope.beli = function () {
            $scope.inq = false;
            var response = JSON.parse(window.localStorage.getItem("nextgen.response"));
            ky = CryptoJS.enc.Utf8.parse(key);
            var iv = CryptoJS.enc.Base64.parse(response.iv); //nilai iv ada di response
            var plaintext = CryptoJS.AES.decrypt(response.password_trx, ky, {
                iv: iv,
                padding: CryptoJS.pad.ZeroPadding
            }); //kata merupakan password yg terenkripsi
            var text = plaintext.toString(CryptoJS.enc.Utf8);

            var res = response.username_trx;
            var password = text;

            var timestamp = date_php("YmdHis");
            var pass = CryptoJS.SHA1(('' + res + password + timestamp)).toString();
            var data = {
                "userid": response.username_trx,
                "reffid": "Mobile-BPJS-" + timestamp + "-" + Math.floor(Math.random() * 700),
                "target": $scope.bpjs.target,
                "amount": 0,
                "terminal": "terminal-mobapps-1",
                "timestamp": timestamp,
                "sign": pass,
                "prodName": "BPJS"
            };
            var link_beli = uri+"outers/router";
            $http({
                method: 'POST',
                url: link_beli,
                data: data,
                headers: {'Content-Type': 'application/json'}
            }).then(function (res) {

                if (res.status == 200) {
                    if (res.data.status != "FAILED") {
                        // var alertPopup = $ionicPopup.alert({
                        //     title: 'Beli Pulsa Berhasil',
                        //     template: 'Selamat anda telah membeli pulsa'
                        // });
                        $scope.bpjs.nama = res.data.inquiry.data_inquiry.nama;
                        $scope.bpjs.cabang = res.data.inquiry.data_inquiry.cabang;
                        $scope.bpjs.tagihan = res.data.inquiry.data_inquiry.jumlah_bayar;
                        $scope.bpjs.admin = res.data.inquiry.data_inquiry.admin_transaksi;
                        $scope.bpjs.total = res.data.inquiry.data_inquiry.total_bayar;
                        $scope.inq = true;
                    } else {
                        var alertPopup = $ionicPopup.alert({
                            title: 'Beli Pulsa Gagal',
                            template: res.data.message
                        });
                    }
                } else {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Beli Pulsa Gagal',
                        template: res.data.status
                    });
                }
            });
        };
        $scope.bayar = function () {

        };
    })
    .controller('MainMenuCtrl', function ($scope, $stateParams, ionicMaterialInk, $http,$ionicHistory) {

    })
    .controller('TelkomSpeedyCtrl', function ($scope, $stateParams, ionicMaterialInk, $http, $ionicPopup) {
        var response = JSON.parse(window.localStorage.getItem("nextgen.response"));
        ky = CryptoJS.enc.Utf8.parse(key);
        var iv = CryptoJS.enc.Base64.parse(response.iv); //nilai iv ada di response
        var plaintext = CryptoJS.AES.decrypt(response.password_trx, ky, {iv: iv, padding: CryptoJS.pad.ZeroPadding}); //kata merupakan password yg terenkripsi
        var password = plaintext.toString(CryptoJS.enc.Utf8);
        var uname = response.username_trx;

        $scope.telkom = {
            target: "",
            nama: "",
            periode: "",
            divre: "",
            tagihan: 0,
            admin: 0,
            total: 0
        };

        $scope.beli = function () {
            $scope.inq = false;
            var timestamp = date_php("YmdHis");
            var pass = CryptoJS.SHA1((uname + password + timestamp)).toString();
            var data = {
                "userid": response.username_trx,
                "reffid": "Mobile-BPJS-" + timestamp + "-" + Math.floor(Math.random() * 700),
                "target": $scope.telkom.target,
                "amount": 0,
                "terminal": "terminal-mobapps-1",
                "timestamp": timestamp,
                "sign": pass,
                "prodName": "TELKOM"
            };
            var link_beli = uri+"routers/router";
            $http({
                method: 'POST',
                url: link_beli,
                data: data,
                headers: {'Content-Type': 'application/json'}
            }).then(function (res) {

                if (res.status == 200) {
                    if (res.data.status != "FAILED") {
                        $scope.telkom.nama = res.data.inquiry.data_inquiry.nama;
                        $scope.telkom.periode = res.data.inquiry.data_inquiry.periode;
                        $scope.telkom.divre = res.data.inquiry.data_inquiry.divre;
                        $scope.telkom.tagihan = res.data.inquiry.data_inquiry.jumlah_bayar;
                        $scope.telkom.admin = res.data.inquiry.data_inquiry.admin_transaksi;
                        $scope.telkom.total = res.data.inquiry.data_inquiry.total_bayar;
                        $scope.inq = true;
                    } else {
                        var alertPopup = $ionicPopup.alert({
                            title: 'Inquiry Gagal',
                            template: res.data.message
                        });
                    }
                } else {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Inquiry Gagal',
                        template: res.data.status
                    });
                }
            });
        };
        $scope.bayar = function () {

        };
    })
    .controller('ComponentsCtrl', function ($scope, $stateParams, ionicMaterialInk, $http, $ionicPopup, $cordovaGeolocation) {
        var posOptions = {timeout: 10000, enableHighAccuracy: true};
        $cordovaGeolocation
            .getCurrentPosition(posOptions)
            .then(function (position) {
                var lat = position.coords.latitude
                var long = position.coords.longitude
                // console.log(lat);
                // console.log(long);
                //term rawamangun : -6.197919, 106.891205
                //-6.194852, 106.923408
                console.log(geolib.isPointInside({latitude: lat, longitude: long}, geom));
            }, function (err) {
                // error
            });

        $scope.beli = function () {

            var response = JSON.parse(window.localStorage.getItem("nextgen.response"));

            var today = new Date();

            var response = JSON.parse(window.localStorage.getItem("nextgen.response"));
            ky = CryptoJS.enc.Utf8.parse(key);
            var iv = CryptoJS.enc.Base64.parse(response.iv); //nilai iv ada di response
            var plaintext = CryptoJS.AES.decrypt(response.password_trx, ky, {
                iv: iv,
                padding: CryptoJS.pad.ZeroPadding
            }); //kata merupakan password yg terenkripsi
            var text = plaintext.toString(CryptoJS.enc.Utf8);

            var res = response.username_trx;
            var password = text;
            console.log(password);
            var wkt = dataWaktu;

            // var shaObj = new jsSHA("SHA-1", "TEXT");
            // shaObj.update(''+response.username_trx+text+dataWaktu);
            // var hash = shaObj.getHash("HEX");

            var timestamp = date_php("YmdHis");
            var pass = CryptoJS.SHA1((res + password + timestamp)).toString();

            var data = {
                "userid": response.username_trx,
                "reffid": "Mobile-" + timestamp + "-" + Math.floor(Math.random() * 700),
                "target": $scope.data.notelp,
                "amount": 0,
                "terminal": "terminal-mobapps-1",
                "timestamp": timestamp,
                "sign": pass,
                "prodName": "TSEL50"
            };
            // console.log(data);
            var link_beli = uri+"routers/router";

            $http({
                method: 'POST',
                url: link_beli,
                data: data,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function (res) {

                if (res.status == 200) {
                    if (res.data.status != "FAILED") {
                        var alertPopup = $ionicPopup.alert({
                            title: 'Beli Pulsa Berhasil',
                            template: 'Selamat anda telah membeli pulsa'
                        });
                    } else {
                        var alertPopup = $ionicPopup.alert({
                            title: 'Beli Pulsa Gagal',
                            template: res.data.message
                        });
                    }
                } else {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Beli Pulsa Gagal',
                        template: res.data.status
                    });
                }
            });
        }
    })
;
