// app.controller('AppCtrl', function($scope, $ionicModal, $ionicPopover, $ionicPopup, $timeout, $location, $ionicHistory, ngFB) {
app.controller('AppCtrl', function($scope, $ionicModal, $ionicPopover, $ionicPopup, $timeout, $location, $ionicHistory,$http,$state) {
    // Form data for the login modal
    $scope.loginData = {};

    var navIcons = document.getElementsByClassName('ion-navicon');
    for (var i = 0; i < navIcons.length; i++) {
        navIcons.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    }

    $scope.slideHasChanged = function ($index){

    }

    // .fromTemplate() method
    var template = '<ion-popover-view>' +
        '   <ion-header-bar>' +
        '       <h1 class="title">My Popover Title</h1>' +
        '   </ion-header-bar>' +
        '   <ion-content class="padding">' +
        '       My Popover Contents' +
        '   </ion-content>' +
        '</ion-popover-view>';

    $scope.popover = $ionicPopover.fromTemplate(template, {
        scope: $scope
    });
    $scope.closePopover = function() {
        $scope.popover.hide();
    };
    //Cleanup the popover when we're done with it!
    $scope.$on('$destroy', function() {
        $scope.popover.remove();
    });

    $scope.groups = [];
    for (var i = 0; i < 2; i++) {
        $scope.groups[i] = {
            name: i,
            items: []
        };
        for (var j = 0; j < 3; j++) {
            $scope.groups[i].items.push(i + '-' + j);
        }
    }

    $scope.toggleGroup = function(group) {
        if ($scope.isGroupShown(group)) {
            $scope.shownGroup = null;
        } else {
            $scope.shownGroup = group;
        }
    };
    $scope.isGroupShown = function(group) {
        return $scope.shownGroup === group;
    };
    $scope.data = {};
    $scope.fullname = window.localStorage.getItem("username");
    $scope.balance  = window.localStorage.getItem("balance");

    $scope.login = function() {
        var link = uri+"partner/login";
        var data = {"u" : $scope.data.username, "p": $scope.data.password};

        $scope.options = $scope.options || {};
        $http.post(link,data).then(function(res){
            console.log(res);
            if(res.status = 200){
                window.localStorage.setItem("username", res.data.fullname);
                window.localStorage.setItem("password", res.password);
                window.localStorage.setItem("response", JSON.stringify(res.data));

                ky = CryptoJS.enc.Utf8.parse(key);
                var iv = CryptoJS.enc.Base64.parse(res.data.iv); //nilai iv ada di response
                var plaintext = CryptoJS.AES.decrypt(res.data.password_trx, ky, {iv: iv, padding: CryptoJS.pad.ZeroPadding}); //kata merupakan password yg terenkripsi
                var pass = plaintext.toString(CryptoJS.enc.Utf8);
                var timestamp = date_php("YmdHis");
                var pass = CryptoJS.SHA1((res.data.username_trx + pass + timestamp)).toString();

                var link_balance = uri + 'routers/balance/userid/'+res.data.username_trx+'/sign/'+pass+'/timestamp/'+timestamp;
                $http.get(link_balance).success(function(row_b){
                    window.localStorage.setItem("balance", row_b.balance);
                    $scope.balance = row_b.balance;
                    $state.go("app.mainmenu");
                    $ionicHistory.nextViewOptions({
                        disableBack: true
                    });
                    $scope.fullname = window.localStorage.getItem("username");
                    $scope.balance = window.localStorage.getItem("balance");
                });
            }else{
                var alertPopup = $ionicPopup.alert({
                    title: 'Username / pasword salah',
                    template: res.data.status
                });
            }

        });
    };

    $scope.isLoggedIn = function() {
        if (window.localStorage.getItem("username") !== undefined && window.localStorage.getItem("password") !== undefined) {
            return true;
        } else {
            return false;
        }
    };

    $scope.isLoggedInClass = function() {
        if ((window.localStorage.getItem("username")) !== null && window.localStorage.getItem("password") !== null) {
            return '';
        } else {
            return 'hidden';

        }
    };

    $scope.isLoggedInClassLogin = function() {
        if (window.localStorage.getItem("username") !== null && window.localStorage.getItem("password") !== null) {
            return 'hidden';
        } else {
            return '';
        }
    };

    $scope.logout = function() {
        window.localStorage.removeItem("username");
        window.localStorage.removeItem("balance");
        window.localStorage.removeItem("response");
        window.localStorage.removeItem("password");
        window.location = "#/app/information";
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
    };

    // $scope.fbLogin = function () {
    //     ngFB.login({scope: 'email,read_stream,publish_actions'}).then(
    //         function (response) {
    //             if (response.status === 'connected') {
    //                 console.log('Facebook login succeeded');
    //                 $scope.closeLogin();
    //             } else {
    //                 alert('Facebook login failed');
    //             }
    //         });
    // };

    // ngFB.api({
    //     path: '/me',
    //     params: {fields: 'id,name'}
    // }).then(
    //     function (user) {
    //         $scope.user = user;
    //         console.log(user);
    //     },
    //     function (error) {
    //         alert('Facebook error: ' + error.error_description);
    //     });

});
