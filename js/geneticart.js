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
        let canvas = document.querySelector(".genetic .model canvas");
        let ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);

        let pixelData = ctx.getImageData(0, 0, img.width, img.height);

        callback(pixelData)
    };
    img.src = url
    img.crossOrigin = "Anonymous";
}

loadImage("./examples/animal.jpg", (pixelData) => {
    new Genetic(pixelData, {
        phenotypePerGeneration: 50,
        genotypePerPhenotype: 2500
    }, {
        minSize: 12,
        maxSize: 20,
        onlyOneShape: false
    })
})