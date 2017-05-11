exports.sirModel = function (beginingSusceptible, beginingInfected, alpha, beta, delta, steps) {
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