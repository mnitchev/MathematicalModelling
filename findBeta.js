var SIR = require('./SIRModel/SIRModel')
var gradientDescent = require('./gradient-descent/gradient-descent')

// var realS = [254, 235, 201, 135, 121, 108, 97, 83]
// var realI = [7, 14, 22, 29, 21, 8, 8, 0]
// var S0 = 254
// var I0 = 7
// var alpha = 2.73
// var delta = 0.01
// var steps = realS.length
// var h = 0.00001

function smallestSquares(beta) {
    var realS = [235/*3 July*/,
        201/*19 July*/, 153.5/*3 Aug*/, 121/*19 Aug*/,
        108/*3 Sep*/, 97/*19 Sep*/, -1/*4 Oct*/, 83/*20 Oct*/]
    var time = [0, 16, 31, 47, 63, 79, 94, 109]
    // var realI = [7, 15.62, 26.28, 30.13, 24.47, 15.76, 9.07, 4.86, 2.52]
    //var res = SIR.sirModel(254, 7, 2.73, 0.0178, 0.1, 5)
    //var realS = res.Svalues
    //var realI = res.Ivalues
    var S0 = realS[0]
    var I0 = 14.5
    var alpha = 2.73
    var delta = 0.01
    var steps = realS.length
    var sirResults = SIR.sirModel(S0, I0, alpha, beta, 0.03225, 3.5161)
    console.log(" BETA:" + beta)
    var sumS = 0
    var sumI = 0
    for (var i in realS) {
        if (realS[i] != -1) {
            var dif = Math.pow((realS[i] - sirResults.Svalues[time[i]]), 2)
            sumS += dif
        }
        // sumI += Math.pow(realI[i] - sirResults.Ivalues[i], 2)
    }
    console.log(sumS)
    return sumS / (steps)
}

function smallestSquaresDerivative(beta) {
    return (smallestSquares(beta + h) - smallestSquares(beta)) / h
}

function findBeta() {
    var betaCalculated = 0.01
    return gradientDescent.gradientDescent(smallestSquares,
        254, 0.00000001, 0.0000000001, betaCalculated)
}

// var aa = SIR.sirModel(254, 7, 2.73, 0.0178, 0.00001, 5)


var result = findBeta()

console.log(result.point + "   " + result.result)