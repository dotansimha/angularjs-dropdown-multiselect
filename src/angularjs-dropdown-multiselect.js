'use strict';

var directiveModule = angular.module('angularjs-dropdown-multiselect', []);

directiveModule.directive('ngDropdownMultiselect', ['$filter', '$document', '$compile', '$parse', function ($filter, $document, $compile, $parse) {

	return {
		restrict: 'AE',
		scope:{
			selectedModel: '=',
			options: '=',
			extraSettings: '=',
			events: '=',
			groupBy: '@'
		},
		template: function(element, attrs) {
			var checkboxes = attrs.checkboxes ? true : false;
			var groups = attrs.groupBy ? true : false;

			var template = '<div class="multiselect-parent btn-group dropdown-multiselect">';
			template +='<button type="button" class="btn btn-default dropdown-toggle" ng-click="toggleDropdown()">{{getButtonText()}}<span class="caret"></span></button>';
			template += '<ul class="dropdown-menu dropdown-menu-form" ng-style="{display: open ? \'block\' : \'none\'}">';
			template += '<li ng-hide="settings.selectionLimit > 0"><a data-ng-click="selectAll()"><span class="glyphicon glyphicon-ok"></span>  Check All</a>';
			template += '<li><a data-ng-click="deselectAll();"><span class="glyphicon glyphicon-remove"></span>  Uncheck All</a></li>';
			template += '<li class="divider"></li>';
			template += '<li ng-show="settings.enableSearch"><input type="text" class="form-control" ng-model="searchFilter" placeholder="Search..." /></li>';
			template += '<li ng-show="settings.enableSearch" class="divider"></li>';

			if (groups)
			{
				template += '<li ng-repeat-start="option in orderedItems | filter: searchFilter" ng-show="getPropertyForObject(option, settings.groupBy) !== getPropertyForObject(orderedItems[$index - 1], settings.groupBy)" role="presentation" class="dropdown-header">{{ getGroupTitle(getPropertyForObject(option, settings.groupBy)) }}</li>';
				template += '<li ng-repeat-end role="presentation">';
			}
			else
			{
				template += '<li role="presentation" ng-repeat="option in options | filter: searchFilter">';
			}

			template += '<a role="menuitem" tabindex="-1" ng-click="setSelectedItem(getPropertyForObject(option,settings.idProp))">';

			if(checkboxes) {
				template += '<div class="checkbox"><label><input class="checkboxInput" type="checkbox" ng-click="checkboxClick($event, getPropertyForObject(option,settings.idProp))" ng-checked="isChecked(getPropertyForObject(option,settings.idProp))" /> {{getPropertyForObject(option, settings.displayProp)}}</label></div></a>';
			}
			else {
				template += '<span data-ng-class="{\'glyphicon glyphicon-ok\': isChecked(getPropertyForObject(option,settings.idProp))}"></span> {{getPropertyForObject(option, settings.displayProp)}}</a>';
			}

			template += '</li>';

			template += '<li class="divider" ng-show="settings.selectionLimit > 1"></li>';
			template += '<li role="presentation" ng-show="settings.selectionLimit > 1"><a role="menuitem">{{selectedModel.length}} / {{settings.selectionLimit}} selected</a></li>';

			template += '</ul>';
			template += '</div>';

			element.html(template);
		},
		link: function($scope, $element, $attrs){
			$scope.toggleDropdown = function()
			{
				$scope.open = !$scope.open;
			};

			$scope.checkboxClick = function($event, id)
			{
				$scope.setSelectedItem(id);
				$event.stopImmediatePropagation();
			};

			$scope.searchFilter = '';

			$scope.externalEvents = {
				onItemSelect: angular.noop,
				onItemDeselect: angular.noop,
				onSelectAll: angular.noop,
				onDeselectAll: angular.noop,
				onInitDone: angular.noop,
				onMaxSelectionReached: angular.noop
			};

			$scope.settings = {
				dynamicTitle: true,
				defaultText: 'Select',
				closeOnBlur: true,
				displayProp: 'label',
				idProp: 'id',
				externalIdProp: 'id',
				enableSearch: false,
				selectionLimit: 0,
				closeOnSelect: false,
				closeOnDeselect: false,
				groupBy: $attrs.groupBy || undefined,
				groupByTextProvider: null};


			if (angular.isDefined($scope.settings.groupBy))
			{
				$scope.$watch('options', function(newValue) {
					if (angular.isDefined(newValue))
					{
						$scope.orderedItems = $filter('orderBy')(newValue, $scope.settings.groupBy);
					}
				});
			}

			angular.extend($scope.settings, $scope.extraSettings || []);
			angular.extend($scope.externalEvents, $scope.events || []);

			$scope.singleSelection = $scope.settings.selectionLimit === 1;

			if ($scope.singleSelection)
			{
				if (angular.isArray($scope.selectedModel) && $scope.selectedModel.length === 0)
				{
					$scope.selectedModel = null;
				}
			}

			function getFindObj(id)
			{
				var findObj = {};

				if ($scope.settings.externalIdProp === '')
				{
					findObj[$scope.settings.idProp] = id;
				}
				else {
					findObj[$scope.settings.externalIdProp] = id;
				}

				return findObj;
			}

			if ($scope.settings.closeOnBlur) {
				$document.on('click', function (e) {
					var target = e.target.parentElement;
					var parentFound = false;

					while (angular.isDefined(target) && target !== null && !parentFound) {
						if (_.contains(target.classList, 'multiselect-parent') && !parentFound) {
							parentFound = true;
						}
						target = target.parentElement;
					}

					if (!parentFound) {
						$scope.$apply(function () {
							$scope.open = false;
						});
					}
				});
			}

			$scope.getGroupTitle = function(groupValue)
			{
				if ($scope.settings.groupByTextProvider !== null)
				{
					return $scope.settings.groupByTextProvider(groupValue);
				}

				return groupValue;
			};

			$scope.getButtonText = function()
			{
				if ($scope.settings.dynamicTitle)
				{
					var totalSelected;

					if ($scope.singleSelection)
					{
						totalSelected = $scope.selectedModel !== null ? 1 : 0;
					}
					else
					{
						totalSelected = angular.isDefined($scope.selectedModel) ? $scope.selectedModel.length : 0;
					}

					if (totalSelected === 0)
					{
						return $scope.settings.defaultText;
					}
					else
					{
						return totalSelected + ' selected';
					}
				}
				else
				{
					return $scope.settings.defaultText;
				}
			};

			$scope.getPropertyForObject = function(object, property)
			{
				if (angular.isDefined(object) && object.hasOwnProperty(property)) {
					return object[property];
				}

				return '';
			};

			$scope.selectAll = function () {
				$scope.deselectAll(false);
				$scope.externalEvents.onSelectAll();

				angular.forEach($scope.options, function(value)
				{
					$scope.setSelectedItem(value[$scope.settings.idProp], true);
				});
			};

			$scope.deselectAll = function(sendEvent) {
				sendEvent = sendEvent || true;

				if (sendEvent) {
					$scope.externalEvents.onDeselectAll();
				}

				if ($scope.singleSelection) {
					$scope.selectedModel = null;
				}
				else {
					$scope.selectedModel = [];
				}

			};

			$scope.setSelectedItem = function(id, dontRemove){
				var findObj = getFindObj(id);
				var finalObj = null;

				if ($scope.settings.externalIdProp === '') {
					finalObj = _.find($scope.options, findObj);
				}
				else {
					finalObj = findObj;
				}

				if ($scope.singleSelection)
				{
					$scope.selectedModel = finalObj;
					$scope.externalEvents.onItemSelect(finalObj);

					return;
				}

				dontRemove = dontRemove || false;

				var exists = _.findIndex($scope.selectedModel, findObj) !== -1;

				if (!dontRemove && exists) {
					$scope.selectedModel.splice(_.findIndex($scope.selectedModel, findObj), 1);
					$scope.externalEvents.onItemDeselect(findObj);
				} else if (!exists && ($scope.settings.selectionLimit === 0 || $scope.selectedModel.length < $scope.settings.selectionLimit)) {
					$scope.selectedModel.push(finalObj);
					$scope.externalEvents.onItemSelect(finalObj);
				}
			};

			$scope.isChecked = function (id) {
				if ($scope.singleSelection)
				{
					return $scope.selectedModel !== null && $scope.selectedModel[$scope.settings.idProp] === getFindObj(id)[$scope.settings.idProp];
				}

				return _.findIndex($scope.selectedModel, getFindObj(id)) !== -1;
			};

			$scope.externalEvents.onInitDone();
		}
	};
}]);