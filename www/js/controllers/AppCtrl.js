// app.controller('AppCtrl', function($scope, $ionicModal, $ionicPopover, $ionicPopup, $timeout, $location, $ionicHistory, ngFB) {
app.controller('AppCtrl', function($scope, $ionicModal, $ionicPopover, $ionicPopup, $timeout, $location, $ionicHistory,$localstorage) {
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

    $scope.getName = function(){
        return window.localStorage.getItem("nextgen.username");
    }

    $scope.getBalance = function(){
        return window.localStorage.getItem("nextgen.balance");
    }

    $scope.isLoggedIn = function() {
        if (window.localStorage.getItem("nextgen.username") !== undefined && window.localStorage.getItem("nextgen.password") !== undefined) {
            return true;
        } else {
            return false;
        }
    };

    $scope.isLoggedInClass = function() {
        if ((window.localStorage.getItem("nextgen.username")) !== null && window.localStorage.getItem("nextgen.password") !== null) {
            return '';
        } else {
            return 'hidden';

        }
    };

    $scope.isLoggedInClassLogin = function() {
        if (window.localStorage.getItem("nextgen.username") !== null && window.localStorage.getItem("nextgen.password") !== null) {
            return 'hidden';
        } else {
            return '';
        }
    };

    $scope.logout = function() {
        $localstorage.remove("nextgen.username");
        $localstorage.remove("nextgen.balance");
        $localstorage.remove("nextgen.response");
        $localstorage.remove("nextgen.password");
        $localstorage.remove("nextgen.pricing");
        window.location = "#/app/login";
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
    };

    $scope.loginData = {};
    $scope.isExpanded = false;
    $scope.hasHeaderFabLeft = false;
    $scope.hasHeaderFabRight = false;

    var navIcons = document.getElementsByClassName('ion-navicon');
    for (var i = 0; i < navIcons.length; i++) {
        navIcons.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    }

    ////////////////////////////////////////
    // Layout Methods
    ////////////////////////////////////////

    $scope.hideNavBar = function() {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'none';
    };

    $scope.showNavBar = function() {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'block';
    };

    $scope.noHeader = function() {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }
    };

    $scope.setExpanded = function(bool) {
        $scope.isExpanded = bool;
    };

    $scope.setHeaderFab = function(location) {
        var hasHeaderFabLeft = false;
        var hasHeaderFabRight = false;

        switch (location) {
            case 'left':
                hasHeaderFabLeft = true;
                break;
            case 'right':
                hasHeaderFabRight = true;
                break;
        }

        $scope.hasHeaderFabLeft = hasHeaderFabLeft;
        $scope.hasHeaderFabRight = hasHeaderFabRight;
    };

    $scope.hasHeader = function() {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (!content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }

    };

    $scope.hideHeader = function() {
        $scope.hideNavBar();
        $scope.noHeader();
    };

    $scope.showHeader = function() {
        $scope.showNavBar();
        $scope.hasHeader();
    };

    $scope.clearFabs = function() {
        var fabs = document.getElementsByClassName('button-fab');
        if (fabs.length && fabs.length > 1) {
            fabs[0].remove();
        }
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
