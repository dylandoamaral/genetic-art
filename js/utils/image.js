/*
 * File Created: Saturday, 5th January 2019 10:21:49 pm
 * Author: dylan DO AMARAL (do.amaral.dylan@gmail.com)
 * -----
 * Copyright 2019 - dylandoamaral
 */

/**
 * Rescale an image by a ratio
 * @param {Image} image 
 * @param {number} ratio 
 * @returns {Image}
 */
function scaleImage(image, ratio){
    let scaled = image;
	
    scaled.width = image.width * ratio;
    scaled.height = image.height * ratio;
	
    return scaled;
}

/**
 * Rescale an imageData by a ratio
 * @param {ImageData} imageData 
 * @param {number} ratio 
 * @returns {ImageData}
 */
function scaleImageData(imageData, ratio){
    let canvas = document.createElement('canvas');
    let context = canvas.getContext('2d');

    canvas.width = imageData.width;
    canvas.height = imageData.height;

    context.putImageData(imageData, 0, 0);

    let scaledCanvas = document.createElement('canvas');
    let scaledContext = scaledCanvas.getContext('2d');

    scaledCanvas.width = imageData.width * ratio;
    scaledCanvas.height = imageData.height * ratio;
    scaledContext.scale(ratio, ratio);
    scaledContext.drawImage(canvas, 0, 0);

    return scaledContext.getImageData(0, 0, scaledCanvas.width, scaledCanvas.height);
}

/**
 * Rescale an image according to a maximum value
 * @param {Image} image 
 * @param {Number} max the maximum place available for that image
 * @returns {Image}
 */
function maxSizeImage(image, max){
    if(image.width < max && image.height < max) return image;

    let scaled = image;

    if(scaled.width > scaled.height){
        scaled = scaleImage(scaled, max / scaled.width);
    }else{
        scaled = scaleImage(scaled, max / scaled.height);
    }

    return scaled;
}

/**
 * Rescale an imageData according to a maximum value
 * @param {ImageData} imageData 
 * @param {Number} max the maximum place available for that image
 * @returns {ImageData}
 */
function maxSizeImageData(imageData, max){
    if(imageData.width < max && imageData.height < max) return imageData;

    let scaled = imageData;

    if(scaled.width > scaled.height){
        scaled = scaleImageData(scaled, max / scaled.width);
    }else{
        scaled = scaleImageData(scaled, max / scaled.height);
    }

    return scaled;
}

/**
 * get imageData from an image
 * @param {Image} image 
 * @returns {ImageData}
 */
function getImageData(image){
    let canvas = document.createElement('canvas');
    let context = canvas.getContext('2d');

    canvas.width = image.width;
    canvas.height = image.height;

    context.drawImage(image, 0, 0, image.width, image.height);

    return context.getImageData(0, 0, image.width, image.height);
}

/**
 * 
 * @param {ImageData} imageData 
 * @param {number} x 
 * @param {number} y 
 * @param {Array} v (r, g, b, a)
 * @returns {ImageData}
 */
function setPixel(imageData, x, y, v){
    let changed = imageData;
    let index = (x + y * imageData.width) * 4;

    changed.data[index    ] = v[0];
    changed.data[index + 1] = v[1];
    changed.data[index + 2] = v[2];
    changed.data[index + 3] = v[3];

    return changed;
}

/**
 * get pixel array [r, g, b, a] from an imageData
 * @param {ImageData} imageData 
 * @param {number} x 
 * @param {number} y 
 * @returns {Array}
 */
function getPixel(imageData, x, y){
    let index = (x + y * imageData.width) * 4;

    let r = imageData.data[index    ];
    let g = imageData.data[index + 1];
    let b = imageData.data[index + 2];
    let a = imageData.data[index + 3];

    return [r, g, b, a]
}

/**
 * Get all pixels from an image data
 * @param {ImageData} imageData 
 * @returns {Array}
 */
function getAllPixels(imageData){
    pixels = [];

    for (let x = 0; x < imageData.width; x++) {
        for (let y = 0; y < imageData.height; y++) {
            pixels.push(getPixel(imageData, x, y));
        }
    }

    return pixels;
}

/**
 * Get all unique pixels from an image data
 * (Need externe.js to work)
 * @param {ImageData} imageData 
 * @returns {Array}
 */
function getAllUniquePixels(imageData){
    return multiDimensionalUnique(getAllPixels(imageData));
}

/**
 * return a similarity factor (from 0 to 1) between two image data
 * @param {ImageData} left 
 * @param {ImageData} right 
 * @param {boolean} strict If true then only small differences improve the similarity
 * @param {number} strictThreshold Treshold which determine if a pixel influe similarity or not
 * @returns {number}
 */
function similarityBtwImageData(left, right, strict = false, strictThreshold = 50){
    let difference = 0;
    let similarityResult = 0;
    
    let pixels = left.data.length / 4;
    let pixelLeft  = 0;
    let pixelRight = 0;

    for (let x = 0; x < left.width; x++) {
        for (let y = 0; y < left.height; y++) {
            pixelLeft = getPixel(left , x, y);
            pixelRight = getPixel(right, x, y);
            difference = (Math.abs(pixelLeft[0] - pixelRight[0]) + 
                          Math.abs(pixelLeft[1] - pixelRight[1]) + 
                          Math.abs(pixelLeft[2] - pixelRight[2])) / 3
            if(strict){
                if(difference < strictThreshold){
                    similarityResult += 256 - (difference * 256) / strictThreshold
                }
            }else{
                similarityResult += 256 - difference;
            }
        }
    }
	
    similarityResult /= pixels
    similarityResult /= 256
	
    return similarityResult
}

/**
 * transform a colored image in black and white
 * @param {ImageData} imageData 
 * @returns {ImageData}
 */
function greyScale(imageData){
    let changed = imageData;

    for (let x = 0; x < imageData.width; x++) {
        for (let y = 0; y < imageData.height; y++) {
            pixel = getPixel(changed, x, y);
            grey = (pixel[0] + pixel[1] + pixel[2]) / 3;
            newPixel = [grey, grey, grey, pixel[3]];
            changed = setPixel(changed, x, y, newPixel);
        }
    }

    return changed;
}

/**
 * reverse an image horizontaly
 * @param {ImageData} imageData 
 * @returns {ImageData}
 */
function reverseHorizontalyImageData(imageData){
    let changed = imageData;

    for (let x = 0; x < imageData.width / 2; x++) {
        for (let y = 0; y < imageData.height; y++) {
            pixel = getPixel(changed, x, y); // pixel at x
            lexip = getPixel(changed, imageData.width - 1 - x, y); // pixel at opposite of x
            
            changed = setPixel(changed, imageData.width - 1 - x, y, pixel);
            changed = setPixel(changed, x, y, lexip);
        }
    }

    return changed;
}

/**
 * reverse an image verticaly
 * @param {ImageData} imageData 
 * @returns {ImageData}
 */
function reverseVerticalyImageData(imageData){
    let changed = imageData;

    for (let x = 0; x < imageData.width; x++) {
        for (let y = 0; y < imageData.height / 2; y++) {
            pixel = getPixel(changed, x, y); // pixel at y
            lexip = getPixel(changed, x, imageData.height - 1 -  y); // pixel at opposite of y
            
            changed = setPixel(changed, x, imageData.height - 1 - y, pixel);
            changed = setPixel(changed, x, y, lexip);
        }
    }

    return changed;
}