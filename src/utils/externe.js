/**
  * https://stackoverflow.com/questions/20339466/how-to-remove-duplicates-from-multidimensional-array
  * by Stephen
  * Get unique values from a multi dimensional array
  * @param {Array} array 
  * @returns {Array}
  */
export function multiDimensionalUnique(array) {
    var uniques = [];
    var itemsFound = {};
    for(var i = 0, l = array.length; i < l; i++) {
        var stringified = JSON.stringify(array[i]);
        if(itemsFound[stringified]) { continue; }
        uniques.push(array[i]);
        itemsFound[stringified] = true;
    }
    return uniques;
}

// min <= n <= max
export function randBtw(min, max) {
  return min + Math.floor(Math.random() * Math.floor(max + 1));
}