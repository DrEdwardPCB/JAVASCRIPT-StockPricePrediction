import {ExpotentialMovingAverage, SimpleMovingAverage} from './movingAverage'
/**
 * RSI based on Canonical RSI, using simple moving average
 * @param {array} inputData 
 * @param {number} day 
 * @param {number} smoothening
 */
export const RSI=(inputData, day=14 , smoothening=2)=>{
    const up =inputData.map((e,i)=>{
        if(i==0){
            return 0
        }else{
            if(e>inputData[i-1]){
                return e-inputData[i-1]
            }else{
                return 0
            }
        }
    })
    const down = inputData.map((e,i)=>{
        if(i==0){
            return 0
        }else{
            if(e>inputData[i-1]){
                return 0
            }else{
                return inputData[i-1]-e
            }
        }
    })
    const upema=ExpotentialMovingAverage(up,day,smoothening)
    const downema=ExpotentialMovingAverage(down,day,smoothening)
    const RSI=upema.map((e,i)=>{
        return (1-(1/(1+(e/downema[i]))))*100
    })
    return RSI
}
/**
 * RSI based on CulterRSI, using simple moving average
 * @param {array} inputData 
 * @param {number} day 
 */
export const CulterRSI=(inputData, day=14)=>{
    const up =inputData.map((e,i)=>{
        if(i==0){
            return 0
        }else{
            if(e>inputData[i-1]){
                return e-inputData[i-1]
            }else{
                return 0
            }
        }
    })
    const down = inputData.map((e,i)=>{
        if(i==0){
            return 0
        }else{
            if(e>inputData[i-1]){
                return 0
            }else{
                return inputData[i-1]-e
            }
        }
    })
    const upsma=SimpleMovingAverage(up,day)
    const downsma=SimpleMovingAverage(down,day)
    const RSI=upsma.map((e,i)=>{
        return (1-(1/(1+(e/downsma[i]))))*100
    })
    return RSI
}