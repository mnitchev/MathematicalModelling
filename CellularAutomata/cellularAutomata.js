const green = '#76A4FB'
const red = 'rgb(255, 0, 0)'
const black = '#5E0000'
const mapCoordinates = [{ x: -1, y: -1 }, { x: 0, y: -1 }, { x: 1, y: -1 }, { x: -1, y: 0 }, {x:0,y:0}, { x: 1, y: 0 }, { x: -1, y: 1 }, { x: 0, y: 1 }, { x: 1, y: 1 }]

class Area {
    constructor(x, y, side) {
        this.x = x
        this.y = y
        this.side = side
    }
    getCenter() {
        return {
            x: this.x + this.side / 2,
            y: this.y + this.side / 2
        }
    }
}

class Person {
    constructor(x, y, state, area) {
        this.x = x
        this.y = y
        this.state = state
        this.nextState = state
        this.immunizationPeriod = 0
        this.area = area
        this.movementProbabilityVector = [8]
    }

    updateImmunizationPeriod() {
        if (this.immunizationPeriod == 0) {
            this.nextState = 's'
        }
        else {
            this.immunizationPeriod--
        }
    }



    move(x, y) {
        this.x += x
        this.y += y
    }

    getDestination() {
        return this.area.getCenter()
    }

    setArea(area) {
        this.area = area
    }

    setImmunizationPeriod(period) {
        this.immunizationPeriod = period
    }

    getState() {
        return this.state
    }

    setNextState(state) {
        this.nextState = state
    }

    updateState() {
        this.state = this.nextState
    }

    getX() {
        return this.x
    }

    getY() {
        return this.y
    }

    isEmpty() {
        return false
    }
}

class EmptySpace {

    isEmpty() {
        return true;
    }
}

class World {
    constructor(width, height, areas) {
        this.width = width
        this.height = height
        this.population = []
        this.areas = areas
        for (var i = 0; i < height; i++) {
            this.population.push(new Array())
            for (var j = 0; j < width; j++) {
                this.population[i].push(new EmptySpace())
            }
        }
    }

    populateAreas(probabilityToSpawn) {
        var _this = this;
        this.areas.forEach(function (area) {
            for (var i = area.y; i < area.y + area.side; i++) {
                for (var j = area.x; j < area.x + area.side; j++) {
                    var willPopulate = _this.generateRandomNumber(100)
                    if (willPopulate < probabilityToSpawn) {
                        _this.population[i][j] = new Person(j, i, 's', BlackHole)
                    }
                }
            }
        })
    }

    getRandomArea() {
        return this.areas[this.generateRandomNumber(this.areas.length - 1)]
    }





    getPopulation() {
        return this.population;
    }

    defaultInfect(number) {
        var populated = [].concat.apply([], this.population).filter(item => !item.isEmpty());
        this.infected = new Array(number);
        for (var i = 0; i < number; i++) {
            var rand = this.generateRandomNumber(populated.length)
            populated[rand].setNextState('i')
            this.infected.push(populated[rand])
        }
    }

    isInWorld(x, y) {
        if (x < 0 || y < 0 || x > this.width - 1 || y > this.height - 1) return false
        return true
    }

    getNeighbouringInfectedCells(y, x, radius) {
        var infNeighbours = 0
        for (var i = -radius; i <= radius; i++) {
            for (var j = -radius; j <= radius; j++) {
                if (this.isInWorld(x + j, y + i) && (i != 0 || j != 0)) {
                    if (!this.population[y + i][x + j].isEmpty() && this.population[y + i][x + j].getState() == 'i') {
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

    getProbabilities(agent) {
        var distance = Math.sqrt(Math.pow(agent.getDestination().x - agent.getX(), 2) + Math.pow(agent.getDestination().y - agent.getY(), 2))
        var vector = []
        for (var i = -1; i <= 1; i++) {
            for (var j = -1; j <= 1; j++) {
                if (this.isInWorld(agent.getX() + j, agent.getY() + i) && (i != 0 || j != 0) && this.population[agent.getY() + i][agent.getX() + j].isEmpty()) {
                    var surroundingCellsDistance = Math.sqrt(Math.pow(agent.getDestination().x - agent.getX() + j, 2) + Math.pow(agent.getDestination().y - agent.getY() + i, 2))
                    vector.push(surroundingCellsDistance)
                }
                else {
                    vector.push(0)
                }
            }
        }
        var min = Math.min(...vector.filter(item => item != 0)) - 1
        var newVector = vector.map(item => (item == 0 ? 0 : item-min))
        var sum = (newVector.reduce((a, b) => a + b, 0))
        if(sum == 0){
            return newVector
        }
        return newVector.map(item =>(item / sum))
    }

    move(agent) {
        var distance = this.getProbabilities(agent)
        var rand = Math.random()
        var leftRange = 0
        var moveTo = mapCoordinates[4]
        for (var i = 0; i < 9; i++) {
            if (rand > leftRange && rand < distance[i] + leftRange) {
                moveTo = mapCoordinates[i]
                break;
            }
            else {
                leftRange += distance[i]
            }
        }
        this.population[agent.getY()][agent.getX()] = this.population[agent.getY() + moveTo.y][agent.getX() + moveTo.x]
        agent.move(moveTo.x, moveTo.y)
        this.population[agent.getY()][agent.getX()] = agent

    }

    update(probability, radius, probabilityR, immunizationPeriod) {
        for (var i = 0; i < 150; i++) {
            for (var j = 0; j < 300; j++) {
                var agent = this.population[i][j]
                if (!agent.isEmpty()) {
                    var neighbours = this.getNeighbouringInfectedCells(i, j, radius)
                    this.move(agent)
                    if (agent.getState() == 's' && this.willInfect(probability, neighbours)) {
                        agent.setNextState('i')
                    }
                    if (agent.getState() == 'i' && this.willRecover(probabilityR)) {
                        agent.setNextState('r')
                        agent.setImmunizationPeriod(immunizationPeriod)
                    }
                    if (agent.getState() == 'r') {
                        agent.updateImmunizationPeriod()
                    }
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
        for (var j = 0; j < 300; j++) {
            var agent = Azeroth.getPopulation()[i][j];
            if (!agent.isEmpty()) {

                agent.updateState()
                canvasControl.fillStyle = getPersonColor(agent.getState())

                canvasControl.beginPath()
                canvasControl.rect(j * 5, i * 5, 5, 5)
                canvasControl.fill()
                canvasControl.closePath()
            }
        }
    }
}


//PROBABILITIES - HAVE FUN WITH THEM:
var infectionProbability = 0.15
var removeProbability = 0.12

function loop() {//WOODEN
    setInterval(function () {
        Azeroth.update(infectionProbability, 2, removeProbability, 40)
        draw()
    }, 1000 / 30)
}

function loopAnim() {
    draw()
    Azeroth.update(infectionProbability, 2, removeProbability, 40)
    window.requestAnimationFrame(loopAnim)
}


function draw() {
    canvasControl.clearRect(0, 0, canvas.width, canvas.height)
    canvasControl.fillStyle = '#000000';
    canvasControl.fillRect(0, 0, canvas.width, canvas.height);
    drawPopulation()
}



var canvas = document.getElementById('canvas');
var canvasControl = canvas.getContext('2d');
canvasControl.fillStyle = '#000000';
canvasControl.fillRect(0, 0, canvas.width, canvas.height);
var Northrend = new Area(125, 10, 35);
var Kalimdor = new Area(10, 60, 50);
var Pandaria = new Area(130, 100, 30);
var EasternKingdoms = new Area(210, 60, 45);
var BlackHole = new Area(150, 75, 1);
var Azeroth = new World(300, 150, [Northrend, Kalimdor, Pandaria, EasternKingdoms]);
Azeroth.populateAreas(60)
Azeroth.defaultInfect(10)
//loop();
window.requestAnimationFrame(loopAnim)


