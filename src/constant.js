const quantdlink='https://www.quandl.com/api/v3/datasets/HKEX/58536.json?api_key=JxNaUHpxXovho6rC_Ded'
export const getquantdlink=(stockNumber)=>{
    console.log(quantdlink.replace('58536',stockNumber))
    return quantdlink.replace('58536',stockNumber)
}