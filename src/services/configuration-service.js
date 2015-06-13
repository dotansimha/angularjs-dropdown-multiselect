angular
  .module('angularjs-dropdown-multiselect')
  .provider('dropdownMultiselectConfiguration', function() {
    let defaultConfigs = new Map();

    return {
      setDefaultValue: function(configName, defaultValue) {
        defaultConfigs.set(configName, defaultValue);
      },
      $get: function() {
        return {
          getValueOrDefault: function(configName, externalValue) {
            if (angular.isDefined(externalValue) && externalValue !== null) {
              return externalValue;
            }

            return defaultConfigs.get(configName);
          }
        }
      }
    }
  });