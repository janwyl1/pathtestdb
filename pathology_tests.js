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
                appendTestsHTML(path_tests);
            },
            error: function(req, status, err) {
                $('.tests').append('<div class="">Unable to fetch data</div>')
                console.log("Error: Unable to load data. Status: %s (%s)", status, err)
            }
        })
    }
    fetchData('pathology_tests.json');

    // Write tests to DOM
    function appendTestsHTML(tests) {
        var htmlStr = "";
        if (tests.length < 1) {
           htmlStr += '<div class="">No Tests Found</div>';
            hideShowMore(); 
        } 

        toggleShowMore();

        for (var i = startAt; i < limit; i++) {
            if (tests[i]) {
                htmlStr += '<div class="card">';
                htmlStr += '<div class="card-header">';
                htmlStr += '<div class="card-header-left">';
                if (tests[i].Name) htmlStr += '<h2>' + tests[i].Name + '</h2>'
                if (tests[i].Code) htmlStr += '<h5>' + tests[i].Code + '</h5>'
                htmlStr+='</div>';
                htmlStr+='<div class="card-header-right">';
                if (tests[i].Department) htmlStr+='<p>' + tests[i].Department + '</p>';
                if (tests[i].Container) htmlStr+='<p>' + tests[i].Container + '</p>';
                htmlStr+='</div>';
                htmlStr+='</div>';
                htmlStr+='<div class="card-body">';
                htmlStr+='<dl>';
                if (tests[i].Name) htmlStr+='<dt>Name</dt>' + '<dd>' + tests[i].Name + '</dd>';
                if (tests[i].Code) htmlStr+='<dt>Code</dt>' + '<dd>' + tests[i].Code + '</dd>';
                if (tests[i].Sample_Type) htmlStr+='<dt>Specimen</dt>' + '<dd>' + tests[i].Sample_Type + '</dd>';
                if (tests[i].Container) htmlStr+='<dt>Container</dt>' + '<dd>' + tests[i].Container + '</dd>';
                if (tests[i].Department) htmlStr+='<dt>Department</dt>' + '<dd>' + tests[i].Department + '</dd>';
                if (tests[i].Aliases) htmlStr+='<dt>Known as</dt>' + '<dd>' + tests[i].Aliases + '</dd>';
                if (tests[i].Comments) htmlStr+='<dt>Comments</dt>' + '<dd>' + tests[i].Comments + '</dd>';
                if (tests[i].Turnaround) htmlStr+='<dt>Turnaround</dt>' + '<dd>' + tests[i].Turnaround + '</dd>';
                htmlStr+='</dl>';
                htmlStr+='</div>';
                htmlStr+='</div>';

            }
        }
        $('.tests').append(htmlStr);
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
            return test.Department.toLowerCase().includes(category.toLowerCase());
        })
    }

    function searchTests() {
        var searchTerm = $('#search-inpt').val().toLowerCase();
        var category = $('#departments').val();
        
        resetTests();        
        path_tests = filterTests(path_tests, searchTerm);
        path_tests = sortTests(path_tests, searchTerm);
        path_tests = removeCategories(path_tests, category);
        appendTestsHTML(path_tests);
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
              e.preventDefault();
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
        removeCategories: removeCategories,
        resetTests: resetTests,
        appendTestsHTML: appendTestsHTML
    }

})();