import Phenotype from './phenotype'
import * as imgUtils from '../utils/image'
import { randBtw } from '../utils/externe'

export default class Genetic {
    /**
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
    constructor(options = {}, genomOptions = {}) {
        this.options = Object.assign({}, {
            phenotypePerGeneration: 50, 
            genotypePerPhenotype: 1000,
            repartition: [0.1, 0.8, 0.1]
        }, options)

        if(this.options.repartition.reduce((total, sum) => total + sum) != 1) {
            console.log("/!\\ sum of repartition should be equal to 1")
            this.options.repartition = [0.1, 0.8, 0.1]
        }

        this.genomOptions = Object.assign({}, {
            minWidth: 4,
            maxWidth: 16,
            minHeight: 4,
            maxHeight: 16,
            onlyOneShape: false,
            oneShape: 0,
            onlySourceColors: true,
            mutationRatio: 500,
            uniquePixels: true
        }, genomOptions)
    }

    initialise(modelData){
        this.modelData = modelData;
        this.ratio = this.getRatio(150);

        this.minifyModelData = imgUtils.scaleImageData(this.modelData, this.ratio);

        if(this.genomOptions.onlySourceColors){
            if(this.genomOptions.uniquePixels){
                this.genomOptions.sourceColors = imgUtils.getAllUniquePixels(this.minifyModelData)
            }else{
                this.genomOptions.sourceColors = imgUtils.getAllPixels(this.minifyModelData)
            }
        }

        this.generation = new Array()
        this.generationCounter = 0;

        this.initialiseCanvas();

        for (let i = 0; i < this.options.phenotypePerGeneration; i++) {
            let phenotype = new Phenotype(this.minifyModelData, this.options.genotypePerPhenotype, this.genomOptions);
            phenotype.random();
            this.generation = [...this.generation, phenotype]
        }

        for (let i = 0; i < this.options.phenotypePerGeneration; i++) {
            this.generation[i].similarityRatio = imgUtils.similarityBtwImageData(this.minifyModelData, this.generation[i].generate())
        }

        this.generation.sort((a, b) =>
            (a.similarityRatio - b.similarityRatio)) // Baddest to Best

        this.ready = true
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

    update(){
        if(!this.ready) return;
        this.nextGeneration();
    }

    /**
     * Generate the next generation
     */
    nextGeneration() {
        let nextGeneration = [];
        this.generationCounter++;

        const survivors = Math.round(this.options.phenotypePerGeneration * this.options.repartition[0]);
        const childrens = Math.round(this.options.phenotypePerGeneration * this.options.repartition[1]);
        const randoms = Math.round(this.options.phenotypePerGeneration * this.options.repartition[2]);

        for (let i = 0; i < survivors; i++) {
            nextGeneration = [...nextGeneration, this.generation[this.options.phenotypePerGeneration - 1 - i]]
        }

        for (let i = survivors; i < survivors + childrens; i++) {
            nextGeneration = [...nextGeneration, this.makeChildren()]
        }
        for (let i = survivors + childrens; i < this.options.phenotypePerGeneration; i++) {
            let phenotype = new Phenotype(this.modelData, this.options.genotypePerPhenotype, this.genomOptions);
            phenotype.random();
            nextGeneration = [...nextGeneration, phenotype]
        }

        this.generation = nextGeneration;
 
        for (let i = survivors; i < this.options.phenotypePerGeneration; i++) {
            this.generation[i].similarityRatio = imgUtils.similarityBtwImageData(this.minifyModelData, this.generation[i].generate())
        }

        this.generation.sort((a, b) =>
            (a.similarityRatio - b.similarityRatio)) // Baddest to Best
        
        this.drawExample()

        let total = 0;
        for (let i = 0; i < this.options.phenotypePerGeneration; i++) {
            total += this.generation[i].similarityRatio
        }
        /** 
        console.log("Generation n°" + this.generationCounter 
                    + " Best : " + this.generation[this.options.phenotypePerGeneration - 1].similarityRatio 
                    + ", total : " + total/this.options.phenotypePerGeneration);
        */
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
        var advantage = 1;
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
        let canvas = document.querySelector(".genetic-art .canvas_container .result");
        let ctx = canvas.getContext('2d');
        ctx.putImageData(phenotype.generateWithRatio(1 / this.ratio), 0, 0)
    }

    /**
     * Initialise the result canvas
     */
    initialiseCanvas(){
        let canvas = document.querySelector(".genetic-art .canvas_container .result");
        canvas.width = this.modelData.width;
        canvas.height = this.modelData.height;
    }
}