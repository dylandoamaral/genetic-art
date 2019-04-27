import * as imgUtils from './utils/image'
import Genetic from './genetic/genetic'
import { config, genConfig } from './genetic/config'

import css from './style.css'

function loadImage(url, callback) {
    var img = new Image();
    img.onload = () => {
        img = imgUtils.maxSizeImage(img, 600);
        let canvas = document.querySelector(".genetic-art .canvas_container .model");
        let ctx = canvas.getContext('2d');

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);

        callback(imgUtils.getImageData(img))
    };
    img.src = url
}

/**
 * Creation of HTML environmnent
 */
let area = document.querySelector(".genetic-art")
area.id = 'genetic'

let input = document.createElement('input')
input.type = 'file'
input.id = 'genetic_input'

let canvas_container = document.createElement('div')
canvas_container.className = 'canvas_container'
canvas_container.id = 'genetic_canvas_container'
let model = document.createElement('canvas')
model.id = 'genetic_canvas'
model.className = 'model'
canvas_container.appendChild(model)
let result = document.createElement('canvas')
result.id = 'genetic_canvas'
result.className = 'result'
canvas_container.appendChild(result)

let dashboard = document.createElement('div')
dashboard.id = 'genetic_dashboard'

let dashboard_left = document.createElement('div')
dashboard_left.id = 'genetic_dashboard_left'

let start = document.createElement('button')
start.id = 'genetic_button_start'
dashboard_left.appendChild(start)
let stop = document.createElement('button')
stop.id = 'genetic_button_stop_pressed'
dashboard_left.appendChild(stop)

let dashboard_right = document.createElement('div')
dashboard_right.id = 'genetic_dashboard_right'

let generation = document.createElement('span')
generation.id = 'genetic_text'
generation.innerText = 'generation : 0'
dashboard_right.appendChild(generation)

let score = document.createElement('span')
score.id = 'genetic_text'
score.innerText = 'score : 0.0000'
dashboard_right.appendChild(score)

dashboard.appendChild(dashboard_left)
dashboard.appendChild(dashboard_right)

area.appendChild(input)
area.appendChild(canvas_container)
area.appendChild(dashboard)

/**
 * Image loading
 */
var pause = true;
var loaded = false;

const allowedTypes = ['png', 'jpg', 'jpeg'];
var system = new Genetic(config, genConfig)

window.setInterval(() => {
    if(!pause && loaded){
        system.update();
        generation.innerText = 'generation : ' + system.generationCounter;
        score.innerText = 'score : ' + system.generation[system.options.phenotypePerGeneration - 1].similarityRatio.toFixed(4);
    }
}, 1)

input.addEventListener('change', function () {
    var file = this.files[0];
    var imgType = file.name.toLowerCase().split('.').pop()

    if (allowedTypes.indexOf(imgType) == -1) {
        alert("/!\\ Wrong format /!\\\nOnly png/jpg/jpeg are accepted");
        return;
    }

    var reader = new FileReader();
    
    reader.addEventListener('load', function() {
        loadImage(this.result, (pixelData) => {
            system.initialise(pixelData);
            loaded = true;
        })
    });
    
    reader.readAsDataURL(file);
});

start.onclick = () => {
    pause = false;
    start.id = 'genetic_button_start_pressed'
    stop.id = 'genetic_button_stop'
}

stop.onclick = () => {
    pause = true;
    start.id = 'genetic_button_start'
    stop.id = 'genetic_button_stop_pressed'
}