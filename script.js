// (function(){

    var path_tests;
    var path_tests_original;
    var startAt = 0;
    var limit = 50;
    
    /* Load Data */
    $.ajax('pathology_tests.json', {
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            path_tests = data;
            path_tests_original = data;
            populateTests(path_tests);
        },
        error: function(req, status, err) {
            console.log("Error: Unable to load data. Status: %s (%s)", status, err)
        }
    })
    
    function populateTests(tests) {
        var testsHTML = $('.tests');
    
        if (tests.length < 1) testsHTML.append('<div class="">No Tests Found</div>');
        else {
            for (var i = startAt; i < limit; i++) {
            if (tests[i]) {
                testsHTML.append('<div class="accordion-header">');
                testsHTML.append('<div class="accordion-header-left">')
                if (tests[i].Name) testsHTML.append('<h2>' + tests[i].Name + '</h2>')
                if (tests[i].Code) testsHTML.append('<h5>' + tests[i].Code + '</h5>')
                testsHTML.append('</div>');
                testsHTML.append('<div class="accordion-header-right">');
                if (tests[i].Department) testsHTML.append('<p>' + tests[i].Department + '</p>');
                if (tests[i].Container) testsHTML.append('<p>' + tests[i].Container + '</p>');   
                testsHTML.append('</div>');
                testsHTML.append('</div>');
                testsHTML.append('<div class="accordion-body">');
                testsHTML.append('<dl>');
                if (tests[i].Name)testsHTML.append('<dt>Name</dt>');
                if (tests[i].Name) testsHTML.append('<dd>' + tests[i].Name + '</dd>');
                if (tests[i].Code) testsHTML.append('<dt>Code</dt>');
                if (tests[i].Code) testsHTML.append('<dd>' + tests[i].Code + '</dd>');       
                if (tests[i].Sample_Type) testsHTML.append('<dt>Specimen</dt>');
                if (tests[i].Sample_Type) testsHTML.append('<dd>' + tests[i].Sample_Type + '</dd>');
                if (tests[i].Container) testsHTML.append('<dt>Container</dt>');
                if (tests[i].Container) testsHTML.append('<dd>' + tests[i].Container + '</dd>');
                if (tests[i].Department) testsHTML.append('<dt>Department</dt>');
                if (tests[i].Department) testsHTML.append('<dd>' + tests[i].Department + '</dd>');
                if (tests[i].Aliases) testsHTML.append('<dt>Known as</dt>');
                if (tests[i].Aliases) testsHTML.append('<dd>' + tests[i].Aliases + '</dd>');
                if (tests[i].Comments) testsHTML.append('<dt>Comments</dt>');
                if (tests[i].Comments) testsHTML.append('<dd>' + tests[i].Comments + '</dd>');
                if (tests[i].Turnaround) testsHTML.append('<dt>Turnaround</dt>');
                if (tests[i].Turnaround) testsHTML.append('<dd>' + tests[i].Turnaround + '</dd>');
                testsHTML.append('</dl>');
                testsHTML.append('</div>');
            }
            }
        }
    }
    
    function showMore(){
        if (limit < path_tests.length) {
            startAt = limit;
            limit += 50;
            populateTests(path_tests);
        }
    }

    function resetSearch(){
        startAt = 0;
        limit = 50;
        $('.tests').empty();
    }
    
    function searchTests() {
        resetSearch();        
        var searchTerm = $('#search-inpt').val().toLowerCase();
        path_tests = path_tests_original.filter(function(test){
            return test.Search_Terms.toLowerCase().includes(searchTerm)
        });
        path_tests = path_tests.sort(function(a,b) {
            var aTerms = a.Search_Terms.toLowerCase();
            var bTerms = b.Search_Terms.toLowerCase();
            return (aTerms.indexOf(searchTerm) > bTerms.indexOf(searchTerm))
        });
        
        populateTests(path_tests);
    }

 
    function submitOnEnter(){
        $('#search-inpt').keypress(function (e) {
            if (e.which == 13) {
              return  searchTests();
            }
        });
    }
    
    
    function init(){
        $('#search-btn').on('click', function(e) {
            searchTests()
        })
        $('#show-more-btn').on('click', function(e) {
            showMore()
        })
        submitOnEnter();
    }
    init();
    
    
    // $('#departments').multiSelect({
    
    //     // Custom templates
    //     'containerHTML': '<div class="multi-select-container">',
    //     'menuHTML': '<div class="multi-select-menu">',
    //     'buttonHTML': '<span class="multi-select-button">',
    //     'menuItemsHTML': '<div class="multi-select-menuitems">',
    //     'menuItemHTML': '<label class="multi-select-menuitem">',
    //     'presetsHTML': '<div class="multi-select-presets">',
        
    //     // sets some HTML (eg: <div class="multi-select-modal">) to enable the modal overlay.
    //     'modalHTML': undefined,
        
    //     // Active CSS class
    //     'activeClass': 'multi-select-container--open',
        
    //     // Text to show when no option is selected
    //     'noneText': 'Department',
        
    //     // Text to show when all options are selected
    //     'allText': undefined,
        
    //     // an array of preset option groups
    //     'presets': undefined,
        
    //     // CSS class added to the container, when the menu is about to extend beyond the right edge of the position<a href="https://www.jqueryscript.net/menu/">Menu</a>Within element
    //     'positionedMenuClass': 'multi-select-container--positioned',
        
    //     // If you provide a jQuery object here, the plugin will add a class (see positionedMenuClass option) to the container when the right edge of the dropdown menu is about to extend outside the specified element, giving you the opportunity to use CSS to prevent the menu extending, for example, by allowing the option labels to wrap onto multiple lines.
    //     'positionMenuWithin': undefined,
        
    //     // The plugin will attempt to keep this distance, in pixels, clear between the bottom of the menu and the bottom of the viewport, by setting a fixed height style if the menu would otherwise approach this distance from the bottom edge of the viewport.
    //     'viewportBottomGutter': 20,
        
    //     // minimal height
    //     'menuMinHeight': 200
    
    
    // });
// })();
