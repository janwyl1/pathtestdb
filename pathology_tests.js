var pathTestsDb = (function() {
    "use strict"

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
                $('.tests').append('<div class="error-msg">Unable to fetch data</div>')
                console.log("Error: Unable to load data. Status: %s (%s)", status, err)
            }
        })
    }
    fetchData('pathology_tests.json');

    function determineBgColor(colorStr) {
        if (colorStr) {
          switch(colorStr.toLowerCase()){
            case 'brown':
            case 'small brown':
            case 'large brown':
              return "color-brown"
            case 'red':
            case 'small red':
            case 'large red':
              return "color-red"
            case 'green':
            case 'small green':
            case 'large green':
              return "color-green"
            case 'yellow':
            case 'small yellow':
            case 'large yellow':
              return "color-yellow"
            case 'orange':
            case 'small orange':
            case 'large orange':
              return "color-orange"
            case 'faeces':
              return "color-faeces"      
            case 'yellow urine':
                return "color-yellow-urine"         
            case 'green urine':
              return "color-green-urine"     
            case '24h urine':
              return "color-24h-urine"     
            case '24h urine acid':
              return "color-24h-urine-acid"     
            default:
              return "color-white"
          }
        } else {
          return false
        }
      }

    // Write tests to DOM
    function appendTestsHTML(tests) {
        var htmlStr = "";
        if (tests.length < 1) {
           htmlStr += '<div class="error-msg">No Tests Found</div>';
            hideShowMore(); 
        } 

        toggleShowMore();

        for (var i = startAt; i < limit; i++) {
            if (tests[i]) {
                var bgColor = determineBgColor(tests[i].Container);

                htmlStr += '<div class="card">';
                htmlStr += '<div class="card-header" data-toggle="collapse" data-target="#collapse' + i + '" aria-expanded="true" aria-controls="collapse' + i + '">';
                htmlStr += '<div class="no-gutters row">'
                htmlStr += '<div class="col-1 ' + bgColor + '"></div>'
                htmlStr += '<div class="col-11 card-header-text">'
                htmlStr += '<div class="row">'
                htmlStr += '<div class="card-header-left  align-self-center col-md-8">';
                htmlStr += '<h2 class="text-truncate">' + (tests[i].Code ? tests[i].Code : "N/A") + '</h2>'
                htmlStr += '<h5 class="text-truncate">' + (tests[i].Name ? tests[i].Name : "N/A") + '</h5>'
                htmlStr+='</div>';
                htmlStr+='<div class="card-header-right align-self-center col-md-4 d-none d-sm-block ">';
                if (tests[i].Department) htmlStr+='<p>' + tests[i].Department + '</p>';
                if (tests[i].Container) htmlStr+='<p class="badge badge-pill ' + bgColor + '">' + tests[i].Container + '</p>';
                htmlStr+='</div>';
                htmlStr+='</div>';
                htmlStr+='</div>';
                htmlStr+='</div>';
                htmlStr+='</div>';
                htmlStr+='<div class="collapse' + (i === 0 ? ' show' : '') + '" id="collapse' + i + '" aria-labelledby="heading' + i + '" data-parent="#accordion">';
                htmlStr+='<div class="card-body">';
                htmlStr+='<dl><div class="row">';
                if (tests[i].Name) htmlStr+='<dt class="col-md-3 col-lg-2">Name</dt>' + '<dd class="col-md-9">' + tests[i].Name + '</dd>';
                if (tests[i].Code) htmlStr+='<dt class="col-md-3 col-lg-2">Code</dt>' + '<dd class="col-md-9">' + tests[i].Code + '</dd>';
                if (tests[i].Sample_Type) htmlStr+='<dt class="col-md-3 col-lg-2">Specimen</dt>' + '<dd class="col-md-9">' + tests[i].Sample_Type + '</dd>';
                if (tests[i].Container) htmlStr+='<dt class="col-md-3 col-lg-2">Container</dt>' + '<dd class="col-md-9">' + tests[i].Container + '</dd>';
                if (tests[i].Department) htmlStr+='<dt class="col-md-3 col-lg-2">Department</dt>' + '<dd class="col-md-9">' + tests[i].Department + '</dd>';
                if (tests[i].Aliases) htmlStr+='<dt class="col-md-3 col-lg-2">Known as</dt>' + '<dd class="col-md-9">' + tests[i].Aliases + '</dd>';
                if (tests[i].Comments) htmlStr+='<dt class="col-md-3 col-lg-2">Comments</dt>' + '<dd class="col-md-9">' + tests[i].Comments + '</dd>';
                if (tests[i].Turnaround) htmlStr+='<dt class="col-md-3 col-lg-2">Turnaround</dt>' + '<dd class="col-md-9">' + tests[i].Turnaround + '</dd>';
                htmlStr+='</dl></div>';
                htmlStr+='</div>';
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
        appendTestsHTML: appendTestsHTML,
        determineBgColor: determineBgColor
    }

})();