export const MFI = (inputData,period=14)=>{
    return inputData.map((e, i) => {
        if (i < period - 1) {
            return 0
        } else {
            //calculate money flow ratio
            var MF = inputData.slice(i - period + 1, i + 1).reduce((accum,curr,index,arr)=>{
                if(index==0){
                    return accum
                }else{
                    if(curr>arr[index-1]){
                        accum.uf+=(curr-arr[index-1])
                    }else{
                        accum.df+=(arr[index-1]-curr)
                    }
                    return accum
                }
            },{uf:0,df:0})
            return 100-(100/(1+(MF.uf/MF.df)))
        }
    })
}