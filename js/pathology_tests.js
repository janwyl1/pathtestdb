var pathTestsDb = (function () {
  "use strict";

  /**
   * Config
   */
  var path_tests;
  var path_tests_original;
  var startAt = 0;
  var limit = 40;

  /**
   * @function getPathTests
   * @description Expose path_tests for testing in browser
   */
  function getPathTests() {
    return path_tests;
  }

  /**
   * @function fetchData
   * @param {string} dataUrl url to fetch data from
   */
  function fetchData(dataUrl) {
    return $.ajax(dataUrl, {
      type: 'GET',
      dataType: 'json',
      success: handleReqSuccess,
      error: handleReqError
    })
  }

  /**
   * @function handleReqSuccess
   * @param {array} data
   * @description Handles successful when fetching data. Sets the application to it's initial state
   * <br/>&nbsp;&nbsp;Stores data in path_tests var, stores a copy of it in path_tests_original. 
   * <br/>&nbsp;&nbsp;Appends path_tests to the DOM and attaches event handlers
   */
  function handleReqSuccess(data) {
    path_tests = data;
    path_tests_original = data;
    resetDeptDropdown();
    appendTestsHTML(path_tests);
    handleSearchClick()
    handleShowMoreClick();
    handleSearchOnEnter();
    handleDeptDropdownChange();
    handleAccordionClick();
    selectSearchInput();
  }

  /**
   * @function handleReqError
   * @param {array} data
   * @description Handles error that occur when fetching data
   * <br/>&nbsp;&nbsp;Writes error to the DOM
   */
  function handleReqError(req, status, err) {
    $('.tests').append($.parseHTML('<div class="error-msg">Unable to fetch data</div>'))
    console.log("Error: Unable to load data. Status: %s (%s)", status, err)
  }

  /**
   * @function determineBorderColor
   * @param {string} colorStr Colour of container 
   * @returns {string} CSS class name
   * @description Returns the classname to use for each specimen container (see left border on accordion headings)
   */
  function determineBorderColor(colorStr) {
    switch (colorStr.toString().toLowerCase()) {
      case 'brown':
      case 'small brown':
      case 'large brown':
        return "border-brown"
      case 'red':
      case 'small red':
      case 'large red':
        return "border-red"
      case 'green':
      case 'small green':
      case 'large green':
        return "border-green"
      case 'yellow':
      case 'small yellow':
      case 'large yellow':
        return "border-yellow"
      case 'orange':
      case 'small orange':
      case 'large orange':
        return "border-orange"
      case 'faeces':
        return "border-faeces"
      case 'yellow urine':
        return "border-yellow-urine"
      case 'green urine':
        return "border-green-urine"
      case '24h urine':
        return "border-24h-urine"
      case '24h urine acid':
        return "border-24h-urine-acid"
      default:
        return "border-white"
    }
  }

  /**
   * @function appendTestsHTML
   * @param {array} tests Array of pathology tests
   * @description Writes HTML for accordion elements to the DOM
   */
  function appendTestsHTML(tests) {
    var htmlStr = "";
    if (tests.length < 1) {
      htmlStr += '<div class="error-msg">No Tests Found.</div>';
      hideShowMore();
    }

    toggleShowMore();

    for (var i = startAt; i < limit; i++) {
      if (tests[i]) {
        var borderColor = determineBorderColor(tests[i].Container);

        htmlStr += '<div class="card">';
        htmlStr += '<div class="card-header" data-toggle="collapse" data-target="#collapse' + i + '" aria-expanded="' + (i === 0 ? 'true' : 'false') + '" aria-controls="collapse' + i + '" href="#collapse' + i + '" id="heading' + i + '">';
        htmlStr += '<div class="no-gutters row">'
        htmlStr += '<div class="col-12 card-header-text ' + borderColor + '">'
        htmlStr += '<div class="row">'
        htmlStr += '<div class="card-header-left  align-self-center col-md-8">';
        htmlStr += '<h2 class="text-truncate">' + (tests[i].Code ? tests[i].Name : "N/A") + '</h2>'
        htmlStr += '<h5 class="text-truncate">' + (tests[i].Name ? tests[i].Code : "N/A") + '</h5>'
        htmlStr += '</div>';
        htmlStr += '<div class="card-header-right align-self-center col-md-4 d-none d-sm-block ">';
        if (tests[i].Department) htmlStr += '<p>' + tests[i].Department + '</p>';
        if (tests[i].Container) htmlStr += '<p class="badge badge-pill">' + tests[i].Container + '</p>';
        htmlStr += '</div>';
        htmlStr += '</div>';
        htmlStr += '</div>';
        htmlStr += '</div>';
        htmlStr += '</div>';
        htmlStr += '<div class="collapse' + (i === 0 ? ' show' : '') + '" id="collapse' + i + '" aria-labelledby="heading' + i + '" data-parent="#accordion">';
        htmlStr += '<div class="card-body">';
        htmlStr += '<dl><div class="row">';
        if (tests[i].Name) htmlStr += '<dt class="col-md-3 col-lg-2">Name</dt>' + '<dd class="col-md-9">' + tests[i].Name + '</dd>';
        if (tests[i].Code) htmlStr += '<dt class="col-md-3 col-lg-2">Code</dt>' + '<dd class="col-md-9">' + tests[i].Code + '</dd>';
        if (tests[i].Sample_Type) htmlStr += '<dt class="col-md-3 col-lg-2">Specimen</dt>' + '<dd class="col-md-9">' + tests[i].Sample_Type + '</dd>';
        if (tests[i].Container) htmlStr += '<dt class="col-md-3 col-lg-2">Container</dt>' + '<dd class="col-md-9">' + tests[i].Container + '</dd>';
        if (tests[i].Department) htmlStr += '<dt class="col-md-3 col-lg-2">Department</dt>' + '<dd class="col-md-9">' + tests[i].Department + '</dd>';
        if (tests[i].EQMS_Code) htmlStr += '<dt class="col-md-3 col-lg-2">EQMS</dt>' + '<dd class="col-md-9"><a href="' + tests[i].EQMS_Link + '" class="eqms-link">' + tests[i].EQMS_Code + '</a>' + '</dd>';
        if (tests[i].Lab_Instructions) htmlStr += '<dt class="col-md-3 col-lg-2">Comments</dt>' + '<dd class="col-md-9">' + tests[i].Lab_Instructions + '</dd>';
        if (tests[i].Aliases) htmlStr += '<dt class="col-md-3 col-lg-2">Known as</dt>' + '<dd class="col-md-9">' + tests[i].Aliases + '</dd>';
        if (tests[i].Comments) htmlStr += '<dt class="col-md-3 col-lg-2">Comments</dt>' + '<dd class="col-md-9">' + tests[i].Comments + '</dd>';
        if (tests[i].Turnaround) htmlStr += '<dt class="col-md-3 col-lg-2">Turnaround</dt>' + '<dd class="col-md-9">' + tests[i].Turnaround + '</dd>';
        htmlStr += '</dl></div>';
        htmlStr += '</div>';
        htmlStr += '</div>';
        htmlStr += '</div>';
      }
    }
    $('.tests').append($.parseHTML(htmlStr));
  }

  /**
   * @function showMoreTests
   * @description Increases limit and writes new accordion elements to the DOM
   */
  function showMoreTests() {
    if (limit < path_tests.length) {
      startAt = limit;
      limit += 50;
      appendTestsHTML(path_tests);
    }
  }
  /**
   * @function resetDeptDropdown
   * @description Reset department dropdown on search form
   */
  function resetDeptDropdown() {
    $('#departments').val('all')
  }
  /**
   * @function resetTests
   * @description Reset path_tests array and pagination variables, remove HTML
   */
  function resetTests() {
    path_tests = path_tests_original;
    startAt = 0;
    limit = 50;
    $('.tests').empty();
  }
  /**
   * @function filterTests
   * @param {array} tests
   * @param {string} searchTerm
   * @returns {array} Filter array of tests by search term
   */
  function filterTests(tests, searchTerm) {
    return tests.filter(function (test) {
      return test.Search_Terms.toLowerCase().includes(searchTerm.toLowerCase())
    });
  }
  /**
   * @function sortTests
   * @param {array} tests
   * @param {string} searchTerm
   * @description Sort an array of tests by appearance of search term. Terms that appear earlier are more relevant e.g. Codes appear first
   */
  function sortTests(tests, searchTerm) {
    return tests.sort(function (a, b) {
      var aTerms = a.Search_Terms.toLowerCase().indexOf(searchTerm.toLowerCase());
      var bTerms = b.Search_Terms.toLowerCase().indexOf(searchTerm.toLowerCase());
      if (aTerms < bTerms) return -1;
      if (aTerms > bTerms) return 1;
      return 0;
    });
  }
  /**
   * @function filterDepartment
   * @param {array} tests
   * @param {string} department
   * @description Filter array of tests by department
   */
  function filterDepartment(tests, department) {
    return tests.filter(function (test) {
      if (department.toLowerCase() === "all") return true;
      return test.Department.toLowerCase().includes(department.toLowerCase());
    })
  }
  /**
   * @function searchTests
   * @description Handles search. Filters and sorts tests and appends HTML to DOM
   */
  function searchTests() {
    var searchTerm = $('#search-inpt').val().toLowerCase();
    var department = $('#departments').val();

    resetTests();
    path_tests = filterTests(path_tests, searchTerm);
    path_tests = sortTests(path_tests, searchTerm);
    path_tests = filterDepartment(path_tests, department);
    appendTestsHTML(path_tests);
  }
  /**
   * @function hideShowMore
   * @description Hide #show-more-btn
   */
  function hideShowMore() {
    $('#show-more-btn').hide()
  };
  /**
   * @function showShowMore
   * @description Show #show-more-btn
   */
  function showShowMore() {
    $('#show-more-btn').show()
  };
  /**
   * @function toggleShowMore
   * @description Show/hide #show-more-btn
   */
  function toggleShowMore() {
    if (path_tests.length >= 1 && limit < path_tests.length) {
      showShowMore();
    } else {
      hideShowMore();
    }
  };
  /**
   * @function selectSearchInput
   * @description Focus on the search box
   */
  function selectSearchInput() {
    $('#search-inpt').focus();
  }

  /**
   * @function handleDeptDropdownChange
   * @description Handle department dropdown selection
   */
  function handleDeptDropdownChange() {
    $('#departments').on('change', function (e) {
      searchTests();
    })
  }
  /**
   * @function handleSearchOnEnter
   * @description Trigger search when enter is pressed
   */
  function handleSearchOnEnter() {
    $('#search-inpt').keypress(function (e) {
      if (e.which == 13) {
        e.preventDefault();
        searchTests();
        scrollToSearch();
      }
    });
  }
  /**
   * @function handleSearchClick
   * @description Trigger search when #search-btn is clicked
   */
  function handleSearchClick() {
    $('#search-btn').on('click', function (e) {
      searchTests()
    })
  }
  /**
   * @function handleShowMoreClick
   * @description Show more tests when #show-more-btn is clicked
   */
  function handleShowMoreClick() {
    $('#show-more-btn').on('click', function (e) {
      showMoreTests()
    })
  }
  /**
   * @function handleAccordionClick
   * @description Show more tests when #show-more-btn is clicked
   */
  function handleAccordionClick() {
    $('.card-header').on('click', function (e) {
      var badge = $(this).find('.badge');
      badge.addClass('color-brown');
    })
  }
  /**
   * @function scrollToSearch
   * @description Scroll to search area
   */
  function scrollToSearch() {
    $("html, body").stop().animate({
      scrollTop: $('#search-inpt').offset().top
    }, 500);
  }

  /**
   * @function init
   * @description Initialize app by fetching data
   */
  function init() {
    fetchData('../data/pathology_tests.json');
  }
  init();


  return {
    fetchData: fetchData,
    getPathTests: getPathTests,
    filterTests: filterTests,
    sortTests: sortTests,
    filterDepartment: filterDepartment,
    resetTests: resetTests,
    appendTestsHTML: appendTestsHTML,
    determineBorderColor: determineBorderColor
  }

})();