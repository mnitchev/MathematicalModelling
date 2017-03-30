function f(x) {
    return Math.pow(x, 2)
}
function df(x) {
    return 2 * x
}

function gradientDescent(f, derivative, step, precision, startingPoint) {
    var previous = startingPoint, current, iterations = 0
    while (precision < step) {
        iterations++
        current = previous - step * derivative(previous)
        step = ((current - previous) * (derivative(current) - derivative(previous)))
        step /= Math.pow(Math.abs(derivative(current) - derivative(previous)), 2)
        previous = current
    }
    return {
        current,
        iterations
    }
}


function result() {
    var header = document.getElementById('results')
    var iterations = document.getElementById('iterations')
    var result = gradientDescent(f, df, 2, 0.0000001, [5.5])
    header.innerText = result.current
    iterations.innerText = result.iterations
}
