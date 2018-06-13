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

describe("Search tests", function () {

    beforeEach(module("demo"));

    var $controller, $rootScope, $http, $httpBackend;

    beforeEach(inject(function (_$controller_, _$rootScope_, _$http_, _$httpBackend_) {
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $controller = _$controller_;
        $rootScope = _$rootScope_;
        $http = _$http_;
        $httpBackend = _$httpBackend_;
    }));

    describe('Unit API tests', function () {
        console.log("================= Log " + count++ + "=================");
        it("No comment check when loaded check", function () {
            var $scope = $rootScope.$new();
            expect($scope.comment).toBe(undefined);
        });
        console.log("================= Log " + count++ + "=================");
        it("Get 3 names", function () {
            var $scope = $rootScope.$new();
            var controller = $controller('search', { $scope: $scope });
            $scope.SearchNames();

            $httpBackend
                .whenGET(/\/api/)
                .respond(function (method, url, data, headers, params) {
                    return [ /* status */ 200, [ /* data */ { "name": { "first": "Dennis", "last": "Effler" } }, { "name": { "first": "Colene", "last": "Vigil" } }, { "name": { "first": "Ladonna", "last": "Tondreau" } }],]
                });
            $httpBackend.flush();
            // console.log("+++" + JSON.stringify($scope.names));
            expect($scope.names[0].name.first).toEqual("Dennis");
            expect($scope.names[0].name.last).toEqual("Effler");
            expect($scope.names[2].name.first).toEqual("Ladonna");
            expect($scope.names[2].name.last).toEqual("Tondreau");
        }); 
        console.log("================= Log " + count++ + "=================");
        it("Get all names containing an 'Co'", function () {
            var $scope = $rootScope.$new();
            var controller = $controller('search', { $scope: $scope });
            $scope.searchstring = "Co"
            $scope.SearchNames();

            $httpBackend
                .expect("GET", /\/api/) /* Inital call to populate the names list in full */
                .respond();
            $httpBackend
                .whenGET(/\/api\?/)
                .respond(function (method, url, data, headers, params) {
                    expect(url).toBe('/api?search=Co');
                    return [ /* status */ 200, [ /* data */ { "name": { "first": "Colene", "last": "Vigil" } }],]
                });
            expect($httpBackend.flush).not.toThrow();
            expect($scope.names[0].name.first).toEqual("Colene");
            expect($scope.names[0].name.last).toEqual("Vigil");
        });
    });
});





