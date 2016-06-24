// app.controller('AppCtrl', function($scope, $ionicModal, $ionicPopover, $ionicPopup, $timeout, $location, $ionicHistory, ngFB) {
app.controller('AppCtrl', function($scope, $ionicModal, $ionicPopover, $ionicPopup, $timeout, $location, $ionicHistory,$http) {
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

        var username = 'PPT1376541621';
        var password = '23ntcdjy';
        var link = "http://103.16.78.45/admin/index.php/api/partner/login";
        // var data = {"u" : 'alfian.malik@gmail.com', "p": 'apaansih'};
        var data = {"u" : $scope.data.username, "p": $scope.data.password};
        
        $scope.options = $scope.options || {};

        $http({
            method: 'POST',
            url: link,
            data: data,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(function(res){
            console.log(res);
            if(res.status="200"){
                if(null != res.data.email){
                    window.localStorage.setItem("username", res.data.fullname);
                    
                    window.localStorage.setItem("password", res.data.password);
                    window.localStorage.setItem("response", JSON.stringify(res.data));

                    // window.localStorage.setItem("response", JSON.stringify(response[0]));
                    // console.log(JSON.parse(window.localStorage.getItem("response")).fullname);
                    
                        var d = new Date();
                        var timestamp = d.getFullYear()+''+d.getMonth()+''+d.getDay()+''+d.getHours()+''+d.getMinutes()+''+d.getSeconds();

                        var pass = CryptoJS.SHA1(res.data.username_trx+password+timestamp).toString();
                        var link_balance = 'http://103.16.78.45/admin/index.php/api/routers/balance/userid/'+res.data.username_trx+'/sign/'+pass+'/timestamp/'+timestamp;
                        $http({
                            method: 'GET',
                            url: link_balance,
                            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                        }).then(function(balance){
                            window.localStorage.setItem("balance", balance.data.balance);
                            $scope.balance = balance.data.balance;
                        });

                    window.location = "#/app/profile";
                    $ionicHistory.nextViewOptions({
                        disableBack: true
                    });  
                    $scope.fullname = window.localStorage.getItem("username");
                    $scope.balance  = window.localStorage.getItem("balance");
                }else{
                    var alertPopup = $ionicPopup.alert({
                        title: 'Login Gagal',
                        template: res.data.error
                    });    
                }
            }else{
                var alertPopup = $ionicPopup.alert({
                    title: 'Login Gagal',
                    template: 'Masukan Username dan Password dengan benar'
                });
            }
        });
    }

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