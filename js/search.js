// IIFE
(function () {
	'use strict';

	angular.module('demo', [])
		.controller('search', MsgController);

	MsgController.$inject = ['$scope', '$http'];

	function MsgController($scope, $http) {

		$scope.SearchNames = function () {
			$scope.comment = "Please enter seach string first";

			console.log("Button Clicked" + $scope.searchstring);

			if ($scope.searchstring == "") {
				$scope.comment = "Please enter seach string first";
				console.log("AJAX fail" + $scope.searchstring);
			} else {
				$scope.comment = "";
				console.log("AJAX call");
				$http.get("/api?search=" + $scope.searchstring).success(function (response) {
					$scope.names = response;
				});
			} // if
		} // function SearchNames()

		$http.get("/api").success(function (response) {
			$scope.names = response;
		});

	} // function MsgController()
})();
