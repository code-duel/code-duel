// this function returns a number from 0 to 100
// indicating what percentage of tests were passed
exports.testFunction = function(meowMix) {
	var testsPassed = 0;
	var totalTests = 5;

	testsPassed = (meowMix("Mustard and gravy") === "meowstrd nd grvy") +
								(meowMix("fruit loops") === "frt lps") +
								(meowMix("MmMmMm m")==="meowmeowmeowmeowmeowmeow meow") +
								(meowMix("!@#$m!") === "!@#$meow!") + 
								(meowMix("meow") === 'meoweow');
	return (testsPassed / totalTests) * 100;
};

// in the future, tests.js needs to return feedback about
// which test passed and which failed