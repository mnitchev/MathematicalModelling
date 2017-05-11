var MAX_ITERATIONS = 1000
var h = 0.00001

function derivative(f, x){
    var fdelta = f(x+h)
    var fnorm = f(x)
    return (fdelta - fnorm) / h
}

exports.gradientDescent = function(f, step, gamma,  precision, startingPoint) {
    var previous = startingPoint, current
    var iterations = 0
    while (precision < step && iterations < MAX_ITERATIONS) {
        var derivativePrevious = derivative(f, previous)
        // if(derivativePrevious < precision){
        //     current = previous;
        //     break;
        // }

        iterations++
        current = previous - gamma * derivativePrevious
        var derivativeCurrent = derivative(f, current)

        console.log("DERIVATIVE : " + derivativeCurrent)

        gamma = ((current - previous) * (derivativeCurrent - derivativePrevious))
        gamma /= Math.pow(Math.abs(derivativeCurrent - derivativePrevious), 2)
        
        //console.log("gamma : " + gamma + " current : " + current + " previous :" + previous)
        
        step = Math.abs(current - previous)
        previous = current
    }
    return {
        point: current,
        result: f(current),
        iterations
    }
}

// function result() {
//     var header = document.getElementById('results')
//     var iterations = document.getElementById('iterations')
//     var result = gradientDescent(f, 2, 0.001,  0.0000001, 6)
//     header.innerText = "Point : " + result.point + " Value : " + result.result 
//     iterations.innerText = result.iterations
// }
