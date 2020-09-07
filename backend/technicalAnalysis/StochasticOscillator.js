exports.StochasticOscillator = (inputData,day=14)=>{
    const l14=lowestPriceInPeriod(inputData,day)
    const h14=highestPriceInPeriod(inputData,day)
    const so = inputData.map((e,i)=>{
        return((e-l14[i])/(h14[i]-l14[i]))*100
    })
    
    return so
}
const highestPriceInPeriod=(inputData,day)=>{
    const HP=inputData.map((e, i) => {
        if (i < day - 1) {
            return e
        } else {
            return inputData.slice(i - day + 1, i + 1).reduce((accum, curr) => {
                if(accum>curr){
                    return accum
                }else{
                    return curr
                }
            }, e)
        }
    })
    
    return HP
}
const lowestPriceInPeriod=(inputData,day)=>{
    const LP= inputData.map((e, i) => {
        if (i < day - 1) {
            return e
        } else {
            return inputData.slice(i - day + 1, i + 1).reduce((accum, curr) => {
                if(accum<curr){
                    return accum
                }else{
                    return curr
                }
            }, e)
        }
    })
    
    return LP
}