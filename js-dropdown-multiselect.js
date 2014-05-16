'use strict';

angular.module('angularjs-dropdown-multiselect', []).directive('ngDropdownMultiselect', ['$filter', '$document', function ($filter, $document) {

	return {
		restrict: 'AE',
		scope:{
			selectedModel: '=',
			options: '=',
			extraSettings: '='
		},
		template: '<div class="multiselect-parent btn-group dropdown-multiselect" data-ng-class="{open: open}">'+
			'<button class="btn btn-small">Select</button>'+
			'<button class="btn btn-small dropdown-toggle" data-ng-click="open=!open; openDropdown()"><span class="caret"></span></button>'+
			'<ul class="dropdown-menu" aria-labelledby="dropdownMenu">' +
			'<li><a data-ng-click="selectAll()"><span class="glyphicon glyphicon-ok"></span>  Check All</a></li>' +
			'<li><a data-ng-click="deselectAll();"><span class="glyphicon glyphicon-remove"></span>  Uncheck All</a></li><li class="divider"></li>' +
			'<li data-ng-repeat="option in options"><a data-ng-click="setSelectedItem(getPropertyForObject(option,settings.idProp))"><span data-ng-class="isChecked(getPropertyForObject(option,settings.idProp))"></span>{{getPropertyForObject(option, settings.displayProp)}}</a></li>' +
			'</ul>' +
			'</div>' ,
		link: function($scope, $element){
			$document.on('click', function(e){
				var target = e.target.parentElement;
				var parentFound = false;

				while (angular.isDefined(target) && target != null && !parentFound)
				{
					if (_.contains(target.classList, 'multiselect-parent') && !parentFound)
					{
						parentFound = true;
					}
					target = target.parentElement;
				}

				if (!parentFound)
				{
					$scope.$apply(function()
					{
						$scope.open = false;
					});
				}
			});


			$scope.settings = {displayProp: 'label', idProp: 'id', externalIdProp: 'id'};
			angular.extend($scope.settings, $scope.extraSettings || []);

			$scope.openDropdown = function(){
				$scope.selectedItems = [];
			};

			$scope.getPropertyForObject = function(object, property)
			{
				if (object.hasOwnProperty(property)) {
					return object[property];
				}

				return '';
			};

			$scope.selectAll = function () {
				$scope.selectedModel = angular.copy($scope.options);
			};

			$scope.deselectAll = function() {
				$scope.selectedModel=[];
			};

			$scope.setSelectedItem = function(id){
				var findObj = {};
				findObj[$scope.settings.externalIdProp] = id;

				if (_.findIndex($scope.selectedModel, findObj) !== -1) {
					$scope.selectedModel.splice(_.findIndex($scope.selectedModel, findObj), 1);
				} else {
					$scope.selectedModel.push(findObj);
				}

				return false;
			};

			$scope.isChecked = function (id) {
				var findObj = {};
				findObj[$scope.settings.externalIdProp] = id;

				if (_.findIndex($scope.selectedModel, findObj) !== -1) {
					return 'glyphicon glyphicon-ok';
				}
				return '';
			};
		}
	};
}]);