const green = 'rgb(0, 255, 0)'
const red = 'rgb(255, 0, 0)'
const black = 'rgb(0, 0, 0)'

class Person {
    constructor(x, y, state) {
        this.x = x;
        this.y = y;
        this.state = state;
    }

    getState(){
        return this.state;
    }

    setState(state){
        this.state = state;
    }
}

class Population {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.population = [];
        for (var i = 0; i < width; i++) {
            this.population.push(new Array());
            for (var j = 0; j < height; j++) {
                this.population[i].push(new Person(i, j, 's'));
            }
        }
    }


    getPopulation(){
        return this.population;
    }

    defaultInfect(number){
        for(var i = 0;  i < number; i++){
                this.population[this.generateRandomNumber(this.width)][this.generateRandomNumber(this.height)].
                    setState('i');
        }
    }

    generateRandomNumber(max){
        return Math.floor((Math.random() * max));
    }
}

function getPersonColor(state){
        if(state == 's'){
            return green;
        }
        if(state == 'i'){
            return red;
        }
    }

function draw() {
    var canvas = document.getElementById('canvas');
    if (canvas.getContext) {
        var pop = new Population(150, 150);
        var ctx = canvas.getContext('2d');
        pop.defaultInfect(20);
        for(var i = 0; i < 150; i++){
            for(var j = 0; j < 150; j++){
                ctx.fillStyle = getPersonColor(pop.getPopulation()[i][j].getState())
                ctx.fillRect(i*5, j*5, 5, 5);
            }
        }
    }
}
