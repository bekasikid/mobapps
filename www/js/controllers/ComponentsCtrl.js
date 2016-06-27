app.controller('PulsaCtrl', function ($scope, $stateParams, ionicMaterialInk, $http, $ionicPopup,$cordovaGeolocation) {
    var posOptions = {timeout: 10000, enableHighAccuracy: true};
    var tsel = false;
    $scope.prepaid = {
        telco : 0,
        nominal : 0
    };
    $scope.valid = true;
    $cordovaGeolocation
        .getCurrentPosition(posOptions)
        .then(function (position) {
            var lat  = position.coords.latitude
            var long = position.coords.longitude
            // console.log();
            console.log(geolib.isPointInside({latitude: lat, longitude: long},geom));
            if(geolib.isPointInside({latitude: lat, longitude: long},geom)==true){
                tsel = true;
            }else{
                tsel = false;
            }
            $scope.valid = tsel;
        }, function(err) {
            // error
        });

    $scope.checkOperator = function(){
        console.log($scope.prepaid.telco);
        console.log($scope.prepaid.nominal);
        if($scope.prepaid.telco != 'tsel'){
            $scope.valid = true;
        }else{
            $scope.valid = tsel;
        }
        console.log($scope.valid);
    };

    $scope.beli = function () {
        var response = JSON.parse(window.localStorage.getItem("response"));
        key = CryptoJS.enc.Utf8.parse(key);
        var iv = CryptoJS.enc.Base64.parse(response.iv); //nilai iv ada di response
        var plaintext = CryptoJS.AES.decrypt(response.password_trx, key, {iv: iv, padding: CryptoJS.pad.ZeroPadding}); //kata merupakan password yg terenkripsi
        // console.log(plaintext.toString());
        //     var text = CryptoJS.enc.Utf8.stringify(plaintext);
        var text = plaintext.toString(CryptoJS.enc.Utf8);

        var res = response.username_trx;
        var password = text;
        console.log(password);
        // var shaObj = new jsSHA("SHA-1", "TEXT");
        // shaObj.update(''+response.username_trx+text+dataWaktu);
        // var hash = shaObj.getHash("HEX");

        var timestamp = date_php("YmdHis");
        var pass = CryptoJS.SHA1(('' + res + password + timestamp)).toString();
        var data = {
            "userid": response.username_trx,
            "reffid": "Mobile-" + timestamp + "-" + Math.floor(Math.random() * 700),
            "target": $scope.data.notelp,
            "amount": 0,
            "terminal": "terminal-mobapps-1",
            "timestamp": timestamp,
            "sign": pass,
            "prodName": $scope.prepaid.telco+$scope.prepaid.nominal
        };
        // console.log(data);
        var link_beli = "http://103.16.78.45/admin/index.php/api/routers/router";
        $http({
            method: 'POST',
            url: link_beli,
            data: data,
            headers: {'Content-Type': 'application/json'}
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
}).controller('ComponentsCtrl', function ($scope, $stateParams, ionicMaterialInk, $http, $ionicPopup,$cordovaGeolocation) {
    var posOptions = {timeout: 10000, enableHighAccuracy: true};
    $cordovaGeolocation
        .getCurrentPosition(posOptions)
        .then(function (position) {
            var lat  = position.coords.latitude
            var long = position.coords.longitude
            // console.log(lat);
            // console.log(long);
            //term rawamangun : -6.197919, 106.891205
            //-6.194852, 106.923408
            console.log(geolib.isPointInside({latitude: lat, longitude: long},geom));
        }, function(err) {
            // error
        });

    $scope.beli = function () {

        var response = JSON.parse(window.localStorage.getItem("response"));

        var today = new Date();

        var response = JSON.parse(window.localStorage.getItem("response"));

        var key = 'HGeOPZPy3a7Vz83gVQznSAs33r9X2RVa';
        key = CryptoJS.enc.Utf8.parse(key);
        var iv = CryptoJS.enc.Base64.parse(response.iv); //nilai iv ada di response
        var plaintext = CryptoJS.AES.decrypt(response.password_trx, key, {iv: iv, padding: CryptoJS.pad.ZeroPadding}); //kata merupakan password yg terenkripsi
        // console.log(plaintext.toString());
        //     var text = CryptoJS.enc.Utf8.stringify(plaintext);
        var text = plaintext.toString(CryptoJS.enc.Utf8);

        var res = response.username_trx;
        var password = text;
        console.log(password);
        var wkt = dataWaktu;

        // var shaObj = new jsSHA("SHA-1", "TEXT");
        // shaObj.update(''+response.username_trx+text+dataWaktu);
        // var hash = shaObj.getHash("HEX");

        var timestamp = date_php("YmdHis");
        var pass = CryptoJS.SHA1(('' + res + password + timestamp)).toString();
        console.log('' + res + password + timestamp);
        console.log(pass);
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
        var link_beli = "http://103.16.78.45/admin/index.php/api/routers/router";

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
