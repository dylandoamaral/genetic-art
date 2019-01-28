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
        img = maxSizeImage(img, 600);
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

loadImage("./examples/rajang.jpg", (pixelData) => {
    new Genetic(pixelData, {
        phenotypePerGeneration: 20,
        genotypePerPhenotype: 5000
    }, {
        minWidth: 6,
        maxWidth: 12,
        minHeight: 6,
        maxHeight: 12,
        onlyOneShape: true,
		oneShape: 1
    })
})