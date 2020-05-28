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

  it('should be a valid json object', function(done) {

    fetchData('../pathology_tests.json');

    this.requests[0].respond(200, { 'Content-Type': 'text/json' }, JSON.stringify(tests_data));

    console.log(path_tests)
    assert.equal(path_tests.length, 4);
    done()
  });
});

