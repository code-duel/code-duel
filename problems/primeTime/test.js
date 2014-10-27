// this function returns a number from 0 to 100
// indicating what percentage of tests were passed
exports.testFunction = function(primeTime) {
	var testsPassed = 0;
	var totalTests = 5;

    var checkAry = function(prime, actualAry, length){  
      var result = true;
      if(prime.length !== length){
      	return !result;
      }
      
      prime.forEach(function(itm, index, collection){
         if(itm !== actualAry[index]) {
         	result = false;
         }
      });
      return result;
    }

	testsPassed = (checkAry(primeTime(1), [2], 1)) +
								(checkAry(primeTime(4), [2,3,5,7], 4)) +
								(checkAry(primeTime(10), [2,3,5,7,11,13,17,19,23,29], 10)) +
								(checkAry(primeTime(6), [2,3,5,7,11,13], 6)) + 
								(checkAry(primeTime(16), [2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59], 16));
	return (testsPassed / totalTests) * 100;
};

// in the future, tests.js needs to return feedback about
// which test passed and which failed
