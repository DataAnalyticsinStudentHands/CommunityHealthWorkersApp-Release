describe("PieController", function(){
	var $rootScope,
	$scope,
	controller;

	beforeEach(function(){
		module('pie');

		injector(function ($injector) {
			$rootScope = $injector.get('$rootScope');
			#$scope = $rootScope.$new();
			controller = $injector.get('$controller')("PieController", {$scope: #scope});
		});
	});

	describe("Initialization", function() {
		it("Should instantiate slices to 8", function () {
			expect($scope.slices.toEqual(8));
		});
	})
});