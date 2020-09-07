exports.ROC = (inputData,period=14)=>{
    const roc=inputData.map((e, i) => {
        if (i < period - 1) {
            return 1
        } else {
            return inputData.slice(i - period + 1, i + 1).reduce((accum,curr,index,arr)=>{
                if(index==0){
                    
                    return curr
                }else if(index==arr.length-1){
                    
                    return ((curr-accum)/accum)*100
                }else{
                    return accum
                }
            },1)
        }
    })
    //console.log('ROC:')
    //console.log(roc)
    return roc
}