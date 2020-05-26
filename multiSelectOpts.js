
$('#departments').multiSelect({

    // Custom templates
    'containerHTML': '<div class="multi-select-container">',
    'menuHTML': '<div class="multi-select-menu">',
    'buttonHTML': '<span class="multi-select-button">',
    'menuItemsHTML': '<div class="multi-select-menuitems">',
    'menuItemHTML': '<label class="multi-select-menuitem">',
    'presetsHTML': '<div class="multi-select-presets">',
    
    // sets some HTML (eg: <div class="multi-select-modal">) to enable the modal overlay.
    'modalHTML': undefined,
    
    // Active CSS class
    'activeClass': 'multi-select-container--open',
    
    // Text to show when no option is selected
    'noneText': 'Department',
    
    // Text to show when all options are selected
    'allText': undefined,
    
    // an array of preset option groups
    'presets': undefined,
    
    // CSS class added to the container, when the menu is about to extend beyond the right edge of the position<a href="https://www.jqueryscript.net/menu/">Menu</a>Within element
    'positionedMenuClass': 'multi-select-container--positioned',
    
    // If you provide a jQuery object here, the plugin will add a class (see positionedMenuClass option) to the container when the right edge of the dropdown menu is about to extend outside the specified element, giving you the opportunity to use CSS to prevent the menu extending, for example, by allowing the option labels to wrap onto multiple lines.
    'positionMenuWithin': undefined,
    
    // The plugin will attempt to keep this distance, in pixels, clear between the bottom of the menu and the bottom of the viewport, by setting a fixed height style if the menu would otherwise approach this distance from the bottom edge of the viewport.
    'viewportBottomGutter': 20,
    
    // minimal height
    'menuMinHeight': 200


});