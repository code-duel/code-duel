// this function returns a number from 0 to 100
// indicating what percentage of tests were passed
exports.testFunction = function(evenFib) {
	var testsPassed = 0;
	var totalTests = 5;
	testsPassed = (evenFib(10) === 44) +
								(evenFib(5) === 10) +
								(evenFib(2) === 2) +
								(evenFib(1) === 0) + 
								(evenFib(0) === 0);
	return (testsPassed / totalTests) * 100;
};

// in the future, tests.js needs to return feedback about
// which test passed and which failed