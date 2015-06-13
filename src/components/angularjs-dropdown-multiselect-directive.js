angular
  .module('angularjs-dropdown-multiselect')
  .directive('dropdownMultiselect', function(dropdownMultiselectTheme, dropdownMultiselectConfiguration) {
    return {
      restrict: 'EAC',
      scope: true,
      link: function(scope, element, attrs) {
        let themeName = dropdownMultiselectConfiguration.getValueOrDefault('defaultTheme', attrs.theme);
        let themeTemplate = dropdownMultiselectTheme.getTheme(themeName);

        console.log(themeTemplate);
      }
    }
  });