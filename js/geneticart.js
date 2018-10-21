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

loadImage("heart.jpg", (pixelData) => {
    new Genetic(pixelData, {
        phenotypePerGeneration: 100,
        genotypePerPhenotype: 1500
    }, {
        minSize: 8,
        maxSize: 14,
        onlyOneShape: false
    })
})