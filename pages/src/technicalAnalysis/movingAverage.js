/**
 * 
 * @param {array} inputData 
 * @param {number} average 
 */
export const SimpleMovingAverage = (inputData, average) => {
    var outputData = inputData.map((e, i) => {
        if (i < average - 1) {
            return 0
        } else {
            return inputData.slice(i - average + 1, i + 1).reduce((accum, curr) => {
                return accum += curr
            }, 0) / average
        }
    })
    return outputData
}
/**
 * more closer to current, weight heavier
 * @param {array} inputData 
 * @param {number} average 
 */
export const WeightedMovingAverage = (inputData, average) => {
    var outputData = inputData.map((e, i) => {
        if (i < average - 1) {
            return 0
        } else {
            var denominator=average
            for(var j=1;j<=average;j++){
                denominator+=average-j
            }
            var averageVal = inputData.slice(i - average + 1, i + 1).reduce((accum, curr, j) => {
                return accum += curr*(j+1)
            }, 0)/denominator
            return averageVal
        }
    })
    return outputData
}
/**
 * expotentially decrease the weight if the day is further from current,
 * returning EMA
 * @param {array} inputData 
 * @param {number} average 
 * @param {number} smoothening 
 */
export const ExpotentialMovingAverage = (inputData,average,smoothening)=>{
    const alpha=smoothening/(1+average)
    var outputData = inputData.map((e, i) => {
        if (i < average - 1) {
            return 0
        } else {
            var denominator=average
            for(var j=1;j<=average;j++){
                denominator+=average-j
            }
            var averageVal = inputData.slice(i - denominator + 1, i + 1).reverse().reduce((accum, curr, j) => {
                return accum+=curr*Math.pow((1-alpha),j)
            }, 0)*alpha
            return averageVal
        }
    })
    return outputData
}