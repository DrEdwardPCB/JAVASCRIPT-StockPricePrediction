import { SimpleMovingAverage, WeightedMovingAverage, ExpotentialMovingAverage } from '../technicalAnalysis/movingAverage'
import { bollingerBand } from '../technicalAnalysis/BollingerBand'
import { MACD } from '../technicalAnalysis/MACD'
import { RSI, CulterRSI } from '../technicalAnalysis/RSI'
import { StochasticOscillator } from '../technicalAnalysis/StochasticOscillator'
import { ROC } from '../technicalAnalysis/ROC';
import { MFI } from '../technicalAnalysis/MFI';
import * as tfvis from '@tensorflow/tfjs-vis'
import * as tf from '@tensorflow/tfjs';
import _ from 'lodash';
import { buildModel } from './model'

const offset=10
const window=50
export const train = async (data, offset = 10) => {

    tfvis.visor()
    tfvis.visor().surface({ name: 'My First Surface', tab: 'Input Data' });

    const indexOfNP = data.dataset.column_names.indexOf('Nominal Price')
    const indexOfHigh = data.dataset.column_names.indexOf('High')
    const indexOfLow = data.dataset.column_names.indexOf('Low')
    const indexOfPC = data.dataset.column_names.indexOf('Previous Close')
    //original data
    const NpArray = data.dataset.data.map(e => e[indexOfNP]).reverse()
    const HighArray = data.dataset.data.map(e => e[indexOfHigh]).reverse()
    const LowArray = data.dataset.data.map(e => e[indexOfLow]).reverse()
    const PCArray = data.dataset.data.map(e => e[indexOfPC]).reverse()
    //Technical analysis
    const s10arr = SimpleMovingAverage(NpArray, 10).slice(250)
    const s20arr = SimpleMovingAverage(NpArray, 20).slice(250)
    const s50arr = SimpleMovingAverage(NpArray, 50).slice(250)
    const s100arr = SimpleMovingAverage(NpArray, 100).slice(250)
    const s200arr = SimpleMovingAverage(NpArray, 200).slice(250)
    const s250arr = SimpleMovingAverage(NpArray, 250).slice(250)
    const w10arr = WeightedMovingAverage(NpArray, 10).slice(250)
    const w20arr = WeightedMovingAverage(NpArray, 20).slice(250)
    const w50arr = WeightedMovingAverage(NpArray, 50).slice(250)
    const w100arr = WeightedMovingAverage(NpArray, 100).slice(250)
    const w200arr = WeightedMovingAverage(NpArray, 200).slice(250)
    const w250arr = WeightedMovingAverage(NpArray, 250).slice(250)
    const e10arr = ExpotentialMovingAverage(NpArray, 10,2).slice(250)
    const e20arr = ExpotentialMovingAverage(NpArray, 20,2).slice(250)
    const e50arr = ExpotentialMovingAverage(NpArray, 50,2).slice(250)
    const e100arr = ExpotentialMovingAverage(NpArray, 100,2).slice(250)
    const e200arr = ExpotentialMovingAverage(NpArray, 200,2).slice(250)
    const e250arr = ExpotentialMovingAverage(NpArray, 250,2).slice(250)
    var [bolu1, bold1] = bollingerBand(NpArray)
    const bolu=bolu1.slice(250)
    const bold=bold1.slice(250)
    const macd = MACD(NpArray).slice(250)
    const rsi = RSI(NpArray).slice(250)
    const crsi = CulterRSI(NpArray).slice(250)
    const so = StochasticOscillator(NpArray).slice(250)
    console.log(so)
    const roc = ROC(NpArray).slice(250)
    const mfi = MFI(NpArray).slice(250)

    const tNparr = NpArray.slice(250)
    const tHarr = HighArray.slice(250)
    const tLarr = LowArray.slice(250)
    const tPCarr = PCArray.slice(250)

    //inputData.slice(0,200)
    var Xs = []
    var answer=[]
    
    for (var i = 0; i < tNparr.length - window; i++) {
        // console.log(tNparr.slice(100))
        var thisPos = []
        thisPos[0] = tNparr.slice(i, i + window)
        thisPos[1] = tHarr.slice(i, i + window)
        thisPos[2] = tLarr.slice(i, i + window)
        thisPos[3] = tPCarr.slice(i, i + window)
        thisPos[4] = bolu.slice(i, i + window)
        thisPos[5] = bold.slice(i, i + window)
        thisPos[6] = macd.slice(i, i + window)
        thisPos[7] = rsi.slice(i, i + window)
        thisPos[8] = crsi.slice(i, i + window)
        thisPos[9] = so.slice(i, i + window)
        thisPos[10] = roc.slice(i, i + window)
        thisPos[11] = mfi.slice(i, i + window)
        thisPos[12] = s10arr.slice(i, i + window)
        thisPos[13] = s20arr.slice(i, i + window)
        thisPos[14] = s50arr.slice(i, i + window)
        thisPos[15] = s100arr.slice(i, i + window)
        thisPos[16] = s200arr.slice(i, i + window)
        thisPos[17] = s250arr.slice(i, i + window)
        thisPos[18] = e10arr.slice(i, i + window)
        thisPos[19] = e20arr.slice(i, i + window)
        thisPos[20] = e50arr.slice(i, i + window)
        thisPos[21] = e100arr.slice(i, i + window)
        thisPos[22] = e200arr.slice(i, i + window)
        thisPos[23] = e250arr.slice(i, i + window)
        thisPos[24] = w10arr.slice(i, i + window)
        thisPos[25] = w20arr.slice(i, i + window)
        thisPos[26] = w50arr.slice(i, i + window)
        thisPos[27] = w100arr.slice(i, i + window)
        thisPos[28] = w200arr.slice(i, i + window)
        thisPos[29] = w250arr.slice(i, i + window)
        thisPos[30] = tNparr.slice(i + offset, i + window + offset)
        //console.log(thisPos[0].length)
        var thatPos=thisPos[0].map((e,ind)=>{
            //console.log(e)
            return [
                e,
                isNaN(thisPos[1][ind])||thisPos[1][ind]==null||thisPos[1][ind]==undefined?0:thisPos[1][ind],
                isNaN(thisPos[2][ind])||thisPos[2][ind]==null||thisPos[2][ind]==undefined?0:thisPos[2][ind],
                isNaN(thisPos[3][ind])||thisPos[3][ind]==null||thisPos[3][ind]==undefined?0:thisPos[3][ind],
                isNaN(thisPos[4][ind])||thisPos[4][ind]==null||thisPos[4][ind]==undefined?0:thisPos[4][ind],
                isNaN(thisPos[5][ind])||thisPos[5][ind]==null||thisPos[5][ind]==undefined?0:thisPos[5][ind],
                isNaN(thisPos[6][ind])||thisPos[6][ind]==null||thisPos[6][ind]==undefined?0:thisPos[6][ind],
                isNaN(thisPos[7][ind])||thisPos[7][ind]==null||thisPos[7][ind]==undefined?0:thisPos[7][ind],
                isNaN(thisPos[8][ind])||thisPos[8][ind]==null||thisPos[8][ind]==undefined?0:thisPos[8][ind],
                isNaN(thisPos[9][ind])||thisPos[9][ind]==null||thisPos[9][ind]==undefined?0:thisPos[9][ind],
                isNaN(thisPos[10][ind])||thisPos[10][ind]==null||thisPos[10][ind]==undefined?0:thisPos[10][ind],
                isNaN(thisPos[11][ind])||thisPos[11][ind]==null||thisPos[11][ind]==undefined?0:thisPos[11][ind],
                isNaN(thisPos[12][ind])||thisPos[12][ind]==null||thisPos[12][ind]==undefined?0:thisPos[12][ind],
                isNaN(thisPos[13][ind])||thisPos[13][ind]==null||thisPos[13][ind]==undefined?0:thisPos[13][ind],
                isNaN(thisPos[14][ind])||thisPos[14][ind]==null||thisPos[14][ind]==undefined?0:thisPos[14][ind],
                isNaN(thisPos[15][ind])||thisPos[15][ind]==null||thisPos[15][ind]==undefined?0:thisPos[15][ind],
                isNaN(thisPos[16][ind])||thisPos[16][ind]==null||thisPos[16][ind]==undefined?0:thisPos[16][ind],
                isNaN(thisPos[17][ind])||thisPos[17][ind]==null||thisPos[17][ind]==undefined?0:thisPos[17][ind],
                isNaN(thisPos[18][ind])||thisPos[18][ind]==null||thisPos[18][ind]==undefined?0:thisPos[18][ind],
                isNaN(thisPos[19][ind])||thisPos[19][ind]==null||thisPos[19][ind]==undefined?0:thisPos[19][ind],
                isNaN(thisPos[10][ind])||thisPos[20][ind]==null||thisPos[20][ind]==undefined?0:thisPos[20][ind],
                isNaN(thisPos[21][ind])||thisPos[21][ind]==null||thisPos[21][ind]==undefined?0:thisPos[21][ind],
                isNaN(thisPos[22][ind])||thisPos[22][ind]==null||thisPos[22][ind]==undefined?0:thisPos[22][ind],
                isNaN(thisPos[23][ind])||thisPos[23][ind]==null||thisPos[23][ind]==undefined?0:thisPos[23][ind],
                isNaN(thisPos[24][ind])||thisPos[24][ind]==null||thisPos[24][ind]==undefined?0:thisPos[24][ind],
                isNaN(thisPos[25][ind])||thisPos[25][ind]==null||thisPos[25][ind]==undefined?0:thisPos[25][ind],
                isNaN(thisPos[26][ind])||thisPos[26][ind]==null||thisPos[26][ind]==undefined?0:thisPos[26][ind],
                isNaN(thisPos[27][ind])||thisPos[27][ind]==null||thisPos[27][ind]==undefined?0:thisPos[27][ind],
                isNaN(thisPos[28][ind])||thisPos[28][ind]==null||thisPos[28][ind]==undefined?0:thisPos[28][ind],
                isNaN(thisPos[29][ind])||thisPos[29][ind]==null||thisPos[29][ind]==undefined?0:thisPos[29][ind],
                isNaN(thisPos[30][ind])||thisPos[30][ind]==null||thisPos[30][ind]==undefined?0:thisPos[30][ind],
            ]
        })
        //console.log(thatPos.length)
        Xs.push(thatPos)
        answer.push(thatPos)
    }
    Xs=_.takeRight(Xs,Xs.length-window-1)
    for (var i = Xs.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * i)
        const temp = Xs[i]
        Xs[i] = Xs[j]
        Xs[j] = temp
    }
    console.log(Xs)
    //console.log(Xs.length, Xs[0].length, Xs[0][0].length)
    var Ys = Xs.map((e) => {//there will be 200 time step 30 feature for each
        //console.log(e.length)
        return e.map((f)=>{return f[30]}).filter((f,inde,rarr)=>{return inde==rarr.length-1})
    })
    console.log(Ys)
    /*console.log(
        Xs.map(e => {//there will be 200 time step 30 feature for each
            return e.map((f,inde)=>{return [
                f[0],f[1],f[2],f[3],f[4],f[5],f[6],f[7],f[8],f[9],f[10],f[11],f[12],f[13],f[14],f[15],f[16],f[17],f[18],f[19],f[20],f[21],f[22],f[23],f[24],f[25],f[26],f[27],f[28],f[29]
            ]})
        }).slice(0, Math.floor(Xs.length * 0.7))
    )*/
    //console.log(Ys.length, Ys[0].length, Ys[0][0].length)
    const realXs = tf.tensor(Xs.map(e => {//there will be 200 time step 30 feature for each
        return e.map((f,inde)=>{return [
            f[0],f[1],f[2],f[3],f[4],f[5],f[6],f[7],f[8],f[9],f[10],f[11],f[12],f[13],f[14],f[15],f[16],f[17],f[18],f[19],f[20],f[21],f[22],f[23],f[24],f[25],f[26],f[27],f[28],f[29]
        ]})
    }).slice(0, Math.floor(Xs.length * 0.7)))
    const realYs = tf.tensor(Ys.slice(0, Math.floor(Ys.length * 0.7)))
    const realXsVal = tf.tensor(Xs.map(e => {//there will be 200 time step 30 feature for each
        return e.map((f,inde)=>{return [
            f[0],f[1],f[2],f[3],f[4],f[5],f[6],f[7],f[8],f[9],f[10],f[11],f[12],f[13],f[14],f[15],f[16],f[17],f[18],f[19],f[20],f[21],f[22],f[23],f[24],f[25],f[26],f[27],f[28],f[29]
        ]})
    }).slice(Math.floor(Xs.length * 0.7)))
    const realYsVal = tf.tensor(Ys.slice(Math.floor(Ys.length * 0.7)))
    realXs.print()
    /**
     * 
     */
    const model = tf.sequential()

    //define input and output
   
    const output=tf.layers.activation({
        activation:'linear',
        name:'linear_output'
    })
    const optimizer=tf.train.adam()


    //define hidden layers lstm layer
    const lstmlayerapply = tf.layers.lstm({
        units:window,
        name:'lstm_0',
        inputShape:[window,30],
        dropout:0.2
    })
    model.add(lstmlayerapply)
    /*model.add(tf.layers.dropout({
        units:200,
        rate:0.2,
        name:'lstm_dropout'
    }))*/
    /*model.add(tf.layers.dense({
        units:50,
        activation:'relu',
        name:'dense_1'
    }))*/
    model.add(tf.layers.dense({
        units:50,
        activation:'relu',
        name:'dense_2'
    }))
    model.add(tf.layers.dense({
        units:64,
        activation:'sigmoid',
        name:'dense_3'
    }))
    model.add(tf.layers.dense({
        units:1,
        activation:'linear',
        name:'dense_4'
    }))
    model.add(output)
    model.compile({optimizer:optimizer, loss:tf.losses.meanSquaredError, metrics: ['mse']})
    /**
     * 
     */
    
    await model.fit(realXs, realYs, {
        epochs: 200,
        batchSize: 10,
        callbacks: tfvis.show.fitCallbacks(
            { name: 'Training Performance' },
            ['loss', 'val_loss', 'acc', 'val_acc'],
            { height: 200, callbacks: ['onEpochEnd'] }),
        validationData: [realXsVal, realYsVal]
    }
    )
    const last = tf.tensor(_.takeRight(answer.map(e => {//there will be 200 time step 30 feature for each
        return e.map((f,inde)=>{return [
            f[0],f[1],f[2],f[3],f[4],f[5],f[6],f[7],f[8],f[9],f[10],f[11],f[12],f[13],f[14],f[15],f[16],f[17],f[18],f[19],f[20],f[21],f[22],f[23],f[24],f[25],f[26],f[27],f[28],f[29]
        ]})
    }),1))
    const preds = model.predict(last)
    console.log(preds)
    preds.print()

}
export const getData = () => {

}
export const predict = () => {

}