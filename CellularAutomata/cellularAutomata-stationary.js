const green = '#B8FEDD'
const red = 'rgb(255, 0, 0)'
const black = '#5E0000'

class Person {
    constructor(x, y, state) {
        this.x = x;
        this.y = y;
        this.state = state;
        this.nextState = state;
        this.immunizationPeriod = 0;
    }

    updateImmunizationPeriod() {
        if (this.immunizationPeriod == 0) {
            this.nextState = 's';
        }
        else {
            this.immunizationPeriod--;
        }
    }

    setImmunizationPeriod(period) {
        this.immunizationPeriod = period;
    }

    getState() {
        return this.state;
    }

    setNextState(state) {
        this.nextState = state;
    }

    updateState(){
        this.state = this.nextState;
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }
}

class World {
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
            this.population[randX][randY].setNextState('i')
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
        return rand < modelProbabilityForInfection
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
                    this.population[i][j].setNextState('i')
                }
                if (this.population[i][j].getState() == 'i' && this.willRecover(probabilityR)) {
                    this.population[i][j].setNextState('r')
                    this.population[i][j].setImmunizationPeriod(70)
                }
                if (this.population[i][j].getState() == 'r') {
                    this.population[i][j].updateImmunizationPeriod()
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
            pop.getPopulation()[i][j].updateState();
            canvasControl.fillStyle = getPersonColor(pop.getPopulation()[i][j].getState())
            canvasControl.beginPath()
            canvasControl.rect(i * 5, j * 5, 5, 5)
            canvasControl.fill()
            canvasControl.closePath()
        }
    }
}

function drawCityPopulation() {
    for (var i = 0; i < pop.getPopulationNumber(); i++) {
        canvasControl.fillStyle = getPersonColor(pop.getPopulation()[i].getState())
        canvasControl.beginPath()
        canvasControl.rect(pop.getPopulation()[i].getX(), pop.getPopulation()[i].getY(), 5, 5)
        canvasControl.fill()
        canvasControl.closePath()
    }
}


//PROBABILITIES - HAVE FUN WITH THEM:
var infectionProbability = 0.15
var removeProbability = 0.12

function loop() {//WOODEN
    setInterval(function () {
        pop.update(infectionProbability, 1, removeProbability)
        draw()
    }, 1000 / 60)
}

function loopAnim() {
    draw()
    pop.update(infectionProbability, 1, removeProbability)
    window.requestAnimationFrame(loopAnim)
}


function draw() {
    drawPopulation()
}

class CityPopulation {
    constructor(populationNumber, worldWidth, worldHeight, rangeOfInfection) {
        this.rangeOfInfection = rangeOfInfection
        this.world = {
            width: worldWidth,
            height: worldHeight
        }
        this.populationNumber = populationNumber
        this.infectedNumber = 0
        this.population = []
        this.infected = []
        for (var i = 0; i < populationNumber; i++) {
            this.population.push(new Person(this.generateRandomNumber(worldWidth), this.generateRandomNumber(worldHeight), 's'));
        }
    }

    getPopulationNumber() {
        return this.populationNumber
    }

    getPopulation() {
        return this.population;
    }

    defaultInfect(number) {
        this.infected = new Array(number);
        this.infectedNumber = number;
        for (var i = 0; i < number; i++) {
            var rand = this.generateRandomNumber(this.populationNumber)
            var individual = this.population[rand]
            if (this.infected.indexOf(individual) == -1) {
                this.population[rand].setState('i')
                this.infected[i] = this.population[rand]
            }
        }
    }

    isInRange(x1, y1, x2, y2) {
        return (Math.abs(x1 - x2) <= this.rangeOfInfection * 5 && Math.abs(y1 - y2) <= this.rangeOfInfection * 5)
    }

    getNeighbouringInfectedCells(x, y) {
        var infectedNeighbours = this.infected.filter(item => this.isInRange(x, y, item.getX(), item.getY()))
        return infectedNeighbours.length
    }

    willInfect(probability, surroundingCells) {
        var rand = Math.random()
        var modelProbabilityForInfection = 1 - Math.pow((1 - probability), surroundingCells)
        return rand < modelProbabilityForInfection
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
        for (var i = 0; i < this.populationNumber; i++) {
            var individual = this.population[i];
            var neighbours = this.getNeighbouringInfectedCells(individual.getX(), individual.getY())
            if (individual.getState() == 's' && this.willInfect(probability, neighbours)) {
                individual.setState('i')
                this.infected.push(individual)
            }
            if (individual.getState() == 'i' && this.willRecover(probabilityR)) {
                var index = this.infected.indexOf(individual)
                this.infected.splice(index, 1)
                individual.setState('r')
                individual.setImmunizationPeriod(40)
            }
            if (individual.getState() == 'r') {
                individual.updateImmunizationPeriod()
            }
        }
    }


    generateRandomNumber(max) {
        return Math.floor((Math.random() * max));
    }
}





var canvas = document.getElementById('canvas');
var canvasControl = canvas.getContext('2d');
//canvasControl.fillStyle = '#000000';
//canvasControl.fillRect(0, 0, canvas.width, canvas.height);
var pop = new World(150, 150);
var districts = []
pop.defaultInfect(5)
//loop();
window.requestAnimationFrame(loopAnim)


