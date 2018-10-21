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
     */
    constructor(modelData, options = {}, genomOptions = {}) {
        this.modelData = modelData;

        this.options = Object.assign({}, {
            phenotypePerGeneration: 50,
            genotypePerPhenotype: 1000
        }, options)

        this.genomOptions = Object.assign({}, {
            minSize: 2,
            maxSize: 4,
            onlyOneShape: false,
            oneShape: 0
        }, genomOptions)

        this.generation = new Array()

        this.initialiseCanvas();

        for (let i = 0; i < this.options.phenotypePerGeneration; i++) {
            let phenotype = new Phenotype(this.modelData, this.options.genotypePerPhenotype, this.genomOptions);
            phenotype.random();
            this.generation = [...this.generation, phenotype]
        }

        this.generation.sort((a, b) =>
            (a.similarityRatio ? a.similarityRatio : a.similarity()) - (b.similarityRatio ? b.similarityRatio : b.similarity())) // Baddest to Best

        window.setInterval(() => {
            this.nextGeneration();
        }, 100)
    }

    /**
     * Generate the next generation
     */
    nextGeneration() {
        let nextGeneration = [];

        for (let i = 0; i < 3 * this.options.phenotypePerGeneration / 4; i++) {
            nextGeneration = [...nextGeneration, this.makeChildren()]
        }
        for (let i = 3 * this.options.phenotypePerGeneration / 4; i < this.options.phenotypePerGeneration; i++) {
            let phenotype = new Phenotype(this.modelData, this.options.genotypePerPhenotype, this.genomOptions);
            phenotype.random();
            nextGeneration = [...nextGeneration, phenotype]
        }

        this.generation = nextGeneration;
 
        this.generation.sort((a, b) =>
            (a.similarityRatio ? a.similarityRatio : a.similarity()) - (b.similarityRatio ? b.similarityRatio : b.similarity())) // Baddest to Best
        
        this.drawExample()

        let total = 0;
        for (let i = 0; i < this.options.phenotypePerGeneration; i++) {
            total += this.generation[i].similarityRatio
        }
        console.log(this.generation[this.options.phenotypePerGeneration - 1].similarityRatio + ", total : " + total/this.options.phenotypePerGeneration);
    }

    /**
     * Create a children by melting to phenotype from the current generation
     * @returns {Phenotype} children
     */
    makeChildren() {
        let father = this.rankSelection();
        let mother = this.rankSelection();
        let children = new Phenotype(this.modelData, this.options.genotypePerPhenotype, this.genomOptions);
        children.inherite(father, mother)
        return children;
    }

    /**
     * Select the winner between all phenotypes according to their rank
     * @returns {Phenotype} the winner
     */
    rankSelection() {
        var total = 0;
        for (let i = 0; i < this.options.phenotypePerGeneration; i++) total += i * i;
        var rand = randBtw(0, total)
        total = 0
        for (let i = 0; i < this.options.phenotypePerGeneration; i++) {
            total += i * i;
            if (rand <= total) {
                return this.generation[i];
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
        ctx.putImageData(new ImageData(phenotype.pixelData(), this.modelData.width, this.modelData.height), 0, 0)
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