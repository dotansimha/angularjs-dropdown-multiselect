# AngularJS Dropdown Multiselect Directive

[TODO - brief summary]

## Demo
http://dotansimha.github.io/angularjs-dropdown-multiselect/

## Dependencies
- required:
	[TODO]
- optional
	[TODO]

See `bower.json` and `index.html` in the `gh-pages` branch for a full list / more details

## Install
1. download the files
	1. Bower
		1. add `"angularjs-dropdown-multiselect": "latest"` to your `bower.json` file then run `bower install` OR run `bower install angularjs-dropdown-multiselect`
2. include the files in your app
	1. `js-dropdown-multiselect.min.js`
	2. `js-dropdown-multiselect.less` OR `js-dropdown-multiselect.min.css` OR `js-dropdown-multiselect.css`
3. include the module in angular (i.e. in `app.js`) - `dotansimha.angularjs-dropdown-multiselect`

See the `gh-pages` branch, files `bower.json` and `index.html` for a full example.


## Documentation
See the `js-dropdown-multiselect.js` file top comments for usage examples and documentation
https://github.com/dotansimha/angularjs-dropdown-multiselect/blob/master/js-dropdown-multiselect.js


## Development

1. `git checkout gh-pages`
	1. run `npm install && bower install`
	2. write your code then run `grunt`
	3. git commit your changes
2. copy over core files (.js and .css/.less for directives) to master branch
	1. `git checkout master`
	2. `git checkout gh-pages js-dropdown-multiselect.js js-dropdown-multiselect.min.js js-dropdown-multiselect.less js-dropdown-multiselect.css js-dropdown-multiselect.min.css`
3. update README, CHANGELOG, bower.json, and do any other final polishing to prepare for publishing
	1. git commit changes
	2. git tag with the version number, i.e. `git tag v1.0.0`
4. create github repo and push
	1. [if remote does not already exist or is incorrect] `git remote add origin [github url]`
	2. `git push origin master --tags` (want to push master branch first so it is the default on github)
	3. `git checkout gh-pages`
	4. `git push origin gh-pages`
5. (optional) register bower component
	1. `bower register angularjs-dropdown-multiselect [git repo url]`
