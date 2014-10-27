// this function returns a number from 0 to 100
// indicating what percentage of tests were passed
exports.testFunction = function(multiplesof3and5) {
  var testsPassed = 0;
  var totalTests = 1;
  testsPassed = (multiplesof3and5() === 234168);
  return (testsPassed / totalTests) * 100;
};

// in the future, tests.js needs to return feedback about
// which test passed and which failed