import { randBtw } from '../utils/externe'

export default class Genotype{
    /**
     * @param {ImageDate} modelData Data of the source image
     * @param {Object} genomOptions Look genetic.genomOptions for more information
     */
    constructor(modelData, genomOptions){
        this.modelData = modelData;
        this.genomOptions = genomOptions;
    };

    /**
     * Take an existing gene and try to mutate it with a low factor
     * @param {Genotype} gen The descendent of this genotype
     */
    inherite(gen){
        if(randBtw(0, this.genomOptions.mutationRatio) != 0){
            this.x = gen.x
            this.y = gen.y
            this.width = gen.width;
            this.height = gen.height;
            this.color = gen.color;

            if(this.genomOptions.onlyOneShape){
                this.shape = this.genomOptions.oneShape;
            }else{
                this.shape = gen.shape;
            }  
        }else{
            this.random()
        }
    }

    /**
     * Generate random genotype
     */
    random(){
        this.x = randBtw(0, this.modelData.width)
        this.y = randBtw(0, this.modelData.height)
        this.width = randBtw(this.genomOptions.minWidth, this.genomOptions.maxWidth)
        this.height = randBtw(this.genomOptions.minHeight, this.genomOptions.maxHeight)

        if(this.genomOptions.onlySourceColors){
            this.color = this.genomOptions.sourceColors[randBtw(0, this.genomOptions.sourceColors.length - 1)]
        }else{
            this.color = [randBtw(0, 255), randBtw(0, 255), randBtw(0, 255)]
        }

        if(this.genomOptions.onlyOneShape){
            this.shape = this.genomOptions.oneShape;
        }else{
            this.shape = randBtw(0, 1)
        }  
    }

    /**
     * Show informations of this genotype
     */
    print(){
        console.log(`x :${this.x}, y ${this.y}, size : ${this.size}, color : ${this.color}, shape : ${this.shape}`);
    }
}