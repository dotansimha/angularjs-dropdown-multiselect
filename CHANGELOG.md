Version numbers correspond to `bower.json` version

# 2.0.0-beta.9
## Features
- Added setting idProperty, when set comparison will be done by this property instead of by reference

# 2.0.0-beta.7

## Breaking Changes
- bower.json and package.json main are back to the original dist/angularjs-dropdown-multiselect.min.js
- Linking directly to the repository was bad practice and is no longer suported

# 2.0.0-beta.5 & 2.0.0-beta.6

## Features
- Added support for transcluded custom toggle-dropdown element

# 2.0.0-beta.4

Small bugFix

## Bug Fixes
- orderBy wasn't respecting order in original array #322

# 2.0.0-beta.3

Small bugFix

## Bug Fixes
- Infinite loop when width is smaller than "..." in smartButtonText

# 2.0.0-beta.2

Continuation of the rework of the component. In this version we stop comparing objects by their id property and smiply use reference

## Breaking Changes
- dropped support for idProp
- dropped support for externalIdProp

## Features
- options array can exist out of any type of object

## Bug Fixes
- check all no longer displayed when selectionLimit is defined

# 2.0.0-beta.1

We've started a rework of the component and are planning to resolve as many issues as possible, this however means that some breaking changes are needed. We've decided to release some beta versions first in which we'll have the freedom to add more breaking changes.

## Breaking Changes
- extraSettings.selectionLimit = 1 is now treated the same as all other values, so selected-model doesn't have to be an object anymore (it should always be an array)
- removed attribute group-by, replaced by setting groupBy
- removed attribute checkboxes, replaced by setting checkBoxes

## Features
- Development wise the module has got a makeover which should make it easier to be maintained, before we release 2.0.1 we'll try to make the development experience as nice as possible
- We've also started a refactoring of the component that should make it easier to use and to add new features
- Added the selectedToTop setting.

## Bug Fixes
- Fixes #317: Single selection can remove properties from preselected object