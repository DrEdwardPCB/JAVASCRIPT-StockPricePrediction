const { SimpleMovingAverage } =require( './movingAverage')
exports.bollingerBand = (inputData, days = 20, sd = 2) => {
    const sma = SimpleMovingAverage(inputData, days)
    const preOutput = inputData.map((e, i) => {
        if (i < days - 1) {
            return { BOLU: 0, BOLD: 0 }
        } else {
            var slidingWindow = inputData.slice(i - days + 1, i + 1)
            return {
                BOLU: sma[i] + sd * getStandardDeviation(slidingWindow),
                BOLD: sma[i] - sd * getStandardDeviation(slidingWindow)
            }
        }
    })
    return [
        preOutput.map((e) => {
            return e.BOLU
        }),
        preOutput.map((e) => {
            return e.BOLD
        }),
    ]


}
const getStandardDeviation = (array) => {
    const n = array.length
    const mean = array.reduce((a, b) => a + b) / n
    return Math.sqrt(array.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n)
}