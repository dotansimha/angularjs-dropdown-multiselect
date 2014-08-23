# AngularJS Dropdown Multiselect
This directive gives you a Bootstrap Dropdown with the power of AngularJS directives.

# Features
- Based on Bootstrap's dropdown.
- jQuery is not necessary.
- Seperated your data and the selection data. no modification to the data made.
- Built-in search.
- Complete control on the selected items model to fit it to your requirements.
- Two view options: normal list and checkboxes.
- Pre-selected values.
- Limit selection count.
- Grouping items by property.
- Callback events.
- Translation texts.
- Scrollable list (useful for big lists)

## Demo
http://dotansimha.github.io/angularjs-dropdown-multiselect/

## Dependencies
- required: AngularJS >= 1.2, Lodash >= 2, Bootstrap >= 3.0

- Make sure to add the dependencies before the directive's js file. 
- Note: Bootstrap JS file is not needed for the directive, it just uses the CSS file.
- **Note: Make sure to add lodash.js to your project, and make sure you use the regulate version of Lodash (NOT lodash.underscore or lodash.compat**

## Install
1. Download the files
	1. Using bower: <img src="http://benschwarz.github.io/bower-badges/badge@2x.png" width="130" height="30"> 
	
		Just run `bower install angularjs-dropdown-multiselect`
	2. Manually:
		You can download the `.js` file directly or clone this repository.
2. **Include lodash.js in your project.**
	- `<script type="text/javascript" src="lodash.js"></script>`.
3. Include the file in your app
	- `<script type="text/javascript" src="angularjs-dropdown-multiselect.js"></script>`.
	- You can also use the minfined version (`angularjs-dropdown-multiselect.min.js`).
4. Include the module in angular (i.e. in `app.js`) - `angularjs-dropdown-multiselect`


## Usage and Documentation
See the documentation and examples in the GitHub pages:
http://dotansimha.github.io/angularjs-dropdown-multiselect/

## TODO:
	- Feel free to send me more requests for features - open an issue with "feature request" tag - Thanks!
