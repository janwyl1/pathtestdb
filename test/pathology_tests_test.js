var assert = chai.assert;

const tests_data = [
    {
      "Code": "SADCOR",
      "Name": "11-Deoxycortisol",
      "Department": "Biochemistry",
      "Sample_Type": "S",
      "Container": "Brown",
      "Aliases": "11-deoxy, 11 deoxy, Cortisol",
      "EQMS_Code": 9223,
      "EQMS_Link": "http://shkpathdocs/wsteqmssso/Administrator/LoadDocADM.asp?ID=9223&Ext=True",
      "Lab_Instructions": "Store at room temperature overnight. Serum 2mls",
      "Search_Terms": "sadcor, 11-deoxycortisol, 11-deoxy, 11 deoxy, cortisol , biochemistry, brown, 9223",
      "Match": 1,
      "Validation_Status": "Validated",
      "Turnaround": "20 days"
    },  
    {
        "Code": "FIB4/FBC",
        "Name": "FIB4 / Liver Fibrosis Score",
        "Department": "Biochemistry / Haematology",
        "Sample_Type": "VB / S",
        "Container": "Brown",
        "Aliases": "Liver Fibrosis",
        "EQMS_Code": "",
        "EQMS_Link": "N/A",
        "Lab_Instructions": "The FIB4 test requires the booking of a FIB4 into Biochemistry and the booking of an FBC into Haematology.  If no red sample is received for Haematology book in an FBC and write on the form \"No red received\".\n\nClinical Details Important.",
        "Search_Terms": "fib4/fbc, fib4 / liver fibrosis score, liver fibrosis, biochemistry / haematology, brown,",
        "Match": 1,
        "Validation_Status": "Validated",
        "Turnaround": ""
    },  
    {
        "Code": "SAANY",
        "Name": "Amikacin",
        "Department": "Microbiology",
        "Sample_Type": "S",
        "Container": "Brown",
        "Aliases": "Send away Misc",
        "EQMS_Code": "",
        "EQMS_Link": "N/A",
        "Lab_Instructions": "",
        "Search_Terms": "saany, amikacin, send away misc, microbiology, brown,",
        "Match": 1,
        "Validation_Status": "Validated",
        "Turnaround": ""
      },
    {
        "Code": "FBC",
        "Name": "Full Blood Count",
        "Department": "Haematology",
        "Sample_Type": "VB",
        "Container": "Red",
        "Aliases": "FBC, SCBU",
        "EQMS_Code": "",
        "EQMS_Link": "N/A",
        "Lab_Instructions": "Also 1.2ML EDTA.\nAny FBC from SCBU book in as set SCBU",
        "Search_Terms": "fbc, full blood count, fbc, scbu, haematology, red,",
        "Match": 1,
        "Validation_Status": "Validated",
        "Turnaround": ""     
}]



describe('Pathology Tests',  function() {
    beforeEach(function() {
        this.xhr = sinon.useFakeXMLHttpRequest();

        this.requests = [];
        this.xhr.onCreate = function(xhr) {
            this.requests.push(xhr);
        }.bind(this);
    });

    afterEach(function() {
        this.xhr.restore();
    });

  describe('Fetch data', function() {
    it('should be a valid json object', function(done) {
        pathTestsDb.fetchData('../pathology_tests.json');
        this.requests[0].respond(200, { 'Content-Type': 'text/json' }, JSON.stringify(tests_data));
        assert.isArray(pathTestsDb.getPathTests())
        assert.isObject(pathTestsDb.getPathTests()[0]);
        done()
    });
    it('should contain 4 items', function(done) {
        pathTestsDb.fetchData('../pathology_tests.json');
        this.requests[0].respond(200, { 'Content-Type': 'text/json' }, JSON.stringify(tests_data));
        assert.equal(pathTestsDb.getPathTests().length, 4);
        done()
    });
  });

  describe('Filter Tests', function() {
    it('should be an array of 2 items', function(done){
      pathTestsDb.fetchData('../pathology_tests.json');
      const filteredTests = pathTestsDb.filterTests(pathTestsDb.getPathTests(), "FBC");
      assert.isArray(filteredTests)
      assert.equal(filteredTests.length, 2)
      done();
    })
    it('first item should be FIB4', function(done){
      pathTestsDb.fetchData('../pathology_tests.json');
      const filteredTests = pathTestsDb.filterTests(pathTestsDb.getPathTests(), "FBC");
      assert.equal(filteredTests[0].Code, "FIB4/FBC")
      done();
    })
  })

  describe('Sort Tests', function() {
    it('should be an array of 2 items', function(done){
      pathTestsDb.fetchData('../pathology_tests.json');
      const filteredTests = pathTestsDb.filterTests(pathTestsDb.getPathTests(), "FBC");
      const sortedTests = pathTestsDb.sortTests(filteredTests, "FBC") 
      assert.isArray(sortedTests)
      assert.equal(sortedTests.length, 2)
      done();
    })
    it('first item should be FBC', function(done){
      pathTestsDb.fetchData('../pathology_tests.json');
      const filteredTests = pathTestsDb.filterTests(pathTestsDb.getPathTests(), "FBC");
      const sortedTests = pathTestsDb.sortTests(filteredTests, "FBC");
      assert.equal(sortedTests[0].Code, "FBC")
      done();
    })
  })

  
  describe('Remove Categories', function(){
    it('should be no biochemistry tests', function(done) {
    // assert.equal($('.accordion-header-left h2').first().text(), ('FIB4 / Liver Fibrosis Score'));
    pathTestsDb.fetchData('../pathology_tests.json');
    const tests = pathTestsDb.removeCategories(pathTestsDb.getPathTests(), "BIOchemistry");
    var members = [];
    tests.forEach(function(test){
      members.push(test.Department)
    })
    assert.includeMembers(members, [ 2, 1, 2 ], 'include members')
    assert.equal(tests)
    done();
  })
  })

  describe('Write HMTL', function(){
    it('should correctly write HTML to the DOM', function(done) {
    // assert.equal($('.accordion-header-left h2').first().text(), ('FIB4 / Liver Fibrosis Score'));
    done();
})
  })

});