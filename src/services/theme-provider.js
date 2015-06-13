angular
  .module('angularjs-dropdown-multiselect')
  .provider('dropdownMultiselectTheme', function() {
    let themes = new Map();

    return {
      registerTheme: function(themeName, themeTemplate) {
        themes.set(themeName, themeTemplate);
      },
      $get: function() {
        return {
          getTheme: function(themeName) {
            return themes.get(themeName);
          }
        }
      }
    }
  });