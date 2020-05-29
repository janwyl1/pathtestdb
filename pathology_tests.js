var pathTestsDb = (function() {

    var path_tests;
    var path_tests_original;
    var startAt = 0;
    var limit = 50;
    
    // Getter required for exposing path_tests
    function getPathTests() {
        return path_tests;
    }

    // LOAD DATA
    function fetchData(dataUrl) {
        $.ajax(dataUrl, {
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
    }
    fetchData('pathology_tests.json');

    // DISPLAY DATA
    function appendTestsHTML() {
        var testsHTML = $('.tests');
        var htmlStr = "";
        if (path_tests.length < 1) {
            testsHTML.append('<div class="">No Tests Found</div>');
            hideShowMore(); 
        } 

        toggleShowMore();

        for (var i = startAt; i < limit; i++) {
            if (path_tests[i]) {
                htmlStr += '<div class="accordion-header">';
                htmlStr += '<div class="accordion-header-left">';
                if (path_tests[i].Name) htmlStr += '<h2>' + path_tests[i].Name + '</h2>'
                if (path_tests[i].Code) htmlStr += '<h5>' + path_tests[i].Code + '</h5>'
                htmlStr+='</div>';
                htmlStr+='<div class="accordion-header-right">';
                if (path_tests[i].Department) htmlStr+='<p>' + path_tests[i].Department + '</p>';
                if (path_tests[i].Container) htmlStr+='<p>' + path_tests[i].Container + '</p>';
                htmlStr+='</div>';
                htmlStr+='</div>';
                htmlStr+='<div class="accordion-body">';
                htmlStr+='<dl>';
                if (path_tests[i].Name) htmlStr+='<dt>Name</dt>';
                if (path_tests[i].Name) htmlStr+='<dd>' + path_tests[i].Name + '</dd>';
                if (path_tests[i].Code) htmlStr+='<dt>Code</dt>';
                if (path_tests[i].Code) htmlStr+='<dd>' + path_tests[i].Code + '</dd>';       
                if (path_tests[i].Sample_Type) htmlStr+='<dt>Specimen</dt>';
                if (path_tests[i].Sample_Type) htmlStr+='<dd>' + path_tests[i].Sample_Type + '</dd>';
                if (path_tests[i].Container) htmlStr+='<dt>Container</dt>';
                if (path_tests[i].Container) htmlStr+='<dd>' + path_tests[i].Container + '</dd>';
                if (path_tests[i].Department) htmlStr+='<dt>Department</dt>';
                if (path_tests[i].Department) htmlStr+='<dd>' + path_tests[i].Department + '</dd>';
                if (path_tests[i].Aliases) htmlStr+='<dt>Known as</dt>';
                if (path_tests[i].Aliases) htmlStr+='<dd>' + path_tests[i].Aliases + '</dd>';
                if (path_tests[i].Comments) htmlStr+='<dt>Comments</dt>';
                if (path_tests[i].Comments) htmlStr+='<dd>' + path_tests[i].Comments + '</dd>';
                if (path_tests[i].Turnaround) htmlStr+='<dt>Turnaround</dt>';
                if (path_tests[i].Turnaround) htmlStr+='<dd>' + path_tests[i].Turnaround + '</dd>';
                htmlStr+='</dl>';
                htmlStr+='</div>';
            }
        }
        testsHTML.append(htmlStr);
    }

    // SEARCH / MANIPULATE TESTS
    function showMoreTests(){
        if (limit < path_tests.length) {
            startAt = limit;
            limit += 50;
            appendTestsHTML();
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

    function filterTests(tests, searchTerm) {
        return tests.filter(function(test){
            return test.Search_Terms.toLowerCase().includes(searchTerm.toLowerCase())
        });
    }

    function sortTests(tests, searchTerm) {
        return tests.sort(function(a,b) {
            var aTerms = a.Search_Terms.toLowerCase().indexOf(searchTerm.toLowerCase());
            var bTerms = b.Search_Terms.toLowerCase().indexOf(searchTerm.toLowerCase());
            if (aTerms < bTerms) return -1;
            if (aTerms > bTerms) return 1;  
            return 0;
        });
    }

    function removeCategories(tests, category) {
        return tests.filter(function(test){
            if (category.toLowerCase() === "all") return true;
            return test.Department.toLowerCase() === category.toLowerCase();
        })
    }

    function searchTests() {
        var searchTerm = $('#search-inpt').val().toLowerCase();
        var category = $('#departments').val();
        
        resetTests();        
        path_tests = filterTests(path_tests, searchTerm);
        path_tests = sortTests(path_tests, searchTerm);
        path_tests = removeCategories(path_tests, category)
        appendTestsHTML();
    }

    function hideShowMore(){
        $('#show-more-btn').hide()
    };
    function showShowMore(){
        $('#show-more-btn').show()
    };
    function toggleShowMore() {
        if (path_tests.length >= 1 && limit < path_tests.length) {
            showShowMore();
        } else {
            hideShowMore();
        }
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


    // Revealing module pattern. Expose these methods, prevent global scope pollution.
    return {
        fetchData: fetchData,
        getPathTests: getPathTests,
        filterTests: filterTests,
        sortTests: sortTests,
        removeCategories: removeCategories
    }

})();