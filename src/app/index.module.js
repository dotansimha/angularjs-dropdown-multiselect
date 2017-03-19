import './component/angularjs-dropdown-multiselect.module';
import component from './main/main.component';
import v1component from './v1docs/v1docs.component';

angular.module('AngularjsDropdownMultiselectExample', [
	'angularjs-dropdown-multiselect',
	'hljs',
	'ui.bootstrap',
	'ui.router',
])
.component('main', component())
.component('v1Docs', v1component())
.config(($stateProvider, $urlRouterProvider) => {
	$stateProvider.state({
		name: 'main',
		url: '/main',
		template: '<main></main>',
	});

	$stateProvider.state({
		name: 'v1',
		url: '/v1',
		template: '<v1-docs></v1-docs>',
	});

	$urlRouterProvider.otherwise('/main');
});
