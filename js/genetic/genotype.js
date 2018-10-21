/**
 * A genotype is an element of the new image generated with an algorithm
 */
class Genotype{
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
        if(randBtw(0, 10000) != 0)this.x = gen.x
        else this.x = randBtw(0, this.modelData.width)
        if(randBtw(0, 10000) != 0)this.y = gen.y
        else this.y = randBtw(0, this.modelData.height)
        if(randBtw(0, 10000) != 0)this.size = gen.size;
        else this.size = randBtw(this.genomOptions.minSize, this.genomOptions.maxSize)
        if(randBtw(0, 10000) != 0)this.color = gen.color;
        else this.color = [randBtw(0, 255), randBtw(0, 255), randBtw(0, 255)]
        if(this.genomOptions.onlyOneShape){
            this.shape = this.genomOptions.oneShape;
        }else{
            if(randBtw(0, 10000) != 0)this.shape = gen.shape;
            else this.shape = randBtw(0, 1)
        }  
    }

    /**
     * Generate random genotype
     */
    random(){
        this.x = randBtw(0, this.modelData.width)
        this.y = randBtw(0, this.modelData.height)
        this.size = randBtw(this.genomOptions.minSize, this.genomOptions.maxSize)
        this.color = [randBtw(0, 255), randBtw(0, 255), randBtw(0, 255)]
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

// min <= n <= max
function randBtw(min, max) {
    return min + Math.floor(Math.random() * Math.floor(max + 1));
}