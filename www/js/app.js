'use strict';

/* VMA App Module */
angular.module('volunteerManagementApp', [
    'ionic',
    'vmaControllerModule',
    'databaseServicesModule',
    'vmaServicesModule',
    'vmaDirectiveModule',
    'vmaFilterModule',
    'ngCsvImport',
    'restangular',
    'ngNotify',
    'highcharts-ng',
    'adaptive.googlemaps',
    'ui.bootstrap.datetimepicker',
    'checklist-model',
    "isteven-multi-select",
    "angular-google-analytics"
]).

    config(function ($stateProvider, $urlRouterProvider, $compileProvider, RestangularProvider, $ionicConfigProvider, AnalyticsProvider) {
        AnalyticsProvider.setAccount({tracker: 'UA-73608330-1', trackEvent: true});
        AnalyticsProvider.trackPages(true);
        AnalyticsProvider.trackUrlParams(true);
        AnalyticsProvider.setPageEvent('$stateChangeSuccess');
        AnalyticsProvider.setHybridMobileSupport(true);

        $ionicConfigProvider.views.transition('none');
        $ionicConfigProvider.backButton.previousTitleText(false);
        $urlRouterProvider.otherwise("/homePage");
        if (!ionic.Platform.isIOS())$ionicConfigProvider.scrolling.jsScrolling(false);
        $stateProvider.
            state('home', {
                views: {
                    "menuBar@home": {templateUrl: "partials/menuBar.html", controller: "menuCtrl"},
                    "app": {templateUrl: "partials/home.html"},
                    "header@": {templateUrl: "partials/header.html"}
                },
                authenticate: true
            }).
            state('login', {
                url: "/login",
                views: {
                    "app": {templateUrl: "partials/login.html", controller: 'loginCtrl'}
                },
                authenticate: false
            }).
            state('register', {
                url: "/register",
                views: {
                    "app": {templateUrl: "partials/register.html", controller: 'registerCtrl'}
                },
                authenticate: false
            }).
            state('home.availableClasses', {
                url: "/avClasses",
                views: {
                    "app": {templateUrl: "partials/availableClasses.html", controller: 'taskController'}
                },
                authenticate: true
            }).
            state('home.myGroups', {
                cache: false,
                url: "/myGroups",
                views: {
                    "app": {templateUrl: "partials/myGroups.html", controller: 'groupController'}
                },
                authenticate: true
            }).
            state('home.group', {
                url: "/group/:id",
                views: {
                    "app": {templateUrl: "partials/efforts.group.html", controller: 'groupController'}
                },
                resolve: {
                    group: function (vmaGroupService, $stateParams) {
                        return vmaGroupService.getGroupMeta($stateParams.id).then(function (success) {
                            $stateParams.group = success;
                        });
                    }
                },
                authenticate: true
            }).
            state('home.group.tasks', {
                url: "/tasks",
                views: {
                    "app@home": {templateUrl: "partials/groupFeed.task.html", controller: 'taskController'}
                },
                authenticate: true
            }).
            state('home.task', {
                url: "/taskview/:task",
                views: {
                    "app": {templateUrl: "partials/viewTask.html", controller: 'task'}
                },
                resolve: {
                    task: function (vmaTaskService, $stateParams) {
                        return vmaTaskService.updateTasks().then(function () {
                            return vmaTaskService.getTaskView($stateParams.task).then(function (success) {
                                return success;
                            });
                        });
                    }
                },
                authenticate: true
            }).
            state('home.myTasks', {
                url: "/myTasks",
                views: {
                    "app": {templateUrl: "partials/myTasks.html", controller: 'taskController'}
                },
                authenticate: true
            }).
            state('home.settings', {
                url: "/settings",
                views: {
                    "app": {templateUrl: "partials/settings.html", controller: "settings"}
                },
                authenticate: true
            }).
            state('home.calendar', {
                url: "/calendar",
                views: {
                    "app": {templateUrl: "partials/calendar.html", controller: "calendar"}
                },
                authenticate: true
            }).
            state('home.intro', {
                url: "/intro",
                views: {
                    "app": {templateUrl: "partials/intro.html", controller: "intro"}
                },
                authenticate: true
            }).
            state('home.hours', {
                cache: false,
                url: "/hours",
                views: {
                    "app": {templateUrl: "partials/hours.myHours.html", controller: "hoursController"}
                },
                authenticate: true
            }).
            state('home.myHours', {
                url: "/myCertificates",
                views: {
                    "app": { templateUrl: "partials/myCertificates.html", controller: "hoursController"}
                },
                authenticate: true
            }).
            state('home.homePage', {
                url: "/homePage",
                views: {
                    "app": {templateUrl: "partials/homePage.html", controller: "homeCtrl"}
                },
                resolve: {
                    groups: function (vmaGroupService) {
                        vmaGroupService.updateGroups(true);
                    }
                },
                authenticate: true
            });
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|geo|maps):/);
        $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
    }).

    constant('$ionicLoadingConfig', {
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    }).

    run(['Restangular', '$rootScope', 'Auth', '$q', '$state', 'vmaUserService', 'ngNotify', 'Analytics', function (Restangular, $rootScope, Auth, $q, $state, vmaUserService, ngNotify, Analytics) {
        Restangular.setBaseUrl("https://www.housuggest.org:8443/CombinedBackend/");     //HOU5SUGGEST FOR VMA CORE
        Restangular.setDefaultHeaders({"X-TenantId": "tenantCHW"});
        $rootScope.serverRoot = "http://housuggest.org//";
        //Restangular.setBaseUrl("https://www.housuggest.org:8443/CHWApp/");     //HOUSUGGEST FOR VMA CORE
        //$rootScope.serverRoot = "http://www.housuggest.org/";

        //TO ACCESS RESTANGULAR IN CONTROLLERS WITHOUT INJECTION
        $rootScope.Restangular = function () {
            return Restangular;
        };

        //CHECKING IF AUTHENTICATED ON STATE CHANGE - Called in $stateChangeStart
        $rootScope.isAuthenticated = function (authenticate) {
            if (!Auth.hasCredentials()) {
                $rootScope.isGuest = true;
                Auth.setCredentials("Guest", "21d7dcf66c3e4ad8daf654c8732791453a79408d312396dc25ec90453597f5bdf7dca5ac87b8c22c140d6b4dd17753bd2640b517d486d34d9e52d1a444560a93");
                Auth.confirmCredentials();
            }
            vmaUserService.getMyUser().then(function (result) {
                result = Restangular.stripRestangular(result)[0];
                //USERNAME & ID TO BE USED IN CONTROLLERS
                $rootScope.uid = result.id.toString();
                $rootScope.uin = result.username.toString();
                $rootScope.isGuest = (result.username.toString() == "Guest");
            });
            vmaUserService.getMyRole().then(function (success) {
                $rootScope.role = success;
                $rootScope.isMod = (success == "ROLE_MODERATOR");
                $rootScope.isAdm = (success == "ROLE_ADMIN");
            }, function (error) {
                if (error.status === 0) { // NO NETWORK CONNECTION OR SERVER DOWN, WE WILL NOT LOG THEM OUT
                    ngNotify.set("Internet or Server Unavailable", {type: "error", sticky: true});
                } else { //Most Likely a 403 - LOG THEM OUT
                    Auth.clearCredentials();
                    if (authenticate) {
                        $state.go("login");
                        location.reload();
                    }
                }
            });
            return Auth.hasCredentials();
        };


        $rootScope.goToLink = function (url) {
            window.open(url, "_system");
        };

        //AUTHENTICATE ON CHANGE STATE
        $rootScope.$on("$stateChangeStart", function (event, toState) {
            $('body').removeClass('loaded');
            //if (toState.authenticate==undefined){toState.authenticate=true};
            if (toState.authenticate && !$rootScope.isAuthenticated(toState.authenticate)) {
                // User isn’t authenticated
                $state.go("login");
                //Prevents the switching of the state
                event.preventDefault();
            }
            if(!$rootScope.badgeConfig) {
                $rootScope.badgeConfigPromise = Restangular.all("classes").one("coresmap").get().then(function (s) {
                    $rootScope.badgeConfig = s;
                });
            }
        });
        $rootScope.$on("$stateChangeSuccess", function () {
            $('body').addClass('loaded');
        });
        $rootScope.$on("$stateChangeError", function () {
            $('body').addClass('loaded');
        });
}]);
