import controller from './main.controller';

export default function mainComponent() {
	const component = {
		templateUrl: 'app/main/main.template.html',
		controller,
	};

	return component;
}
