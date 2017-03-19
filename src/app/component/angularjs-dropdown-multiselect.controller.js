/*
	eslint no-param-reassign: [
		"error",
		{
			"props": true,
			"ignorePropertyModificationsFor": [
				"$scope"
			]
		}
	]
*/

function contains(collection, target) {
	let containsTarget = false;
	collection.some((object) => {
		if (object === target) {
			containsTarget = true;
			return true;
		}
		return false;
	});
	return containsTarget;
}

function find(collection, properties) {
	let target;

	collection.some((object) => {
		let hasAllSameProperties = true;
		Object.keys(properties).forEach((key) => {
			if (object[key] !== properties[key]) {
				hasAllSameProperties = false;
			}
		});
		if (hasAllSameProperties) {
			target = object;
			return true;
		}
		return false;
	});

	return target;
}

function findIndex(collection, properties) {
	let index = -1;
	let counter = -1;

	collection.some((object) => {
		let hasAllSameProperties = true;
		counter += 1;
		Object.keys(properties).forEach((key) => {
			if (object[key] !== properties[key]) {
				hasAllSameProperties = false;
			}
		});
		if (hasAllSameProperties) {
			index = counter;
			return true;
		}
		return false;
	});

	return index;
}

export default function dropdownMultiselectController(
		$scope,
		$element,
		$filter,
		$document,
) {
	'ngInject';

	const $dropdownTrigger = $element.children()[0];
	const externalEvents = {
		onItemSelect: angular.noop,
		onItemDeselect: angular.noop,
		onSelectAll: angular.noop,
		onDeselectAll: angular.noop,
		onInitDone: angular.noop,
		onMaxSelectionReached: angular.noop,
		onSelectionChanged: angular.noop,
		onClose: angular.noop,
	};

	const settings = {
		dynamicTitle: true,
		scrollable: false,
		scrollableHeight: '300px',
		closeOnBlur: true,
		displayProp: 'label',
		idProp: 'id',
		externalIdProp: 'id',
		enableSearch: false,
		clearSearchOnClose: false,
		selectionLimit: 0,
		showCheckAll: true,
		showUncheckAll: true,
		showEnableSearchButton: false,
		closeOnSelect: false,
		buttonClasses: 'btn btn-default',
		closeOnDeselect: false,
		groupBy: undefined,
		checkBoxes: false,
		groupByTextProvider: null,
		smartButtonMaxItems: 0,
		smartButtonTextConverter: angular.noop,
		styleActive: false,
		selectedToTop: false,
		keyboardControls: false,
		template: '{{getPropertyForObject(option, settings.displayProp)}}',
		searchField: '$',
		showAllSelectedText: false,
	};

	const texts = {
		checkAll: 'Check All',
		uncheckAll: 'Uncheck All',
		selectionCount: 'checked',
		selectionOf: '/',
		searchPlaceholder: 'Search...',
		buttonDefaultText: 'Select',
		dynamicButtonTextSuffix: 'checked',
		disableSearch: 'Disable search',
		enableSearch: 'Enable search',
		selectGroup: 'Select all:',
		allSelectedText: 'All',
	};

	const input = {
		searchFilter: $scope.searchFilter || '',
	};

	angular.extend(settings, $scope.extraSettings || []);
	angular.extend(externalEvents, $scope.events || []);
	angular.extend(texts, $scope.translationTexts);

	if (settings.closeOnBlur) {
		$document.on('click', (e) => {
			if ($scope.open) {
				let target = e.target.parentElement;
				let parentFound = false;

				while (angular.isDefined(target) && target !== null && !parentFound) {
					if (!!target.className.split && contains(target.className.split(' '), 'multiselect-parent') && !parentFound) {
						if (target === $dropdownTrigger) {
							parentFound = true;
						}
					}
					target = target.parentElement;
				}

				if (!parentFound) {
					$scope.$apply(() => {
						$scope.close();
					});
				}
			}
		});
	}

	angular.extend($scope, {
		toggleDropdown,
		checkboxClick,
		externalEvents,
		settings,
		texts,
		input,
		close,
		selectCurrentGroup,
		getGroupLabel,
		getButtonText,
		getPropertyForObject,
		selectAll,
		deselectAll,
		setSelectedItem,
		isChecked,
		keyDownLink,
		keyDownSearchDefault,
		keyDownSearch,
		getFilter,
		toggleSearch,
		keyDownToggleSearch,
		orderFunction,
	});

	$scope.externalEvents.onInitDone();

	function focusFirstOption() {
		setTimeout(() => {
			const elementToFocus = angular.element($element)[0].querySelector('.option');
			if (angular.isDefined(elementToFocus) && elementToFocus != null) {
				elementToFocus.focus();
			}
		}, 0);
	}

	function toggleDropdown() {
		if ($scope.open) {
			$scope.close();
		} else { $scope.open = true; }
		if ($scope.settings.keyboardControls) {
			if ($scope.open) {
				if ($scope.settings.selectionLimit === 1 && $scope.settings.enableSearch) {
					setTimeout(() => {
						angular.element($element)[0].querySelector('.searchField').focus();
					}, 0);
				} else {
					focusFirstOption();
				}
			}
		}
		if ($scope.settings.enableSearch) {
			if ($scope.open) {
				setTimeout(() => {
					angular.element($element)[0].querySelector('.searchField').focus();
				}, 0);
			}
		}
	}

	function checkboxClick($event, id) {
		$scope.setSelectedItem(id, false, true);
		$event.stopImmediatePropagation();
	}

	function close() {
		$scope.open = false;
		$scope.input.searchFilter = $scope.settings.clearSearchOnClose ? '' : $scope.input.searchFilter;
		$scope.externalEvents.onClose();
	}

	function selectCurrentGroup(currentGroup) {
		$scope.selectedModel.splice(0, $scope.selectedModel.length);
		$scope.options.forEach((item) => {
			if (item[$scope.settings.groupBy] === currentGroup) {
				$scope.setSelectedItem($scope.getPropertyForObject(item, $scope.settings.idProp), false, false);
			}
		});
		$scope.externalEvents.onSelectionChanged();
	}

	function getFindObj(id) {
		const findObj = {};

		if ($scope.settings.externalIdProp === '') {
			findObj[$scope.settings.idProp] = id;
		} else {
			findObj[$scope.settings.externalIdProp] = id;
		}

		return findObj;
	}

	function getGroupLabel(groupValue) {
		if ($scope.settings.groupByTextProvider !== null) {
			return $scope.settings.groupByTextProvider(groupValue);
		}

		return groupValue;
	}

	function textWidth(text) {
		const $btn = $element.find('button');
		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');
		ctx.font = $btn.css('font-size') + $btn.css('font-family');
		// http://stackoverflow.com/questions/38823353/chrome-canvas-2d-context-measuretext-giving-me-weird-results
		ctx.originalFont = $btn.css('font-size') + $btn.css('font-family');
		ctx.fillStyle = '#000000';
		return ctx.measureText(text).width;
	}

	function getButtonText() {
		if ($scope.settings.dynamicTitle && $scope.selectedModel &&
			($scope.selectedModel.length > 0 || (angular.isObject($scope.selectedModel) &&
			Object.keys($scope.selectedModel).length > 0))) {
			if ($scope.settings.smartButtonMaxItems > 0) {
				const paddingWidth = 12 * 2;
				const borderWidth = 1 * 2;
				const dropdownIconWidth = 8;
				const widthLimit = $element[0].offsetWidth - paddingWidth - borderWidth - dropdownIconWidth;

				let itemsText = [];

				angular.forEach($scope.options, (optionItem) => {
					if ($scope.isChecked($scope.getPropertyForObject(optionItem, $scope.settings.idProp))) {
						const displayText = $scope.getPropertyForObject(optionItem, $scope.settings.displayProp);
						const converterResponse = $scope.settings.smartButtonTextConverter(displayText, optionItem);

						itemsText.push(converterResponse || displayText);
					}
				});

				if ($scope.selectedModel.length > $scope.settings.smartButtonMaxItems) {
					itemsText = itemsText.slice(0, $scope.settings.smartButtonMaxItems);
					itemsText.push('...');
				}

				let result = itemsText.join(', ');
				let index = result.length - 4;
				if ($element[0].offsetWidth === 0) {
					return result;
				}
				while (textWidth(result) > widthLimit) {
					if (itemsText[itemsText.length - 1] !== '...') {
						itemsText.push('...');
						result = `${result}...`;
					}
					result = result.slice(0, index) + result.slice(index + 1);
					index -= 1;
				}

				return result;
			}
			const totalSelected = angular.isDefined($scope.selectedModel) ? $scope.selectedModel.length : 0;

			if (totalSelected === 0) {
				return $scope.texts.buttonDefaultText;
			}

			if ($scope.settings.showAllSelectedText && totalSelected === $scope.options.length) {
				return $scope.texts.allSelectedText;
			}

			return `${totalSelected} ${$scope.texts.dynamicButtonTextSuffix}`;
		}
		return $scope.texts.buttonDefaultText;
	}

	function getPropertyForObject(object, property) {
		if (angular.isDefined(object) && Object.prototype.hasOwnProperty.call(object, property)) {
			return object[property];
		}

		return undefined;
	}

	function selectAll() {
		$scope.deselectAll(true);
		$scope.externalEvents.onSelectAll();

		const searchResult = $filter('filter')($scope.options, $scope.getFilter($scope.input.searchFilter));
		angular.forEach(searchResult, (value) => {
			$scope.setSelectedItem(value[$scope.settings.idProp], true, false);
		});
		$scope.externalEvents.onSelectionChanged();
		$scope.selectedGroup = null;
	}

	function deselectAll(dontSendEvent = false) {
		if (!dontSendEvent) {
			$scope.externalEvents.onDeselectAll();
		}

		$scope.selectedModel.splice(0, $scope.selectedModel.length);
		if (!dontSendEvent) {
			$scope.externalEvents.onSelectionChanged();
		}
		$scope.selectedGroup = null;
	}

	function setSelectedItem(id, dontRemove = false, fireSelectionChange) {
		const findObj = getFindObj(id);
		let finalObj = null;

		if ($scope.settings.externalIdProp === '') {
			finalObj = find($scope.options, findObj);
		} else {
			finalObj = findObj;
		}

		const exists = findIndex($scope.selectedModel, findObj) !== -1;

		if (!dontRemove && exists) {
			$scope.selectedModel.splice(findIndex($scope.selectedModel, findObj), 1);
			$scope.externalEvents.onItemDeselect(findObj);
			if ($scope.settings.closeOnDeselect) {
				$scope.close();
			}
		} else if (!exists && ($scope.settings.selectionLimit === 0 || $scope.selectedModel.length < $scope.settings.selectionLimit)) {
			$scope.selectedModel.push(finalObj);
			if (fireSelectionChange) {
				$scope.externalEvents.onItemSelect(finalObj);
			}
			if ($scope.settings.closeOnSelect) {
				$scope.close();
			}
			if ($scope.settings.selectionLimit > 0 && $scope.selectedModel.length === $scope.settings.selectionLimit) {
				$scope.externalEvents.onMaxSelectionReached();
			}
		} else if ($scope.settings.selectionLimit === 1 && !exists && $scope.selectedModel.length === $scope.settings.selectionLimit) {
			$scope.selectedModel.splice(0, 1);
			$scope.selectedModel.push(finalObj);
			if (fireSelectionChange) {
				$scope.externalEvents.onItemSelect(finalObj);
			}
			if ($scope.settings.closeOnSelect) {
				$scope.close();
			}
		}
		if (fireSelectionChange) {
			$scope.externalEvents.onSelectionChanged();
		}
		$scope.selectedGroup = null;
	}

	function isChecked(id) {
		return findIndex($scope.selectedModel, getFindObj(id)) !== -1;
	}

	function keyDownLink(event) {
		const sourceScope = angular.element(event.target).scope();
		let nextOption;
		let parent = event.target.parentNode;
		if (!$scope.settings.keyboardControls) {
			return;
		}
		if (event.keyCode === 13 || event.keyCode === 32) { // enter
			event.preventDefault();
			if (sourceScope.option) {
				$scope.setSelectedItem($scope.getPropertyForObject(sourceScope.option, $scope.settings.idProp), false, true);
			} else if (event.target.id === 'deselectAll') {
				$scope.deselectAll();
			} else if (event.target.id === 'selectAll') {
				$scope.selectAll();
			}
		} else if (event.keyCode === 38) { // up arrow
			event.preventDefault();
			if (parent.previousElementSibling) {
				nextOption = parent.previousElementSibling.querySelector('a') || parent.previousElementSibling.querySelector('input');
			}
			while (!nextOption && !!parent) {
				parent = parent.previousElementSibling;
				if (parent) {
					nextOption = parent.querySelector('a') || parent.querySelector('input');
				}
			}
			if (nextOption) {
				nextOption.focus();
			}
		} else if (event.keyCode === 40) { // down arrow
			event.preventDefault();
			if (parent.nextElementSibling) {
				nextOption = parent.nextElementSibling.querySelector('a') || parent.nextElementSibling.querySelector('input');
			}
			while (!nextOption && !!parent) {
				parent = parent.nextElementSibling;
				if (parent) {
					nextOption = parent.querySelector('a') || parent.querySelector('input');
				}
			}
			if (nextOption) {
				nextOption.focus();
			}
		} else if (event.keyCode === 27) {
			event.preventDefault();

			$scope.toggleDropdown();
		}
	}

	function keyDownSearchDefault(event) {
		let parent = event.target.parentNode.parentNode;
		let nextOption;
		if (!$scope.settings.keyboardControls) {
			return;
		}
		if (event.keyCode === 9 || event.keyCode === 40) { // tab
			event.preventDefault();
			focusFirstOption();
		} else if (event.keyCode === 38) {
			event.preventDefault();
			if (parent.previousElementSibling) {
				nextOption = parent.previousElementSibling.querySelector('a') || parent.previousElementSibling.querySelector('input');
			}
			while (!nextOption && !!parent) {
				parent = parent.previousElementSibling;
				if (parent) {
					nextOption = parent.querySelector('a') || parent.querySelector('input');
				}
			}
			if (nextOption) {
				nextOption.focus();
			}
		} else if (event.keyCode === 27) {
			event.preventDefault();

			$scope.toggleDropdown();
		}
	}

	function keyDownSearch(event, searchFilter) {
		let searchResult;
		if (!$scope.settings.keyboardControls) {
			return;
		}
		if (event.keyCode === 13) {
			if ($scope.settings.selectionLimit === 1 && $scope.settings.enableSearch) {
				searchResult = $filter('filter')($scope.options, $scope.getFilter(searchFilter));
				if (searchResult.length === 1) {
					$scope.setSelectedItem($scope.getPropertyForObject(searchResult[0], $scope.settings.idProp), false, true);
				}
			} else if ($scope.settings.enableSearch) {
				$scope.selectAll();
			}
		}
	}

	function getFilter(searchFilter) {
		const filter = {};
		filter[$scope.settings.searchField] = searchFilter;
		return filter;
	}

	function toggleSearch($event) {
		if ($event) {
			$event.stopPropagation();
		}
		$scope.settings.enableSearch = !$scope.settings.enableSearch;
		if (!$scope.settings.enableSearch) {
			$scope.input.searchFilter = '';
		}
	}

	function keyDownToggleSearch() {
		if (!$scope.settings.keyboardControls) {
			return;
		}
		if (event.keyCode === 13) {
			$scope.toggleSearch();
			if ($scope.settings.enableSearch) {
				setTimeout(
					() => {
						angular.element($element)[0].querySelector('.searchField').focus();
					}, 0,
				);
			} else {
				focusFirstOption();
			}
		}
	}

	function orderFunction(object1, object2) {
		if (angular.isUndefined(object2)) {
			return 1;
		}
		if (angular.isUndefined(object1)) {
			return -1;
		}
		if (object1.type !== 'object' || object2.type !== 'object') {
			return (object1.index < object2.index) ? -1 : 1;
		}
		const v1 = object1.value;
		const v2 = object2.value;
		// first order by group
		if ($scope.settings.groupBy) {
			if (v1[$scope.settings.groupBy] !== v2[$scope.settings.groupBy]) {
				if (v1[$scope.settings.groupBy] < v2[$scope.settings.groupBy]) {
					return 1;
				}
				return -1;
			}
		}
		if (!$scope.settings.selectedToTop) {
			return $scope.options.indexOf(v1) < $scope.options.indexOf(v2) ? 1 : -1;
		}
		// then order selected to top
		if (!$scope.isChecked($scope.getPropertyForObject(v1, $scope.settings.idProp)) &&
			!$scope.isChecked($scope.getPropertyForObject(v2, $scope.settings.idProp))) {
			return $scope.options.indexOf(v1) < $scope.options.indexOf(v2) ? 1 : -1;
		}
		if ($scope.isChecked($scope.getPropertyForObject(v1, $scope.settings.idProp))) {
			return 1;
		}
		return -1;
	}
}
