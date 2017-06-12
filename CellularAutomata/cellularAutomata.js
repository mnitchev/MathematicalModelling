const susceptibleColor = '#42f4a1'
const infectedColor = '#ff2911'
const removedColor = '#631d14'
const backgroundColor = '#211f1f'
const mapCoordinates = [{ x: -1, y: -1 }, { x: 0, y: -1 }, { x: 1, y: -1 }, { x: -1, y: 0 }, { x: 0, y: 0 }, { x: 1, y: 0 }, { x: -1, y: 1 }, { x: 0, y: 1 }, { x: 1, y: 1 }]

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

    isInArea(){
        return Math.sqrt(Math.pow(this.x - this.area.getCenter().x, 2) + Math.pow(this.y - this.area.getCenter().y, 2)) < 15
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
    constructor(width, height, areas, diseaseConfiguration) {
        this.width = width
        this.height = height
        this.population = []
        this.areas = areas
        this.updateDir = 0
        this.infectionProbability = diseaseConfiguration.infectionProbability
        this.infectRadius = diseaseConfiguration.infectRadius
        this.recoverProbability = diseaseConfiguration.recoverProbability
        this.immunizationPeriod = diseaseConfiguration.immunizationPeriod
        this.probabilityToMove = diseaseConfiguration.probabilityToMove
        for (var i = 0; i < height; i++) {
            this.population.push(new Array())
            for (var j = 0; j < width; j++) {
                this.population[i].push(new EmptySpace())
            }
        }
    }

    populateAreas(probabilityToSpawn) {
        var _this = this;
        this.areas.forEach(area => {
            for (var i = area.y; i < area.y + area.side; i++) {
                for (var j = area.x; j < area.x + area.side; j++) {
                    var willPopulate = this.generateRandomNumber(100)
                    if (willPopulate < probabilityToSpawn) {
                        this.population[i][j] = new Person(j, i, 's', area)
                    }
                }
            }
        })
    }

    getRandomArea() {
        return this.areas[this.generateRandomNumber(this.areas.length)]
    }

    changeDir(){
      if(this.updateDir == 4){
        this.updateDir = 0
      } else{
        this.updateDir++
      }
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

    getNeighbouringInfectedCells(y, x) {
        var infNeighbours = 0
        for (var i = -this.infectRadius; i <= this.infectRadius; i++) {
            for (var j = -this.infectRadius; j <= this.infectRadius; j++) {
                if (this.isInWorld(x + j, y + i) && (i != 0 || j != 0)) {
                    if (!this.population[y + i][x + j].isEmpty() && this.population[y + i][x + j].getState() == 'i') {
                        infNeighbours++
                    }
                }
            }
        }
        return infNeighbours
    }

    willInfect(surroundingCells) {
        var rand = Math.random()
        var modelProbabilityForInfection = 1 - Math.pow((1 - this.infectionProbability), surroundingCells)
        return rand < modelProbabilityForInfection
    }

    willRecover() {
        var rand = Math.random()
        if (rand < this.recoverProbability) {
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
                if (this.isInWorld(agent.getX() + j, agent.getY() + i) && ((j == 0 && i ==0) || this.population[agent.getY() + i][agent.getX() + j].isEmpty())) {
                    var surroundingCellsDistance = Math.sqrt(Math.pow(agent.getDestination().x - agent.getX() + j, 2) + Math.pow(agent.getDestination().y - agent.getY() + i, 2))
                    vector.push(surroundingCellsDistance)
                }
                else {
                    vector.push(0)
                }
            }
        }
        var min = Math.min(...vector.filter(item => item != 0)) - 1
        var newVector = vector.map(item => (item == 0 ? 0 : item - min))
        var sum = (newVector.reduce((a, b) => a + b, 0))
        if (sum == 0) {
            return newVector
        }
        return newVector.map(item => (item / sum))
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

    willTransfer(){
        return Math.random() < this.probabilityToMove
    }

    update(){
        switch (this.updateDir) {
          case 0:
            this.updateLeftUp();
            break;
          case 1:
            this.updateRightUp();
            break;
          case 2:
            this.updateRightDown()
            break;
          case 3:
            this.updateLeftDown()
            break;
        }
        this.changeDir();
    }

    updateLeftUp(){
      for(var i = 0; i < this.height; i++){
        for(var j = 0; j < this.width; j++){
          this.updateAgent(i, j)
        }
      }
    }

    updateRightUp(){
      for(var i = 0; i < this.height; i++){
        for(var j = this.width - 1; j >= 0; j--){
          this.updateAgent(i, j)
        }
      }
    }

    updateRightDown(){
      for(var i = this.height - 1; i >= 0; i--){
        for(var j = this.width - 1; j >= 0; j--){
          this.updateAgent(i, j)
        }
      }
    }

    updateLeftDown(){
      for(var i = this.height - 1; i >= 0; i--){
        for(var j = 0; j < this.width; j++){
          this.updateAgent(i, j)
        }
      }
    }

    updateAgent(i, j){
      var agent = this.population[i][j]
      if (!agent.isEmpty()) {
          var neighbours = this.getNeighbouringInfectedCells(i, j, this.infectRadius)
          this.move(agent)
          if (agent.getState() == 's' && this.willInfect(neighbours)) {
              agent.setNextState('i')
          }
          if (agent.getState() == 'i' && this.willRecover()) {
              agent.setNextState('r')
              agent.setImmunizationPeriod(this.immunizationPeriod)
          }
          if (agent.getState() == 'r') {
              agent.updateImmunizationPeriod()
          }
          if (agent.isInArea() && this.willTransfer()){
              agent.setArea(this.getRandomArea())
          }
    }
  }

    generateRandomNumber(max) {
        return Math.floor((Math.random() * max));
    }
}


function getPersonColor(state) {
    if (state == 's') {
        return susceptibleColor;
    }
    if (state == 'i') {
        return infectedColor;
    }
    if (state == 'r') {
        return removedColor;
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

function loop() {//WOODEN
    setInterval(function () {
        Azeroth.update()
        draw()
    }, 1000 / 30)
}

function loopAnim() {
    draw()
    Azeroth.update()
    window.requestAnimationFrame(loopAnim)
}

function draw() {
    canvasControl.clearRect(0, 0, canvas.width, canvas.height)
    canvasControl.fillStyle = backgroundColor;
    canvasControl.fillRect(0, 0, canvas.width, canvas.height);
    drawPopulation()
}

//PROBABILITIES - HAVE FUN WITH THEM:
var infectionProbability = 0.005
var removeProbability = 0.01
var infectRad = 3
var immunePeriod = 90
var moveProb = 0.002
//***********************************

var canvas = document.getElementById('canvas');
var canvasControl = canvas.getContext('2d');
canvasControl.fillStyle = '#000000';
canvasControl.fillRect(0, 0, canvas.width, canvas.height);
var diseaseConfiguration = {
  infectionProbability : infectionProbability,
  infectRadius : infectRad,
  recoverProbability : removeProbability,
  immunizationPeriod : immunePeriod,
  probabilityToMove : moveProb,
}

var Northrend = new Area(100, 15, 50);
var Kalimdor = new Area(50, 60, 60);
var Pandaria = new Area(100, 120, 30);
var EasternKingdoms = new Area(190, 60, 45);
var Azeroth = new World(300, 150, [Northrend, Kalimdor, Pandaria, EasternKingdoms], diseaseConfiguration);
Azeroth.populateAreas(50)
Azeroth.defaultInfect(1)
// loop();
window.requestAnimationFrame(loopAnim)
