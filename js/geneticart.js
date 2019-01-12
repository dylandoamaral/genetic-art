/*
 * File Created: Sunday, 21st October 2018 10:50:22 pm
 * Author: dylan DO AMARAL (do.amaral.dylan@gmail.com)
 * -----
 * Last Modified: Monday, 22nd October 2018 3:06:39 pm
 * Modified By: dylan DO AMARAL (do.amaral.dylan@gmail.com>)
 * -----
 * Copyright 2018 - dylandoamaral
 */
 
function loadImage(url, callback) {
    var img = new Image();
    img.onload = () => {
        img = maxSizeImage(img, 500);
        let canvas = document.querySelector(".genetic .model canvas");
        let ctx = canvas.getContext('2d');

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);

        callback(getImageData(img))
    };
    img.src = url
    img.crossOrigin = "Anonymous";
}

loadImage("./examples/heart.jpg", (pixelData) => {
    new Genetic(pixelData, {
        phenotypePerGeneration: 50,
        genotypePerPhenotype: 1600
    }, {
        minSize: 10,
        maxSize: 20,
        onlyOneShape: true,
        oneShape: 1
    })
})