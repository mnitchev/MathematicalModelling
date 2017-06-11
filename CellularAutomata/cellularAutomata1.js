const green = '#B8FEDD'
const red = 'rgb(255, 0, 0)'
const black = '#5E0000'

class Person {
    constructor(x, y, state) {
        this.x = x;
        this.y = y;
        this.state = state;
    }

    getState() {
        return this.state;
    }

    setState(state) {
        this.state = state;
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }
}

class Population {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.population = [];
        this.infected = [];
        for (var i = 0; i < width; i++) {
            this.population.push(new Array());
            for (var j = 0; j < height; j++) {
                this.population[i].push(new Person(i, j, 's'));
            }
        }
    }


    getPopulation() {
        return this.population;
    }

    defaultInfect(number) {
        this.infected = new Array(number);
        for (var i = 0; i < number; i++) {
            var randX = this.generateRandomNumber(this.width)
            var randY = this.generateRandomNumber(this.height)
            this.population[randX][randY].setState('i')
            this.infected[i] = this.population[randX][randY]
        }
    }

    isInWorld(x, y) {
        if (x < 0 || y < 0 || x > this.width - 1 || y > this.height - 1) return false
        return true
    }

    getNeighbouringInfectedCells(x, y) {
        var infNeighbours = 0
        for (var i = -1; i <= 1; i++) {
            for (var j = -1; j <= 1; j++) {
                if (this.isInWorld(x + i, y + j) && (i != 0 || j != 0)) {
                    if (this.population[x + i][y + j].getState() == 'i') {
                        infNeighbours++
                    }
                }
            }
        }
        return infNeighbours
    }

    willInfect(probability, surroundingCells) {
        var rand = Math.random()
        var modelProbabilityForInfection = 1 - Math.pow((1 - probability), surroundingCells)
        if (rand < modelProbabilityForInfection) {
            return true
        }
        return false
    }

    willRecover(probability) {
        var rand = Math.random()
        if (rand < probability) {
            return true
        }
        return false
    }

    getNumberOfSurroundingCells(radius) {
        return Math.pow((2 * radius + 1), 2) - 1
    }

    update(probability, radius, probabilityR) {
        for (var i = 0; i < 150; i++) {
            for (var j = 0; j < 150; j++) {
                var neighbours = this.getNeighbouringInfectedCells(i, j)
                if (this.population[i][j].getState() == 's' && this.willInfect(probability, neighbours)) {
                    this.population[i][j].setState('i');
                }
                if (this.population[i][j].getState() == 'i' && this.willRecover(probabilityR)) {
                    this.population[i][j].setState('r');
                }
            }
        }
    }


    generateRandomNumber(max) {
        return Math.floor((Math.random() * max));
    }
}


function getPersonColor(state) {
    if (state == 's') {
        return green;
    }
    if (state == 'i') {
        return red;
    }
    if (state == 'r') {
        return black;
    }
}



function drawPopulation() {
    for (var i = 0; i < 150; i++) {
        for (var j = 0; j < 150; j++) {
            canvasControl.fillStyle = getPersonColor(pop.getPopulation()[i][j].getState())
            canvasControl.beginPath()
            canvasControl.rect(i * 5, j * 5, 5, 5)
            canvasControl.fill()
            canvasControl.closePath()
        }
    }
}


//PROBABILITIES - HAVE FUN WITH THEM:
var infectionProbability = 0.15
var removeProbability = 0.12

function loop() {//ДЪРВЕНО
    setInterval(function () {
        pop.update(infectionProbability, 1, removeProbability)
        draw()
    }, 1000 / 60)
}

function loopAnim() {
    pop.update(infectionProbability, 1, removeProbability)
    draw()
    window.requestAnimationFrame(loopAnim)
}


function draw() {
    drawPopulation()
}

var canvas = document.getElementById('canvas');
var canvasControl = canvas.getContext('2d');
var pop = new Population(150, 150);
pop.defaultInfect(6)
//loop();
window.requestAnimationFrame(loopAnim)



