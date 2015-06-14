angular
  .module('angularjs-dropdown-multiselect')
  .directive('dropdownMultiselect', function(dropdownMultiselectTheme, dropdownMultiselectConfiguration, $parse) {
    return {
      restrict: 'EAC',
      scope: true,
      require: 'dropdownOptions',
      templateUrl: function(element, attrs) {
        let themeName = dropdownMultiselectConfiguration.getValueOrDefault('defaultTheme', attrs.theme);
        let themeTemplate = dropdownMultiselectTheme.getTheme(themeName);

        return themeTemplate;
      },
      link: function(scope, element, attrs, dropdownOptionsCtrl) {
        scope.options = dropdownOptionsCtrl.parsedOptions.getOptions();
        console.log(scope.options)
      }
    }
  });