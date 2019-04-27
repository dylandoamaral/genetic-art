import Genotype from './genotype'
import { randBtw } from '../utils/externe'

export default class Phenotype {
    /**
     * @param {ImageDate} modelData Data of the source image
     * @param {int} nGenotype Number of gene per phenotype
     * @param {Object} genomOptions Look genetic.genomOptions for more information
     */
    constructor(modelData, nGenotype, genomOptions) {
        this.nGenotype = nGenotype;
        this.adn = new Array();
        this.modelData = modelData;
        this.genomOptions = genomOptions;
    }

    /**
     * Generate random ADN
     */
    random() {
        for (let i = 0; i < this.nGenotype; i++) {
            let genotype = new Genotype(this.modelData, this.genomOptions);
            genotype.random();
            this.adn.push(genotype);
        }
    }

    /**
     * Melt two existing ADN
     * @param {Phenotype} father The first descendent of this phenotype
     * @param {Phenotype} mother The second descendent of this phenotype
     */
    inherite(father, mother) {
        for (let i = 0; i < this.nGenotype; i++) {
            let genotype = new Genotype(this.modelData, this.genomOptions);
            if (randBtw(0, 1) == 0) {
                genotype.inherite(father.adn[i])
            } else {
                genotype.inherite(mother.adn[i])
            }
            this.adn.push(genotype);
        }
    }

    /**
     * Show the ADN of this phenotype
     */
    print() {
        console.table(this.adn);
    }

    /**
     * Draw the ADN into a canvas and return his imageData
     * @returns {ImageData} imageData
     */
    generate() {
        return this.generateWithRatio(1);
    }

    /**
     * Draw the ADN into a canvas and return his imageData with a ratio
     * @param {Float} ratio Ratio which determine the size ratio of the image
     * @returns {ImageData} imageData
     */
    generateWithRatio(ratio) {
        let canvas = document.createElement('canvas');
        canvas.width = this.modelData.width;
        canvas.height = this.modelData.height;
        let ctx = canvas.getContext('2d');


        ctx.beginPath();
        ctx.rect(0, 0, this.modelData.width, this.modelData.height);
        ctx.fillStyle = "rgb(0, 0, 0)";
        ctx.fill();
        
        for (const genotype of this.adn) {
            const { x, y, width, height, color, shape } = genotype;
            ctx.beginPath();
            switch (shape) {
                case 0:
                    ctx.rect((x - width/2) * ratio, (y - height/2) * ratio, width * ratio * 2, height * ratio * 2);
                    break;
                case 1:
                    ctx.ellipse(x * ratio, y * ratio, width * ratio, height * ratio, 0, 0, 2 * Math.PI);
                    break;
            }
            ctx.fillStyle = `rgb(${color[0]},${color[1]},${color[2]})`;
            ctx.fill();
        }

        return ctx.getImageData(0, 0, this.modelData.width * ratio, this.modelData.height * ratio);
    }
}