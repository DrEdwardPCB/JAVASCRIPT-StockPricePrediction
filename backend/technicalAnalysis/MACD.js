const {ExpotentialMovingAverage } =require('./movingAverage')

exports.MACD = (inputData ,period1=12, period1Smoothening = 2, period2=26 , period2Smoothening = 2) => {
    const firstEMA = ExpotentialMovingAverage(inputData, period1, period1Smoothening)
    const secondEMA = ExpotentialMovingAverage(inputData, period2, period2Smoothening)
    return firstEMA.map((e,i)=>{
        return e-secondEMA[i]
    })
} 