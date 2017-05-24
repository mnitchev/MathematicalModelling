
resultSGraph = document.getElementById('resultSGraph');
var realS = [235/*3 July*/,
    201/*19 July*/, 153.5/*3 Aug*/, 121/*19 Aug*/,
    108/*3 Sep*/, 97/*19 Sep*/,  83/*20 Oct*/]
// var time = [0, 16/31, 31/31, 47/31, 63/31, 79/31,  109/31]
var realI = [14.5, 22, 29, 21, 8, 8, 0]
var time = [0, 16*0.03225, 31*0.03225, 47*0.03225, 63*0.03225, 79*0.03225,  109*0.03225]

var resultS = {
    time: [],
    S: []
};
var resultI = {
    time: [],
    I: []
}
var resultR = {
    time: [],
    R: []
}

function eulerMethod(beginingSusceptible, beginingInfected, alpha, beta, delta, steps) {
    var S = beginingSusceptible, I = beginingInfected, nextS = 0, nextI = 0;
    var totalPopulation = beginingSusceptible + beginingInfected;
    for (var i = 0; i < steps; i += delta) {
        //Calculate changes  
        var newlyInfected = beta * S * I;
        var dead = alpha * I;
        var totalDead = totalPopulation - S - I;

        //Push current results
        resultS.S.push(S);
        resultS.time.push(i);
        resultI.I.push(I);
        resultI.time.push(i);
        resultR.R.push(totalDead);
        resultR.time.push(i);

        //Calculate next results
        nextS = S + delta * (-newlyInfected);
        nextI = I + delta * (newlyInfected - dead);
        S = nextS;
        I = nextI;
    }
}

var S0 = 254;
var Sn = 83;
var I0 = 7;
var totalPopulation = S0 + I0;
var alpha = 2.73;
var betaReal = 0.0178;
var delta = 0.001;
var steps = 5;

var betaCalculated;
var R0;
var Imax;
var r;

betaCalculated = (Math.log(S0) - Math.log(Sn)) * alpha / (totalPopulation - Sn);
console.log("Calculated beta is : " + betaCalculated);
console.log("Real beta is : " + betaReal);

//Change between beta and betaReal
var beta = betaReal;
if (beta == betaReal) {
    console.log("USING REAL BETA");
} else {
    console.log("USING CALCULATED BETA");
}

//Basic reproduction number calculation
R0 = beta * S0 / alpha;
console.log("Basic reproduction number : " + R0);
if (R0 > 1) {
    console.log("EPIDEMIC");
} else {
    console.log("NO EPIDEMIC");
}

//Rough calculations
var roughR0 = (Math.log(S0) - Math.log(Sn)) / (1 - (Sn / totalPopulation));
r = alpha * (roughR0 - 1);
var roughBeta = (r + alpha) / totalPopulation;
console.log("Rough calculation of beta is : " + roughBeta);

//Maximum infected calculation  
var ratio = alpha / beta;
Imax = totalPopulation - ratio * Math.log(S0) - ratio + ratio * Math.log(ratio);
console.log("Calculated maximum value of infected is : " + Imax);

var c = I0 + S0 - ratio * Math.log(S0);
console.log("Constant is : " + c);

var calculatedImax = c - ratio + ratio * Math.log(ratio);
console.log("Calculated maximum value of infected is : " + calculatedImax);

function bullshit(){
    var values = [];
    var time = [];
    for(var i = -0.05; i < 0.05; i+= 0.00002){
        time.push(i);
        values.push(smallestSquares(i))
    }
    return {
        values,
        time
    }
}

function simulate(event) {
    event.preventDefault();
    resultS.time = [];
    resultS.S = [];
    resultI.time = [];
    resultI.I = [];
    resultR.time = [];
    resultR.R = [];
    var S0value = parseInt(document.getElementById('S0').value);
    var I0value = parseInt(document.getElementById('I0').value);
    var alphaValue = parseFloat(document.getElementById('alpha').value);
    var betaValue = parseFloat(document.getElementById('beta').value);
    eulerMethod(S0value, I0value, alphaValue, betaValue, 0.0001, 3.5161);
    var res = bullshit();
    var adoh = {
        x: res.time,
        y: res.values,
        name: "Bullshit",
        line: {
            color: '#fe9e00',//65, 138, 179
            width: 4
        },
        type: 'spline'
    }
    // var realStuff = {
    //     x: time,
    //     y: realS,
    //     name: "Real data",

    // }
    // var susceptibles = {
    //     x: resultS.time,
    //     y: resultS.S,
    //     name: "Susceptible",
    //     line: {
    //         color: '#fe9e00',//65, 138, 179
    //         width: 4
    //     },
    //     type: 'spline'
    // };
    // var infected = {
    //     x: resultI.time,
    //     y: resultI.I,
    //     name: "Infected",
    //     line: {
    //         color: '#418ab3',
    //         width: 4
    //     },
    //     type: 'spline'
    // };
    // var removed = {
    //     x: resultR.time,
    //     y: resultR.R,
    //     name: "Removed",
    //     line: {
    //         color: '#df5327',
    //         width: 4
    //     },
    //     type: 'spline'
    // };
    var data = [adoh]//susceptibles, infected, removed, realStuff];
    var layout = {
        title: 'Least squares graph',
        xaxis: {
            title: 'Beta',
        },
        yaxis: {
            title: 'Value',
        },
        paper_bgcolor: '#272525',
        plot_bgcolor: '#272525',
        font: {
            color: 'white'
        }
    };

    Plotly.newPlot('resultSGraph', data, layout);
    document.getElementById('resultSGraph').removeAttribute('hidden')
}


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
    var realI = [14.5, 22, 29, 21, 8, 8, -1, 0]
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
    var sirResults = newEulerMethod(S0, I0, alpha, beta, 0.01, 3.5161)
    var numberOfElements = sirResults.Svalues.length
    console.log(" BETA:" + beta)
    var sumS = 0
    var sumI = 0
    for (var i in realS) {
        if (realS[i] != -1) {
            var index = Math.round(time[i]/109*(numberOfElements-1))
            var difS = Math.pow((realS[i] - sirResults.Svalues[index]), 2)
            var difI = Math.pow((realI[i] - sirResults.Ivalues[index]), 2)
            sumS += difS
            sumS += difI
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
    var betaOptions = getBetaVecotor();
    var betaCalculated = 0.014
    return gradientDescent.gradientDescent(smallestSquares,
        254, 0.000001, 0.0000001, betaCalculated)
}

// var aa = SIR.sirModel(254, 7, 2.73, 0.0178, 0.00001, 5)


//var result = findBeta()


var MAX_ITERATIONS = 1000
var h = 0.00001

function derivative(f, x){
    var fdelta = f(x+h)
    var fnorm = f(x)
    return (fdelta - fnorm) / h
}

function newEulerMethod(beginingSusceptible, beginingInfected, alpha, beta, delta, steps) {
    var resultS = []
    var resultI = []
    var resultR = []

    var S = beginingSusceptible, I = beginingInfected, nextS = 0, nextI = 0;
    var totalPopulation = beginingSusceptible + beginingInfected;
    for (var i = 0; i < steps; i += delta) {
        //Calculate changes  
        var newlyInfected = beta * S * I;
        var dead = alpha * I;
        var totalDead = totalPopulation - S - I;

        //Push current results
        resultS.push(S);
        resultI.push(I);
        resultR.push(totalDead);

        //Calculate next results
        nextS = S + delta * (-newlyInfected);
        nextI = I + delta * (newlyInfected - dead);
        S = nextS;
        I = nextI;
    }

    return {
        Svalues: resultS,
        Ivalues: resultI,
        Rvalues: resultR
    }
}

// function result() {
//     var header = document.getElementById('results')
//     var iterations = document.getElementById('iterations')
//     var result = gradientDescent(f, 2, 0.001,  0.0000001, 6)
//     header.innerText = "Point : " + result.point + " Value : " + result.result 
//     iterations.innerText = result.iterations
// }

