
resultSGraph = document.getElementById('resultSGraph');
var realS = [235/*3 July*/,
    201/*19 July*/, 153.5/*3 Aug*/, 121/*19 Aug*/,
    108/*3 Sep*/, 97/*19 Sep*/, 83/*20 Oct*/]
// var time = [0, 16/31, 31/31, 47/31, 63/31, 79/31,  109/31]
var realI = [14.5, 22, 29, 21, 8, 8, 0]
var time = [0, 16 * 0.03225, 31 * 0.03225, 47 * 0.03225, 63 * 0.03225, 79 * 0.03225, 109 * 0.03225]

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

var S0 = 235;
var Sn = 83;
var I0 = 14.5;
var totalPopulation = S0 + I0;
var alpha = 2.73;
var betaReal = 0.0178;
var delta = 0.001;
var steps = 5;

var betaCalculated;
var R0;
var Imax;
var r;


function extractErrorData() {
    var values = [];
    var time = [];
    for (var i = -0.05; i < 0.05; i += 0.0002) {
        time.push(i);
        values.push(smallestSquares(i))
    }
    return {
        values,
        time
    }
}

function plotError(event) {
    event.preventDefault();
    var errorResults = extractErrorData()

    var errorFunction = {
        x: errorResults.time,
        y: errorResults.values,
        name: "Error function",
        line: {
            color: '#fe9e00',//65, 138, 179
            width: 5
        },
        type: 'spline'
    }

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
    Plotly.newPlot('resultSGraph', [errorFunction], layout);
    document.getElementById('resultSGraph').removeAttribute('hidden')
}

function nullifyDataArrays() {
    resultS.time = [];
    resultS.S = [];
    resultI.time = [];
    resultI.I = [];
    resultR.time = [];
    resultR.R = [];
}

function sendDataToPlotly(results) {
    var realDataForSusceptibles = {
        x: time,
        y: realS,
        name: "Real data for susceptible",
        type: 'line'
    };
    var realDataForInfected = {
        x: time,
        y: realI,
        name: "Real data for infected",
        type: 'line'
    };
    var susceptibles = {
        x: results.Svalues.time,
        y: results.Svalues.S,
        name: "Susceptible",
        line: {
            color: '#fe9e00',//65, 138, 179
            width: 4
        },
        type: 'spline'
    };
    var infected = {
        x: results.Ivalues.time,
        y: results.Ivalues.I,
        name: "Infected",
        line: {
            color: '#418ab3',
            width: 4
        },
        type: 'spline'
    };
    var removed = {
        x: results.Rvalues.time,
        y: results.Rvalues.R,
        name: "Removed",
        line: {
            color: '#df5327',
            width: 4
        },
        type: 'spline'
    };

    var data = [susceptibles, infected, removed, realDataForSusceptibles, realDataForInfected];
    var layout = {
        title: 'SIR model data for estimated beta',
        xaxis: {
            title: 'Time',
        },
        yaxis: {
            title: 'Number of people',
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

function getInnerHtml(beta, value){
    return '<h1 id="betaFound" style="color: white; text-align: center;">Beta found: '
    + beta +'</h1><h1 id="error" style="color: white; text-align: center;" >Error: '
    + value + '</h1>'
}

function simulate(event) {
    event.preventDefault();
    nullifyDataArrays();
    
    var betaValue = parseFloat(document.getElementById('beta').value);
    var beta = findBeta(betaValue);

    var results = EulerMethod(S0, I0, alpha, beta.point, 0.0001, 3.5161);

    sendDataToPlotly(results)
    document.getElementById('dataResultsContainer').innerHTML= getInnerHtml(beta.point, beta.result);
}


function smallestSquares(beta) {
    var realS = [235/*3 July*/,
        201/*19 July*/, 153.5/*3 Aug*/, 121/*19 Aug*/,
        108/*3 Sep*/, 97/*19 Sep*/, -1/*4 Oct*/, 83/*20 Oct*/]
    var realI = [14.5, 22, 29, 21, 8, 8, -1, 0]
    var time = [0, 16, 31, 47, 63, 79, 94, 109]
    var S0 = realS[0]
    var I0 = 14.5
    var alpha = 2.73
    var delta = 0.01
    var steps = realS.length
    var sirResults = EulerMethod(S0, I0, alpha, beta, 0.01, 3.5161)
    var numberOfElements = sirResults.Svalues.S.length
    console.log(" BETA:" + beta)
    var sumS = 0
    var sumI = 0
    for (var i in realS) {
        if (realS[i] != -1) {
            var index = Math.round(time[i] / 109 * (numberOfElements - 1))
            var difS = Math.pow((realS[i] - sirResults.Svalues.S[index]), 2)
            var difI = Math.pow((realI[i] - sirResults.Ivalues.I[index]), 2)
            sumS += difS
            sumS += difI
        }
    }
    return sumS / (steps)
}

function findBeta(estimationOfBeta) {
    return gradientDescent(smallestSquares, 0.000001, 0.0000001, estimationOfBeta)
}





function EulerMethod(beginingSusceptible, beginingInfected, alpha, beta, delta, steps) {
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

    return {
        Svalues: resultS,
        Ivalues: resultI,
        Rvalues: resultR
    }
}

const MAX_ITERATIONS = 10000
const h = 0.00001
const FIXED_GAMMA = 0.00000001

function derivative(f, x) {
    var fdelta = f(x + h)
    var fnorm = f(x)
    return (fdelta - fnorm) / h
}

function gradientDescent(f, gamma, precision, startingPoint) {
    var previous = startingPoint, current
    var step = precision + 1
    var iterations = 0
    while (precision < step && iterations < MAX_ITERATIONS) {
        var derivativePrevious = derivative(f, previous)

        current = previous - FIXED_GAMMA * derivativePrevious

        var derivativeCurrent = derivative(f, current)
        if(Math.abs(derivativeCurrent) < precision){
            break;
        }
        step = Math.abs(current - previous)

        previous = current
        iterations++
    }
    return {
        point: current,
        result: f(current),
        iterations
    }
}