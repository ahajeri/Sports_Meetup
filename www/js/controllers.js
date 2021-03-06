angular.module('starter.controllers', [])
//login page controller
    .controller('LoginCtrl', function ($scope, $ionicModal, $state, GoogleSignin) {
        $scope.loginData = {};
        $scope.hideLogin = false;

        // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl('templates/loginModal.html', {
            scope: $scope,
            backdropClickToClose: false
        }).then(function (modal) {
            $scope.modal = modal;
        });


        $scope.login = function () {
            GoogleSignin.signIn().then(function (user) {
                $state.go('map', {user: user});
                console.log(user);
            }, function (err) {
                console.log(err);
            });
        };

        $scope.doLogin = function () {
            $scope.closeLogin();
        };

        $scope.closeLogin = function () {
            $scope.modal.hide();
            $scope.hideLogin = false;
            $state.go('map', {user: $scope.loginData.username});
        };
    })


    //home page controller
    .controller('MapCtrl', function ($scope, $state, $http, $ionicHistory) {
        if (!$state.params.user) {
            $state.go('login');
        }
        $scope.user = $state.params.user;

        $scope.userName = $scope.user ? $scope.user.w3.ig : "";

        $scope.testServerConnect = function () {

            $http.get("http://sportsmeetup-160707.appspot.com/greeting?name=Dhara")
                .then(function (response) {
                    //use server returned data here
                });

        }

        $scope.goBack = function () {
            $ionicHistory.goBack();
        }
    })
    .controller('FacilityCtrl', function ($scope, $state) {
        $scope.handleMoreClick = function () {

        };
    })
    .controller('HelpCtrl', function ($scope, $state) {
        $scope.comment = {
            text: ""
        };
        $scope.submitComments = function () {
            alert("Thanks.. Your comment has been submitted: " + $scope.comment.text);
        }


    })

    .controller('AboutCtrl', function ($scope, $state, $ionicHistory) {
        $scope.myFunc = function () {
            $scope.showMe1 = false;
            $scope.showMe2 = false;
            $scope.showMe = !$scope.showMe;
        }
        $scope.myFunc1 = function () {
            $scope.showMe = false;
            $scope.showMe2 = false;
            $scope.showMe1 = !$scope.showMe1;
        }

        $scope.myFunc2 = function () {
            $scope.showMe = false;
            $scope.showMe1 = false;
            $scope.showMe2 = !$scope.showMe2;
        }

        $scope.goBack = function () {
            $ionicHistory.goBack();
        }
    })
    .directive('map',['$http',function($http) {
        return {
            restrict: 'A',
            bindToController: true,
            link: function (scope, element, attrs) {

                getGymMapData();

                function getGymMapData(){
                    $http.get("https://datastoretest-164219.appspot.com/test/map")
                        .then(function(response) {
                            var mapMarkers = response.data.results;

                            var map = new google.maps.Map(document.getElementById('map'), {
                                zoom: 14,
                                center: new google.maps.LatLng(mapMarkers[0].lat, mapMarkers[0].lon),
                                mapTypeId: google.maps.MapTypeId.ROADMAP
                            });

                            var infowindow = new google.maps.InfoWindow();

                            var marker, i;
                            var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';
                            var icon = {
                                url: 'http://icons.iconarchive.com/icons/sonya/swarm/256/gym-icon.png', // url
                                scaledSize: new google.maps.Size(25, 25), // scaled size
                                origin: new google.maps.Point(0, 0), // origin
                                anchor: new google.maps.Point(0, 0) // anchor
                            };

                            mapMarkers.forEach(function(marker){
                                var mapMarker = new google.maps.Marker({
                                    position: new google.maps.LatLng(marker.lat, marker.lon),
                                    map: map,
                                    icon: icon
                                });

                                google.maps.event.addListener(mapMarker, 'click', (function (mapMarker) {
                                    return function () {
                                        infowindow.setContent(marker.name);
                                        infowindow.open(map, mapMarker);
                                        map.setZoom(15);
                                        map.setCenter(mapMarker.getPosition());
                                    }
                                })(mapMarker));

                                google.maps.event.addListener(mapMarker, 'dblclick', (function () {
                                    return function () {
                                        scope.goToFacility(marker.name);
                                    }
                                })());
                            });
                        });
                }
            },
            controller: function ($scope, $state, $http) {
                $scope.httpService = $http;
                $scope.goToFacility = function (selectedLocation) {
                    $state.go('facility', {facilityInfo: selectedLocation});
                }
            }
        };
    }]);







