/**
 * angular-adaptive-googlemaps v0.2.0
 * The MIT License
 * Copyright (c) 2013 Jan Antala
 */

(function () {
    'use strict';

    var adaptive = angular.module('adaptive.googlemaps', []);

    adaptive.controller('GoogleMapsCtrl', [ '$scope', '$element', '$log', '$window', function ($scope, $element, $log, $window) {

        var STATIC_URL = 'http://maps.googleapis.com/maps/api/staticmap?';
        var that = this;
        var google = $window.google;

        /**
         * Private methods
         */

        var getLocation = function(center, success, error) {
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode( { 'address': center}, function(results, status) {
                if (status === google.maps.GeocoderStatus.OK) {
                    success(results[0].geometry.location);
                }
                else {
                    error('Geocode was not successful for the following reason: ' + status);
                }
            });
        };

        $scope.markersArray = [];
        var addMarker = function(address) {
            getLocation(address, function(location){
                var marker = new google.maps.Marker({
                    position: location,
                    title: address,
                    map: $scope.map,
                    draggable: false
                });

                $scope.markersArray.push(marker);
            });
        };

        var removeMarkers = function() {
            for (var i=0; i<$scope.markersArray.length;i++) {
                $scope.markersArray[i].setMap(null);
            }
            $scope.markersArray = [];
        };

        var getMapType = function(maptype, href) {
            switch (maptype) {
                case 'satellite':
                    return href ? 'k' : google.maps.MapTypeId.SATELLITE;
                case 'terrain':
                    return href ? 'p' : google.maps.MapTypeId.TERRAIN;
                case 'hybrid':
                    return href ? 'h' : google.maps.MapTypeId.HYBRID;
                default: // 'roadmap'
                    return href ? 'm' : google.maps.MapTypeId.ROADMAP;
            }
        };

        /**
         * Public methods
         */

        this.buildStaticMap = function buildStaticMap() {
            var staticAttributes = {
                'sensor': $scope.options.sensor,
                'size': $scope.options.size,
                'maptype': $scope.options.maptype,
                'center': $scope.options.center,
                'zoom': $scope.options.zoom,
                'markers': $scope.options.markers
            };

            var markerStrings;
            var markers = staticAttributes.markers;

            if (markers) {
                if (!angular.isArray(markers)) {
                    markers = [markers];
                }
                markerStrings = markers;
            }

            var attrs = staticAttributes;
            var params = Object.keys(attrs).map(function (attr) {
                if (attr === 'markers' && markerStrings) {
                    return Object.keys(markerStrings).map(function (key) {
                        return 'markers=' + encodeURIComponent(markerStrings[key]);
                    }).join('&');
                }

                return encodeURIComponent(attr) + '=' + encodeURIComponent(attrs[attr]);
            });


            (function(MAP_EVENTS){
                var userAgent = navigator.userAgent || navigator.vendor || window.opera;
                //I mainly edited the body of if(MAP_EVENTS.redirect)
                //to take into account of multiple the multiple web devices one could be using
                //and default it to the normal google maps webpage if it is not an iOS or android device.
                if (MAP_EVENTS.redirect) {
                    if(userAgent.match(/iPad/i) || userAgent.match(/iPhone/i) || userAgent.match(/iPod/i))
                    {
                        //maps: is the URI to call apple maps (iOS 6 or higher. I have not tested on an iOS 5 or lower device.)
                        $scope.MAP_HREF = 'maps://?daddr=' + $scope.options.center + '&saddr=My+Location';
                    }
                    else if(userAgent.match(/Android/i))
                    {
                        //geo: is the official android way of calling google maps.
                        $scope.MAP_HREF = 'geo:0,0?q=' + $scope.options.center;
                    }
                    else
                    {
                        //this will call the normal google maps web browser.
                        $scope.MAP_HREF = 'http://maps.google.com/maps?saddr=Current+Location&daddr=' + $scope.options.center;
                    }
                }
            })($scope.MAP_EVENTS);

            $scope.imgsrc = STATIC_URL + params.reduce(function (a, b) {
                if (!a) {
                    return b;
                }

                if (b !== undefined) {
                    return a + '&' + b;
                }

                return a;
            }, '');

            $scope.updateStyle();
        };

        this.buildDynamicMap = function() {
            if (!google) {
                return $log.error('The `googlemaps` script is required.');
            }

            var dynamicAttributes = {
                'maptype': $scope.options.maptype,
                'center': $scope.options.center,
                'zoom': $scope.options.zoom,
                'markers': $scope.options.markers
            };

            var mapOptions = {
                center: (new google.maps.LatLng(0, 0)),
                zoom: (Number(dynamicAttributes.zoom) || 6),
                mapTypeId: getMapType(dynamicAttributes.maptype, false)
            };

            $scope.map = new google.maps.Map($element[0], mapOptions);
            $scope.mapLoaded = true;
            $scope.style['background-image'] = 'none';
            $scope.$apply();

            getLocation(
                dynamicAttributes.center,
                function(location){
                    $scope.map.setCenter(location);
                    for (var i = 0; dynamicAttributes.markers && i < dynamicAttributes.markers.length; i++) {
                        addMarker(dynamicAttributes.markers[i]);
                    }
                },
                function(error){
                    $log.error(error);
                }
            );

            google.maps.event.addListener($scope.map, 'zoom_changed', function() {
                $scope.options.zoom = $scope.map.getZoom();
            });

            google.maps.event.addListener($scope.map, 'maptypeid_changed', function() {
                $scope.options.maptype = $scope.map.getMapTypeId();
            });

            google.maps.event.addListener($scope.map, 'center_changed', function() {
                var center = $scope.map.getCenter();
                $scope.options.center = center.mb + ',' + center.nb;
            });
        };

        $scope.updateStyle = function(){
            $scope.style = {
                'display': 'block',
                'cursor': 'pointer',
                'background-image': 'url(\'' + ($scope.imgsrc || STATIC_URL + 'sensor=' + ($scope.options.sensor || 'false') + '&size=' + ($scope.options.size)) + '\')',
                'background-repeat': 'no-repeat',
                '-webkit-background-size': 'cover',
                '-moz-background-size': 'cover',
                '-o-background-size': 'cover',
                '-ms-background-size': 'cover',
                'background-size': 'cover',
                'background-position': 'center center'
            };
        };

        $scope.updateStyle();

        $scope.buildMap = function(changed) {
            if (!$scope.mapLoaded) {
                that.buildStaticMap();
            }
            else {
                if (changed === 'center') {
                    getLocation(
                        $scope.options.center,
                        function(location){
                            $scope.map.panTo(location);
                        },
                        function(error){
                            $log.error(error);
                        }
                    );
                }
                else if (changed === 'zoom') {
                    $scope.map.setZoom($scope.options.zoom);
                }
                else if (changed === 'maptype') {
                    $scope.map.setMapTypeId(getMapType($scope.maptype));
                }
                else if (changed === 'markers') {
                    removeMarkers();
                    for (var i = 0; $scope.options.markers && i < $scope.options.markers.length; i++) {
                        addMarker($scope.options.markers[i]);
                    }
                }
            }
        };

        var listeners = [];
        this.startWatching = function() {
            listeners.push($scope.$watch('options.zoom', function() {
                $scope.buildMap('zoom');
            }));

            listeners.push($scope.$watch('options.center', function() {
                $scope.buildMap('center');
            }));

            listeners.push($scope.$watch('options.sensor', function() {
                $scope.buildMap('sensor');
            }));

            listeners.push($scope.$watch('options.markers', function() {
                $scope.buildMap('markers');
            }));

            listeners.push($scope.$watch('options.size', function() {
                $scope.buildMap('size');
            }));

            listeners.push($scope.$watch('options.maptype', function() {
                $scope.buildMap('maptype');
            }));
        };

        this.stopWatching = function() {
            listeners.forEach(function(listener){
                listener();
            });
        };

    }]);

    adaptive.directive('googlemaps', [ function () {
        return {
            template: '<a ng-style="style" ng-href="{{MAP_HREF}}" target="_blank"></a>',
            replace: true,
            restrict: 'E',
            controller: 'GoogleMapsCtrl',
            scope: {
                options: '='
            },

            link: function postLink(scope, element, attrs, ctrl) {

                var ael = element;
                scope.MAP_EVENTS = angular.extend({}, scope.options.mapevents);

                if (scope.options.sensor === undefined) {
                    throw new Error('The `sensor` attribute is required.');
                }

                if (!scope.options.size) {
                    throw new Error('The `size` attribute is required.');
                }

                if (!scope.options.center) {
                    throw new Error('The `center` attribute is required.');
                }

                var sizeBits = scope.options.size.split('x');
                if (sizeBits.length !== 2) {
                    throw new Error('Size must be specified as `wxh`.');
                }

                ctrl.buildStaticMap();
                scope.mapLoaded = false;

                if (scope.options.listen) {
                    ctrl.startWatching();
                }

                element.bind('click', function(event){
                    if (scope.MAP_EVENTS.loadmap && !scope.mapLoaded) {
                        event.preventDefault();
                        ael.removeAttr('href');
                        ctrl.buildDynamicMap();
                    }
                    else if (!scope.MAP_EVENTS.redirect && !scope.mapLoaded) {
                        event.preventDefault();
                    }
                    else if (!scope.MAP_EVENTS.loadmap && scope.mapLoaded) {
                        event.preventDefault();
                    }
                });
            }
        };
    }]);
}());
