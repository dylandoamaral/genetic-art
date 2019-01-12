/*
 * File Created: Sunday, 21st October 2018 10:50:22 pm
 * Author: dylan DO AMARAL (do.amaral.dylan@gmail.com)
 * -----
 * Last Modified: Monday, 22nd October 2018 3:06:09 pm
 * Modified By: dylan DO AMARAL (do.amaral.dylan@gmail.com>)
 * -----
 * Copyright 2018 - dylandoamaral
 */

 class Phenotype {
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
        let canvas = document.createElement('canvas');
        canvas.width = this.modelData.width;
        canvas.height = this.modelData.height;
        let ctx = canvas.getContext('2d');


        ctx.beginPath();
        ctx.rect(0, 0, this.modelData.width, this.modelData.height);
        ctx.fillStyle = "rgb(0, 0, 0)";
        ctx.fill();

        for (const genotype of this.adn) {
            const { x, y, size, color, shape } = genotype;
            ctx.beginPath();
            switch (shape) {
                case 0:
                    ctx.rect(x + size/2, y + size/2, size, size);
                    break;
                case 1:
                    ctx.arc(x, y, size/2, 0, 2 * Math.PI);
                    break;
            }
            ctx.fillStyle = `rgb(${color[0]},${color[1]},${color[2]})`;
            ctx.fill();
        }

        return ctx.getImageData(0, 0, this.modelData.width, this.modelData.height);
    }
}