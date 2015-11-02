
(function() {
	'use strict';

	describe('App: demoApp', function() {
		beforeEach(module('demoApp'))

		it('is version 0.0.1', inject(function(version){
			expect(version).toBe('0.0.1');
		}));

		it('exists', function() {
			expect(true).toBe(true);
		});

		describe('Backlog', function() {

		})

	});

}());


(function() {
	'use strict';

	describe('App: demoApp', function() {
		beforeEach(module('demoApp'))

		it('is version 0.0.1', inject(function(version){
			expect(version).toBe('0.0.1');
		}));

		it('exists', function() {
			expect(true).toBe(true);
		});



	});

}());

//--- CODE --------------------------
(function (angular) {
    // Create module
    var myApp = angular.module('myApp', []);

    // Controller which counts changes to its "name" member
    myApp.controller('MyCtrl', ['$scope', function ($scope) {
        $scope.name = 'Superhero';
        $scope.counter = 0;
        $scope.$watch('name', function (newValue, oldValue) {
            $scope.counter = $scope.counter + 1;
        });
    }]);

    myApp.controller('postController', ['$scope', function ($scope) {
        $scope.name = 'Superhero';
        $scope.counter = 0;
        $scope.$watch('name', function (newValue, oldValue) {
            $scope.counter = $scope.counter + 1;
        });
    }]);

    myApp.controller('loginCtrl', ['$scope', function ($scope) {
        $scope.name = 'Superhero';
        $scope.counter = 0;
        $scope.$watch('name', function (newValue, oldValue) {
            $scope.counter = $scope.counter + 1;
        });
    }]);

    myApp.controller('registerCtrl', ['$scope', function ($scope) {
        $scope.name = 'Superhero';
        $scope.counter = 0;
        $scope.$watch('name', function (newValue, oldValue) {
            $scope.counter = $scope.counter + 1;
        });
    }]);

    myApp.controller('loginCtrl', ['$scope', function ($scope) {
        $scope.name = 'Superhero';
        $scope.counter = 0;
        $scope.$watch('name', function (newValue, oldValue) {
            $scope.counter = $scope.counter + 1;
        });
    }]);

    myApp.controller('groupController', ['$scope', function ($scope) {
        $scope.name = 'Superhero';
        $scope.counter = 0;
        $scope.$watch('name', function (newValue, oldValue) {
            $scope.counter = $scope.counter + 1;
        });
    }]);

    myApp.controller('taskController', ['$scope', function ($scope) {
        $scope.name = 'Superhero';
        $scope.counter = 0;
        $scope.$watch('name', function (newValue, oldValue) {
            $scope.counter = $scope.counter + 1;
        });
    }]);

    myApp.controller('messageCtrl', ['$scope', function ($scope) {
        $scope.name = 'Superhero';
        $scope.counter = 0;
        $scope.$watch('name', function (newValue, oldValue) {
            $scope.counter = $scope.counter + 1;
        });
    }]);

    myApp.controller('hoursController', ['$scope', function ($scope) {
        $scope.name = 'Superhero';
        $scope.counter = 0;
        $scope.$watch('name', function (newValue, oldValue) {
            $scope.counter = $scope.counter + 1;
        });
    }]);
    // Controller with dependencies on Angular's $http service and promises
    myApp.controller('CtrlHttp', function ($http, $scope, $q) {
        // Returns a promise which is resolved if http calls succeeds,
        // otherwise the promise is rejected
        $scope.getHttp = function () {

            var defer = $q.defer();

            // Perform the actual HTTP call with query parameters
            // e.g. GET <server url>/someUrl?key=value1
            $http({
                method: 'GET',
                url: '/someUrl',
                headers: {
                    'Accept-Language': 'en'
                },
                params: {
                    key1: "value1"
                }
            }).
            success(function (data, status, headers, config) {
                // this callback will be called asynchronously
                // when the response is available
                defer.resolve(data);
            }).
            error(function (data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                defer.reject();
            });

            return defer.promise;
        };
    });
})(angular);



// ---SPECS-------------------------

describe('myApp', function () {
    var scope,
    controller;
    beforeEach(function () {
        module('myApp');
    });


    describe('MyCtrl', function () {
        beforeEach(inject(function ($rootScope, $controller) {
            scope = $rootScope.$new();
            controller = $controller('MyCtrl', {
                '$scope': scope
            });
        }));
        it('sets the name', function () {
            expect(scope.name).toBe('Superhero');
        });

        it('watches the name and updates the counter', function () {
            expect(scope.counter).toBe(0);
            scope.name = 'Batman';
            scope.$digest();
            expect(scope.counter).toBe(1);
        });
    });

    describe('loginCtrl', function () {
        beforeEach(inject(function ($rootScope, $controller) {
            scope = $rootScope.$new();
            controller = $controller('MyCtrl', {
                '$scope': scope
            });
        }));
        it('checks if username is not undefined', function () {
            expect(scope.name).toBe('Superhero');
            expect(scope.name).not.toBe(null);
        });

        it('watches the name and updates the counter', function () {
            expect(scope.counter).toBe(0);
            scope.name = 'Batman';
            scope.$digest();
            expect(scope.counter).toBe(1);
        });
    });

    describe('postController', function () {
        beforeEach(inject(function ($rootScope, $controller) {
            scope = $rootScope.$new();
            controller = $controller('postController', {
                '$scope': scope
            });
        }));

        it('watches the name and updates the counter', function () {
            expect(scope.counter).toBe(0);
            scope.name = 'Batman';
            scope.$digest();
            expect(scope.counter).toBe(1);
        });
    });

    describe('groupController', function () {
        beforeEach(inject(function ($rootScope, $controller) {
            scope = $rootScope.$new();
            controller = $controller('groupController', {
                '$scope': scope
            });
        }));


        it('watches the name and updates the counter', function () {
            expect(scope.counter).toBe(0);
            scope.name = 'Batman';
            scope.$digest();
            expect(scope.counter).toBe(1);
        });
    });

    describe('taskController', function () {
        beforeEach(inject(function ($rootScope, $controller) {
            scope = $rootScope.$new();
            controller = $controller('taskController', {
                '$scope': scope
            });
        }));

        it('watches the name and updates the counter', function () {
            expect(scope.counter).toBe(0);
            scope.name = 'Batman';
            scope.$digest();
            expect(scope.counter).toBe(1);
        });
    });

    describe('messageCtrl', function () {
        beforeEach(inject(function ($rootScope, $controller) {
            scope = $rootScope.$new();
            controller = $controller('messageCtrl', {
                '$scope': scope
            });
        }));

        it('watches the name and updates the counter', function () {
            expect(scope.counter).toBe(0);
            scope.name = 'Batman';
            scope.$digest();
            expect(scope.counter).toBe(1);
        });
    });

    describe('hoursController', function () {
        beforeEach(inject(function ($rootScope, $controller) {
            scope = $rootScope.$new();
            controller = $controller('hoursController', {
                '$scope': scope
            });
        }));

        it('watches the name and updates the counter', function () {
            expect(scope.counter).toBe(0);
            scope.name = 'Batman';
            scope.$digest();
            expect(scope.counter).toBe(1);
        });
    });

    describe('registerCtrl', function () {
        beforeEach(inject(function ($rootScope, $controller) {
            scope = $rootScope.$new();
            controller = $controller('registerCtrl', {
                '$scope': scope
            });
        }));

        it('watches the name and updates the counter', function () {
            expect(scope.counter).toBe(0);
            scope.name = 'Batman';
            scope.$digest();
            expect(scope.counter).toBe(1);
        });
    });


    describe('CtrlHttp', function () {

        var $httpBackend,
            expectedUrl = '/someUrl?key1=value1',
            promise,
            successCallback,
            errorCallback,
            httpController;

        beforeEach(inject(function ($rootScope, $controller, _$httpBackend_) {
            $httpBackend = _$httpBackend_;
            scope = $rootScope.$new();
            successCallback = jasmine.createSpy();
            errorCallback = jasmine.createSpy();
            httpController = $controller('CtrlHttp', {
                '$scope': scope
            });
        }));

        afterEach(function() {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        it('returns http requests successfully and resolves the promise', function () {
            var data = '{"translationKey":"translationValue"}';
            expect(httpController).toBeDefined();
            $httpBackend.expectGET(expectedUrl).respond(200, data);
            promise = scope.getHttp();
            promise.then(successCallback, errorCallback);

            $httpBackend.flush();

            expect(successCallback).toHaveBeenCalledWith(angular.fromJson(data));
            expect(errorCallback).not.toHaveBeenCalled();
        });

        it('returns http requests with an error and rejects the promise', function () {
            $httpBackend.expectGET(expectedUrl).respond(500, 'Oh no!!');
            promise = scope.getHttp();
            promise.then(successCallback, errorCallback);

            $httpBackend.flush();

            expect(successCallback).not.toHaveBeenCalled();
            expect(errorCallback).toHaveBeenCalled();
        });
    });
    
});

// --- Runner -------------------------
(function () {
    var jasmineEnv = jasmine.getEnv();
    jasmineEnv.updateInterval = 1000;

    var htmlReporter = new jasmine.HtmlReporter();

    jasmineEnv.addReporter(htmlReporter);

    jasmineEnv.specFilter = function (spec) {
        return htmlReporter.specFilter(spec);
    };

    var currentWindowOnload = window.onload;

    window.onload = function () {
        if (currentWindowOnload) {
            currentWindowOnload();
        }
        execJasmine();
    };

    function execJasmine() {
        jasmineEnv.execute();
    }

})();
/*
(function() {
	'use strict';
	describe('App: CommunityHealthWorkers', function() {
		it('exists', inject(function($controller) {
			var ctrl = $controller('registerCtrl', function() {

			});
			expect(ctrl).toBeDefined();
			expect(ctrl).not.toBeNull();
			expect(typeof ctrl === 'function').toBe('object');
		}));
	});
}());
*/