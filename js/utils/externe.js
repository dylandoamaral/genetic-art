/*
 * File Created: Thursday, 10th January 2019 4:41:10 pm
 * Author: dylan DO AMARAL (do.amaral.dylan@gmail.com)
 * -----
 * Copyright 2019 - dylandoamaral
 */

 /**
  * https://stackoverflow.com/questions/20339466/how-to-remove-duplicates-from-multidimensional-array
  * by Stephen
  * Get unique values from a multi dimensional array
  * @param {Array} array 
  * @returns {Array}
  */
function multiDimensionalUnique(array) {
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