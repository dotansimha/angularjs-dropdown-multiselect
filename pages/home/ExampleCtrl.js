'use strict';

angular.module('exampleApp').controller('ExampleCtrl', ['$scope', function($scope) {
	$scope.example1model = [];
	$scope.example1data = [
		{id: 1, label: "David"},
		{id: 2, label: "Jhon"},
		{id: 3, label: "Danny"}];


	$scope.example2model = [];
	$scope.example2data = [
		{id: 1, label: "David"},
		{id: 2, label: "Jhon"},
		{id: 3, label: "Danny"}];
	$scope.example2settings = {displayProp: 'id'};


	$scope.example3model = [];
	$scope.example3data = [
		{id: 1, label: "David"},
		{id: 2, label: "Jhon"},
		{id: 3, label: "Danny"},
		{id: 4, label: "Danny"}];
	$scope.example3settings = {displayProp: 'label', idProp: 'label'};

	$scope.example4model = [];
	$scope.example4data = [
		{id: 1, label: "David"},
		{id: 2, label: "Jhon"},
		{id: 3, label: "Danny"}];
	$scope.example4settings = {displayProp: 'label', idProp: 'label', externalIdProp: 'myCustomPropertyForTheObject'};

	$scope.example5model = [];
	$scope.example5data = [
		{id: 1, label: "David"},
		{id: 2, label: "Jhon"},
		{id: 3, label: "Danny"}];
	$scope.example5settings = {defaultText: 'Select Users'};
}]);