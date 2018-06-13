// First argument to 'describe' (which is defined by Jasmine) is the testing module that will
// appear in test reports. The second argument is a callback containing the individual tests.
var count = 0;

describe("jasmine testing", function () {
    // The 'it' function of Jasmine defined an individual test. The first argument is
    // a description of the test that's appended to the module name. Because a module name
    // is typically a noun, like the name of the function being tested, the description for
    // an individual test is typically written in an action-data format.

    console.log("================= Log " + count++ + "=================");
    it("undefined 1", function () {
        // Invoke the unit being tested as necessary
        // Check the results; "expect" and toEqual are Jasmine methods.
        expect(true).toEqual(true);
    });
    it("undefined 2", function () {
        expect(true).toBe(true);
    });
});

describe("API suite", function () {
    console.log("================= Log " + count++ + "=================");
    it("Get all results", function () {
        expect(true).toBe(true);
    });
    it("Get 'Dennis'", function () {
        expect(true).toBe(true);
    });
    it("Get 'dennis'", function () {
        expect(true).toBe(true);
    });
    it("Get all names containing an 'a'", function () {
        expect(true).toBe(true);
    });
});





