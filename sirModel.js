

resultSGraph = document.getElementById('resultSGraph');
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
    for (var i = 1; i < steps; i += delta) {
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


function simulate() {
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
    eulerMethod(S0value, I0value, alphaValue, betaValue, delta, steps);


    var susceptibles = {
        x: resultS.time,
        y: resultS.S,
        name: "Susceptibles",
        line: {
            color: '#fe9e00',//65, 138, 179
            width: 4
        },
        type: 'spline'
    };
    var infected = {
        x: resultI.time,
        y: resultI.I,
        name: "Infected",
        line: {
            color: '#418ab3',
            width: 4
        },
        type: 'spline'
    };
    var removed = {
        x: resultR.time,
        y: resultR.R,
        name: "Died",
        line: {
            color: '#df5327',
            width: 4
        },
        type: 'spline'
    };
    var data = [susceptibles, infected, removed];
    var layout = {
        title: 'SIR Simulation of an Epidemic',
        xaxis: {
            title: 'Months',
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
