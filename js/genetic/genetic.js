/*
 * File Created: Sunday, 21st October 2018 10:50:22 pm
 * Author: dylan DO AMARAL (do.amaral.dylan@gmail.com)
 * -----
 * Last Modified: Monday, 22nd October 2018 3:06:59 pm
 * Modified By: dylan DO AMARAL (do.amaral.dylan@gmail.com>)
 * -----
 * Copyright 2018 - dylandoamaral
 */

class Genetic {

    /**
     * 
     * @param {ImageDate} modelData Data of the source image
     * 
     * @param {Object} options 
     * @param {int} options.phenotypePerGeneration Number of phenotype("creature") per generation 
     * @param {int} options.genotypePerPhenotype Number of gene per phenotype 
     * 
     * @param {Object} genomOptions 
     * @param {int} genomOptions.minSize Minimum size of a shape
     * @param {int} genomOptions.maxSize Maximum size of a shape
     * @param {boolean} genomOptions.onlyOneShape Set true if you only want circle or square as shape
     * @param {int} genomOptions.oneShape Set the nature of the shape (0 = square, 1 = circle)
     * @param {boolean} genomOptions.onlySourceColors Set true if you only want color from the source (more faster)
     */
    constructor(modelData, options = {}, genomOptions = {}) {
        this.modelData = modelData;
        this.ratio = this.getRatio(300);

        this.minifyModelData = scaleImageData(this.modelData, this.ratio);

        this.options = Object.assign({}, {
            phenotypePerGeneration: 50, 
            genotypePerPhenotype: 1000
        }, options)

        this.genomOptions = Object.assign({}, {
            minWidth: 4,
            maxWidth: 16,
            minHeight: 4,
            maxHeight: 16,
            onlyOneShape: false,
            oneShape: 0,
            onlySourceColors: true,
            mutationRatio: 500
        }, genomOptions)

        if(this.genomOptions.onlySourceColors){
            this.genomOptions = Object.assign({}, {
                sourceColors: getAllUniquePixels(this.minifyModelData)
            }, this.genomOptions)
        }

        this.generation = new Array()
        this.generationCounter = 0;

        this.initialiseCanvas();

        for (let i = 0; i < this.options.phenotypePerGeneration; i++) {
            let phenotype = new Phenotype(this.modelData, this.options.genotypePerPhenotype, this.genomOptions);
            phenotype.random();
            this.generation = [...this.generation, phenotype]
        }

        for (let i = 0; i < this.options.phenotypePerGeneration; i++) {
            this.generation[i].similarityRatio = similarityBtwImageData(this.minifyModelData, scaleImageData(this.generation[i].generate(), this.ratio))
        }

        this.generation.sort((a, b) =>
            (a.similarityRatio - b.similarityRatio)) // Baddest to Best

        window.setInterval(() => {
            this.nextGeneration();
        }, 1)
    }

    /**
     * Determine the ratio for an image according to a max value
     * @param {number} max
     * @returns {number}
     */
    getRatio(max){
        let w = this.modelData.width;
        let h = this.modelData.height;
        let ratio = 1;

        if(w > h) ratio = max / w;
        else ratio = max / h;

        return ratio;
    }

    /**
     * Generate the next generation
     */
    nextGeneration() {
        let nextGeneration = [];
        this.generationCounter++;

        for (let i = 0; i < 1 * this.options.phenotypePerGeneration / 10; i++) {
            nextGeneration = [...nextGeneration, this.generation[this.options.phenotypePerGeneration - 1 - i]]
        }
        for (let i = 1 * this.options.phenotypePerGeneration / 10; i < 9 * this.options.phenotypePerGeneration / 10; i++) {
            nextGeneration = [...nextGeneration, this.makeChildren()]
        }
        for (let i = 9 * this.options.phenotypePerGeneration / 10; i < this.options.phenotypePerGeneration; i++) {
            let phenotype = new Phenotype(this.modelData, this.options.genotypePerPhenotype, this.genomOptions);
            phenotype.random();
            nextGeneration = [...nextGeneration, phenotype]
        }

        this.generation = nextGeneration;
 
        for (let i = 1 * this.options.phenotypePerGeneration / 10; i < this.options.phenotypePerGeneration; i++) {
            this.generation[i].similarityRatio = similarityBtwImageData(this.minifyModelData, scaleImageData(this.generation[i].generate(), this.ratio))
        }

        this.generation.sort((a, b) =>
            (a.similarityRatio - b.similarityRatio)) // Baddest to Best
        
        this.drawExample()

        let total = 0;
        for (let i = 0; i < this.options.phenotypePerGeneration; i++) {
            total += this.generation[i].similarityRatio
        }
        console.log("Generation n°" + this.generationCounter 
                    + " Best : " + this.generation[this.options.phenotypePerGeneration - 1].similarityRatio 
                    + ", total : " + total/this.options.phenotypePerGeneration);
    }

    /**
     * Create a children by melting to phenotype from the current generation
     * @returns {Phenotype} children
     */
    makeChildren() {
        let father = this.rankSelection();
        let mother = this.rankSelection();
        while(mother == father){
            mother = this.rankSelection(); // I don't want monoparent
        }

        let children = new Phenotype(this.modelData, this.options.genotypePerPhenotype, this.genomOptions);
        children.inherite(this.generation[father], this.generation[mother])
        return children;
    }

    /**
     * Select the winner between all phenotypes according to their rank
     * @returns {Phenotype} the winner
     */
    rankSelection() {
        var total = 0;
        var advantage = 2;
        for (let i = 0; i < this.options.phenotypePerGeneration; i++) total += i * advantage;
        var rand = randBtw(0, total)
        total = 0
        for (let i = 0; i < this.options.phenotypePerGeneration; i++) {
            total += i * advantage;
            if (rand <= total) {
                return i;
            }
        }
    }

    /**
     * Draw the best phenotypefrom the current generation
     */
    drawExample() {
        let phenotype = this.generation[this.options.phenotypePerGeneration - 1]; // The best
        let canvas = document.querySelector(".genetic .result canvas");
        let ctx = canvas.getContext('2d');
        ctx.putImageData(phenotype.generate(), 0, 0)
    }

    /**
     * Initialise the result canvas
     */
    initialiseCanvas(){
        let canvas = document.querySelector(".genetic .result canvas");
        canvas.width = this.modelData.width;
        canvas.height = this.modelData.height;
    }
}