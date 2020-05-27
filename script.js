(function(){

    var path_tests;
    var path_tests_original;
    var startAt = 0;
    var limit = 50;
    
    // LOAD DATA
    $.ajax('pathology_tests.json', {
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            path_tests = data;
            path_tests_original = data;
            resetDeptDropdown();
            handleSearchClick()
            handleShowMoreClick();
            handleSearchOnEnter();
            handleDeptDropdownChange();
            appendTestsHTML();
        },
        error: function(req, status, err) {
            $('.tests').append('<div class="">Unable to fetch data</div>')
            console.log("Error: Unable to load data. Status: %s (%s)", status, err)
        }
    })

    // DISPLAY DATA
    function appendTestsHTML() {
        var testsHTML = $('.tests');
        if (path_tests.length < 1) testsHTML.append('<div class="">No Tests Found</div>');

        for (var i = startAt; i < limit; i++) {
            if (path_tests[i]) {
                testsHTML.append('<div class="accordion-header">');
                testsHTML.append('<div class="accordion-header-left">')
                if (path_tests[i].Name) testsHTML.append('<h2>' + path_tests[i].Name + '</h2>')
                if (path_tests[i].Code) testsHTML.append('<h5>' + path_tests[i].Code + '</h5>')
                testsHTML.append('</div>');
                testsHTML.append('<div class="accordion-header-right">');
                if (path_tests[i].Department) testsHTML.append('<p>' + path_tests[i].Department + '</p>');
                if (path_tests[i].Container) testsHTML.append('<p>' + path_tests[i].Container + '</p>');   
                testsHTML.append('</div>');
                testsHTML.append('</div>');

                testsHTML.append('<div class="accordion-body">');
                testsHTML.append('<dl>');
                if (path_tests[i].Name) testsHTML.append('<dt>Name</dt>');
                if (path_tests[i].Name) testsHTML.append('<dd>' + path_tests[i].Name + '</dd>');
                if (path_tests[i].Code) testsHTML.append('<dt>Code</dt>');
                if (path_tests[i].Code) testsHTML.append('<dd>' + path_tests[i].Code + '</dd>');       
                if (path_tests[i].Sample_Type) testsHTML.append('<dt>Specimen</dt>');
                if (path_tests[i].Sample_Type) testsHTML.append('<dd>' + path_tests[i].Sample_Type + '</dd>');
                if (path_tests[i].Container) testsHTML.append('<dt>Container</dt>');
                if (path_tests[i].Container) testsHTML.append('<dd>' + path_tests[i].Container + '</dd>');
                if (path_tests[i].Department) testsHTML.append('<dt>Department</dt>');
                if (path_tests[i].Department) testsHTML.append('<dd>' + path_tests[i].Department + '</dd>');
                if (path_tests[i].Aliases) testsHTML.append('<dt>Known as</dt>');
                if (path_tests[i].Aliases) testsHTML.append('<dd>' + path_tests[i].Aliases + '</dd>');
                if (path_tests[i].Comments) testsHTML.append('<dt>Comments</dt>');
                if (path_tests[i].Comments) testsHTML.append('<dd>' + path_tests[i].Comments + '</dd>');
                if (path_tests[i].Turnaround) testsHTML.append('<dt>Turnaround</dt>');
                if (path_tests[i].Turnaround) testsHTML.append('<dd>' + path_tests[i].Turnaround + '</dd>');
                testsHTML.append('</dl>');
                testsHTML.append('</div>');
            }
        }
    }

    // SEARCH / MANIPULATE TESTS
    function showMoreTests(){
        if (limit < path_tests.length) {
            startAt = limit;
            limit += 50;
            appendTestsHTML(path_tests);
        }
    }

    function resetDeptDropdown() {
        $('#departments').val('all')
    }

    function resetTests(){
        path_tests = path_tests_original;
        startAt = 0;
        limit = 50;
        $('.tests').empty();
    }

    function filterTests() {
        var searchTerm = $('#search-inpt').val().toLowerCase();
        path_tests = path_tests.filter(function(test){
            return test.Search_Terms.toLowerCase().includes(searchTerm)
        });
    }

    function sortTests() {
        var searchTerm = $('#search-inpt').val().toLowerCase();
        path_tests = path_tests.sort(function(a,b) {
            var aTerms = a.Search_Terms.toLowerCase().indexOf(searchTerm);
            var bTerms = b.Search_Terms.toLowerCase().indexOf(searchTerm);
            if (aTerms < bTerms) return -1;
            if (aTerms > bTerms) return 1;  
            return 0;
        });
    }

    function removeCategories() {
        var category = $('#departments').val();
        path_tests = path_tests.filter(function(test){
            if (category.toLowerCase() === "all") return true;
            return test.Department.toLowerCase() === category.toLowerCase();
        })
    }

    function searchTests() {
        resetTests();        
        filterTests();
        sortTests();
        removeCategories()
        appendTestsHTML();
    }


    // ATTACH EVENT HANDLERS
    function handleDeptDropdownChange() {
        $('#departments').on('change', function(e) {
            searchTests();
        })
    }

    function handleSearchOnEnter(){
        $('#search-inpt').keypress(function (e) {
            if (e.which == 13) {
              searchTests();
            }
        });
    }

    function handleSearchClick() {
        $('#search-btn').on('click', function(e) {
            searchTests()
        })
    }

    function handleShowMoreClick() {
        $('#show-more-btn').on('click', function(e) {
            showMoreTests()
        })
    }

})();
