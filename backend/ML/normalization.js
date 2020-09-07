/**
 * This function accept a number array and carryout min-max normalization.
 * return an array of 2 item, first item is the normaizedArray, second item is the denormalize function
 * @param {number array} array 
 */
exports.minmaxnormalize=(array)=>{
    const max=Math.max(...array)
    const min=Math.min(...array)
    const normalizedArray=array.map(e=>(e-min)/(max-min))
    const denormalizefnc=(narr,s=min,l=max)=>{
        return narr.map(e=>e*(l-s)+s)
    }
    return[normalizedArray, denormalizefnc]
}