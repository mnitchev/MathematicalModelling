var MAX_ITERATIONS = 100

function f(x) {
    return Math.pow(x, 4)  - 3 * Math.pow(x, 3) +  2
}
function df(x) {
  return 4 * Math.pow(x, 3)  - 9 * Math.pow(x, 2)
}

function f1(x){
    return Math.sin(x) / x
}

function df1(x){
    return (x * Math.cos(x) - Math.sin(x)) / Math.pow(x, 2)
}

function gradientDescent(f, derivative, step, gamma,  precision, startingPoint) {
    var previous = startingPoint, current
    var iterations = 0
    while (precision < step && iterations < MAX_ITERATIONS) {
        iterations++
        current = previous - gamma * derivative(previous)
        gamma = ((current - previous) * (derivative(current) - derivative(previous)))
        gamma /= Math.pow(Math.abs(derivative(current) - derivative(previous)), 2)
        console.log("gamma : " + gamma + " current : " + current + " previous :" + previous)
        step = Math.abs(current - previous)
        previous = current
    }
    return {
        point: current,
        result: f(current),
        iterations
    }
}

function result() {
    var header = document.getElementById('results')
    var iterations = document.getElementById('iterations')
    var result = gradientDescent(f, df, 2, 0.001,  0.0000001, 6)
    header.innerText = "Point : " + result.point + " Value : " + result.result 
    iterations.innerText = result.iterations
}
