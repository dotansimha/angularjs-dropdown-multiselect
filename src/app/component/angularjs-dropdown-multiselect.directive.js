import controller from './angularjs-dropdown-multiselect.controller';

export default function dropdownMultiselectDirective() {
	return {
		restrict: 'AE',
		scope: {
			selectedModel: '=',
			options: '=',
			extraSettings: '=',
			events: '=',
			searchFilter: '=?',
			translationTexts: '=',
			disabled: '=',
		},
		transclude: true,
		controller,
		templateUrl: 'app/component/angularjs-dropdown-multiselect.html',
	};
}
