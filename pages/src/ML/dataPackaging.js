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

const offsetC = 10
const windowC = 20
/**
 * pass in data set as an object, automatically train and predict the model return the array of prediction result
 * @param {object} data 
 * @param {function} callback 
 * @param {number} offset
 * @param {number} window
 */
export const train = async (data, callback, offset = offsetC, window = windowC) => {

    tfvis.visor()
    tf.setBackend('webgl')
    console.log(tf.getBackend());

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
    const e10arr = ExpotentialMovingAverage(NpArray, 10, 2).slice(250)
    const e20arr = ExpotentialMovingAverage(NpArray, 20, 2).slice(250)
    const e50arr = ExpotentialMovingAverage(NpArray, 50, 2).slice(250)
    const e100arr = ExpotentialMovingAverage(NpArray, 100, 2).slice(250)
    const e200arr = ExpotentialMovingAverage(NpArray, 200, 2).slice(250)
    const e250arr = ExpotentialMovingAverage(NpArray, 250, 2).slice(250)
    var [bolu1, bold1] = bollingerBand(NpArray)
    const bolu = bolu1.slice(250)
    const bold = bold1.slice(250)
    const macd = MACD(NpArray).slice(250)
    const rsi = RSI(NpArray).slice(250)
    const crsi = CulterRSI(NpArray).slice(250)
    const so = StochasticOscillator(NpArray).slice(250)
    const roc = ROC(NpArray).slice(250)
    const mfi = MFI(NpArray).slice(250)

    const tNparr = NpArray.slice(250)
    const tHarr = HighArray.slice(250)
    const tLarr = LowArray.slice(250)
    const tPCarr = PCArray.slice(250)

    //organise data in a way with respect to the window, the offset and compatible with tensorflow
    var Xs = []
    var answer = []

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
        var thatPos = thisPos[0].map((e, ind) => {
            //console.log(e)
            return [
                e,
                isNaN(thisPos[1][ind]) || thisPos[1][ind] == null || thisPos[1][ind] == undefined ? 0 : thisPos[1][ind],
                isNaN(thisPos[2][ind]) || thisPos[2][ind] == null || thisPos[2][ind] == undefined ? 0 : thisPos[2][ind],
                isNaN(thisPos[3][ind]) || thisPos[3][ind] == null || thisPos[3][ind] == undefined ? 0 : thisPos[3][ind],
                isNaN(thisPos[4][ind]) || thisPos[4][ind] == null || thisPos[4][ind] == undefined ? 0 : thisPos[4][ind],
                isNaN(thisPos[5][ind]) || thisPos[5][ind] == null || thisPos[5][ind] == undefined ? 0 : thisPos[5][ind],
                isNaN(thisPos[6][ind]) || thisPos[6][ind] == null || thisPos[6][ind] == undefined ? 0 : thisPos[6][ind],
                isNaN(thisPos[7][ind]) || thisPos[7][ind] == null || thisPos[7][ind] == undefined ? 0 : thisPos[7][ind],
                isNaN(thisPos[8][ind]) || thisPos[8][ind] == null || thisPos[8][ind] == undefined ? 0 : thisPos[8][ind],
                isNaN(thisPos[9][ind]) || thisPos[9][ind] == null || thisPos[9][ind] == undefined ? 0 : thisPos[9][ind],
                isNaN(thisPos[10][ind]) || thisPos[10][ind] == null || thisPos[10][ind] == undefined ? 0 : thisPos[10][ind],
                isNaN(thisPos[11][ind]) || thisPos[11][ind] == null || thisPos[11][ind] == undefined ? 0 : thisPos[11][ind],
                isNaN(thisPos[12][ind]) || thisPos[12][ind] == null || thisPos[12][ind] == undefined ? 0 : thisPos[12][ind],
                isNaN(thisPos[13][ind]) || thisPos[13][ind] == null || thisPos[13][ind] == undefined ? 0 : thisPos[13][ind],
                isNaN(thisPos[14][ind]) || thisPos[14][ind] == null || thisPos[14][ind] == undefined ? 0 : thisPos[14][ind],
                isNaN(thisPos[15][ind]) || thisPos[15][ind] == null || thisPos[15][ind] == undefined ? 0 : thisPos[15][ind],
                isNaN(thisPos[16][ind]) || thisPos[16][ind] == null || thisPos[16][ind] == undefined ? 0 : thisPos[16][ind],
                isNaN(thisPos[17][ind]) || thisPos[17][ind] == null || thisPos[17][ind] == undefined ? 0 : thisPos[17][ind],
                isNaN(thisPos[18][ind]) || thisPos[18][ind] == null || thisPos[18][ind] == undefined ? 0 : thisPos[18][ind],
                isNaN(thisPos[19][ind]) || thisPos[19][ind] == null || thisPos[19][ind] == undefined ? 0 : thisPos[19][ind],
                isNaN(thisPos[10][ind]) || thisPos[20][ind] == null || thisPos[20][ind] == undefined ? 0 : thisPos[20][ind],
                isNaN(thisPos[21][ind]) || thisPos[21][ind] == null || thisPos[21][ind] == undefined ? 0 : thisPos[21][ind],
                isNaN(thisPos[22][ind]) || thisPos[22][ind] == null || thisPos[22][ind] == undefined ? 0 : thisPos[22][ind],
                isNaN(thisPos[23][ind]) || thisPos[23][ind] == null || thisPos[23][ind] == undefined ? 0 : thisPos[23][ind],
                isNaN(thisPos[24][ind]) || thisPos[24][ind] == null || thisPos[24][ind] == undefined ? 0 : thisPos[24][ind],
                isNaN(thisPos[25][ind]) || thisPos[25][ind] == null || thisPos[25][ind] == undefined ? 0 : thisPos[25][ind],
                isNaN(thisPos[26][ind]) || thisPos[26][ind] == null || thisPos[26][ind] == undefined ? 0 : thisPos[26][ind],
                isNaN(thisPos[27][ind]) || thisPos[27][ind] == null || thisPos[27][ind] == undefined ? 0 : thisPos[27][ind],
                isNaN(thisPos[28][ind]) || thisPos[28][ind] == null || thisPos[28][ind] == undefined ? 0 : thisPos[28][ind],
                isNaN(thisPos[29][ind]) || thisPos[29][ind] == null || thisPos[29][ind] == undefined ? 0 : thisPos[29][ind],
                isNaN(thisPos[30][ind]) || thisPos[30][ind] == null || thisPos[30][ind] == undefined ? 0 : thisPos[30][ind],
            ]
        })

        Xs.push(thatPos)
        answer.push(thatPos)
    }
    //ensuring there won't be data that are too recent is fed to the training set
    Xs = _.takeRight(Xs, Xs.length - window - 1)

    //shuffle the data
    for (var i = Xs.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * i)
        const temp = Xs[i]
        Xs[i] = Xs[j]
        Xs[j] = temp
    }

    //preparing Ys for fitting the model
    var Ys = Xs.map((e) => {//there will be 200 time step 30 feature for each
        //console.log(e.length)
        return e.map((f) => { return f[30] }).filter((f, inde, rarr) => { return inde == rarr.length - 1 })
    })

    //preparing Xs training set
    const realXs = [
        tf.tensor(Xs.map(e => {//normal
            return e.map((f, inde) => {
                return [
                    f[0], f[1], f[2], f[3],
                ]
            })
        }).slice(0, Math.floor(Xs.length * 0.7))),
        tf.tensor(Xs.map(e => {//ma10
            return e.map((f, inde) => {
                return [
                    f[12], f[18], f[24],
                ]
            })
        }).slice(0, Math.floor(Xs.length * 0.7))),
        tf.tensor(Xs.map(e => {//ma20
            return e.map((f, inde) => {
                return [
                    f[13], f[19], f[25],
                ]
            })
        }).slice(0, Math.floor(Xs.length * 0.7))),
        tf.tensor(Xs.map(e => {//ma50
            return e.map((f, inde) => {
                return [
                    f[14], f[20], f[26],
                ]
            })
        }).slice(0, Math.floor(Xs.length * 0.7))),
        tf.tensor(Xs.map(e => {//ma100
            return e.map((f, inde) => {
                return [
                    f[15], f[21], f[27],
                ]
            })
        }).slice(0, Math.floor(Xs.length * 0.7))),
        tf.tensor(Xs.map(e => {//ma200
            return e.map((f, inde) => {
                return [
                    f[16], f[22], f[28],
                ]
            })
        }).slice(0, Math.floor(Xs.length * 0.7))),
        tf.tensor(Xs.map(e => {//ma250
            return e.map((f, inde) => {
                return [
                    f[17], f[23], f[29]
                ]
            })
        }).slice(0, Math.floor(Xs.length * 0.7))),
        tf.tensor(Xs.map(e => {//bo
            return e.map((f, inde) => {
                return [
                    f[4], f[5]
                ]
            })
        }).slice(0, Math.floor(Xs.length * 0.7))),
        tf.tensor(Xs.map(e => {//macd
            return e.map((f, inde) => {
                return [
                    f[6],
                ]
            })
        }).slice(0, Math.floor(Xs.length * 0.7))),
        tf.tensor(Xs.map(e => {//rsi
            return e.map((f, inde) => {
                return [
                    f[7],
                ]
            })
        }).slice(0, Math.floor(Xs.length * 0.7))),
        tf.tensor(Xs.map(e => {//crsi
            return e.map((f, inde) => {
                return [
                    f[8],
                ]
            })
        }).slice(0, Math.floor(Xs.length * 0.7))),
        tf.tensor(Xs.map(e => {//so
            return e.map((f, inde) => {
                return [
                    f[9],
                ]
            })
        }).slice(0, Math.floor(Xs.length * 0.7))),
        tf.tensor(Xs.map(e => {//roc
            return e.map((f, inde) => {
                return [
                    f[10],
                ]
            })
        }).slice(0, Math.floor(Xs.length * 0.7))),
        tf.tensor(Xs.map(e => {//mfi
            return e.map((f, inde) => {
                return [
                    f[11],
                ]
            })
        }).slice(0, Math.floor(Xs.length * 0.7))),
    ]
    //preparing Ys training set
    const realYs = tf.tensor(Ys.slice(0, Math.floor(Ys.length * 0.7)))

    //preparing Xs validation set
    const realXsVal = [
        tf.tensor(Xs.map(e => {//normal
            return e.map((f, inde) => {
                return [
                    f[0], f[1], f[2], f[3],
                ]
            })
        }).slice(Math.floor(Xs.length * 0.7))),
        tf.tensor(Xs.map(e => {//ma10
            return e.map((f, inde) => {
                return [
                    f[12], f[18], f[24],
                ]
            })
        }).slice(Math.floor(Xs.length * 0.7))),
        tf.tensor(Xs.map(e => {//ma20
            return e.map((f, inde) => {
                return [
                    f[13], f[19], f[25],
                ]
            })
        }).slice(Math.floor(Xs.length * 0.7))),
        tf.tensor(Xs.map(e => {//ma50
            return e.map((f, inde) => {
                return [
                    f[14], f[20], f[26],
                ]
            })
        }).slice(Math.floor(Xs.length * 0.7))),
        tf.tensor(Xs.map(e => {//ma100
            return e.map((f, inde) => {
                return [
                    f[15], f[21], f[27],
                ]
            })
        }).slice(Math.floor(Xs.length * 0.7))),
        tf.tensor(Xs.map(e => {//ma200
            return e.map((f, inde) => {
                return [
                    f[16], f[22], f[28],
                ]
            })
        }).slice(Math.floor(Xs.length * 0.7))),
        tf.tensor(Xs.map(e => {//ma250
            return e.map((f, inde) => {
                return [
                    f[17], f[23], f[29]
                ]
            })
        }).slice(Math.floor(Xs.length * 0.7))),
        tf.tensor(Xs.map(e => {//bo
            return e.map((f, inde) => {
                return [
                    f[4], f[5]
                ]
            })
        }).slice(Math.floor(Xs.length * 0.7))),
        tf.tensor(Xs.map(e => {//macd
            return e.map((f, inde) => {
                return [
                    f[6],
                ]
            })
        }).slice(Math.floor(Xs.length * 0.7))),
        tf.tensor(Xs.map(e => {//rsi
            return e.map((f, inde) => {
                return [
                    f[7],
                ]
            })
        }).slice(Math.floor(Xs.length * 0.7))),
        tf.tensor(Xs.map(e => {//crsi
            return e.map((f, inde) => {
                return [
                    f[8],
                ]
            })
        }).slice(Math.floor(Xs.length * 0.7))),
        tf.tensor(Xs.map(e => {//so
            return e.map((f, inde) => {
                return [
                    f[9],
                ]
            })
        }).slice(Math.floor(Xs.length * 0.7))),
        tf.tensor(Xs.map(e => {//roc
            return e.map((f, inde) => {
                return [
                    f[10],
                ]
            })
        }).slice(Math.floor(Xs.length * 0.7))),
        tf.tensor(Xs.map(e => {//mfi
            return e.map((f, inde) => {
                return [
                    f[11],
                ]
            })
        }).slice(Math.floor(Xs.length * 0.7))),
    ]

    //preparing Ys validation set
    const realYsVal = tf.tensor(Ys.slice(Math.floor(Ys.length * 0.7)))
    /**
     * model building start
     */
    //change from sequential model to arbitory model, instead of having multiple feature being process by single LSTM, using multiple LSTM to process different feature will be a choise
    //building the model
    //const model = tf.model()
    const optimizer = tf.train.adam()
    //define input layer for multiple lstm
    const ma10input = tf.input({ shape: [window, 3] })
    const ma20input = tf.input({ shape: [window, 3] })
    const ma50input = tf.input({ shape: [window, 3] })
    const ma100input = tf.input({ shape: [window, 3] })
    const ma200input = tf.input({ shape: [window, 3] })
    const ma250input = tf.input({ shape: [window, 3] })
    const boinput = tf.input({ shape: [window, 2] })
    const macdinput = tf.input({ shape: [window, 1] })
    const rsiinput = tf.input({ shape: [window, 1] })
    const crsiinput = tf.input({ shape: [window, 1] })
    const soinput = tf.input({ shape: [window, 1] })
    const rocinput = tf.input({ shape: [window, 1] })
    const mfiinput = tf.input({ shape: [window, 1] })
    const nomralinput = tf.input({ shape: [window, 4] })
    //define hidden layers lstm layer
    //following a group of second layer
    const ma10lstm = tf.layers.dense({ units: window, activation: 'relu', dropout: 0.2 }).apply(tf.layers.lstm({
        units: window,
        name: 'lstm_ma10',
        dropout: 0.2
    }).apply(ma10input))
    const ma20lstm = tf.layers.dense({ units: window, activation: 'relu', dropout: 0.2 }).apply(tf.layers.lstm({
        units: window,
        name: 'lstm_ma20',
        dropout: 0.2
    }).apply(ma20input))
    const ma50lstm = tf.layers.dense({ units: window, activation: 'relu', dropout: 0.2 }).apply(tf.layers.lstm({
        units: window,
        name: 'lstm_ma50',
        dropout: 0.2
    }).apply(ma50input))
    const ma100lstm = tf.layers.lstm({
        units: window,
        name: 'lstm_ma100',
        dropout: 0.2
    }).apply(ma100input)
    const ma200lstm = tf.layers.dense({ units: window, activation: 'relu', dropout: 0.2 }).apply(tf.layers.lstm({
        units: window,
        name: 'lstm_ma200',
        dropout: 0.2
    }).apply(ma200input))
    const ma250lstm = tf.layers.dense({ units: window, activation: 'relu', dropout: 0.2 }).apply(tf.layers.lstm({
        units: window,
        name: 'lstm_ma250',
        dropout: 0.2
    }).apply(ma250input))
    const maBranch = tf.layers.dense({ units: Math.floor(window * 1.5), dropout: 0.2 }).apply(tf.layers.concatenate().apply([ma10lstm, ma20lstm, ma50lstm, ma100lstm, ma200lstm, ma250lstm]))
    //following a group of second layer
    const bolstm = tf.layers.dense({ units: window, activation: 'relu', dropout: 0.2 }).apply(tf.layers.lstm({
        units: window,
        name: 'lstm_bo',
        dropout: 0.2
    }).apply(boinput))
    const macdlstm = tf.layers.dense({ units: window, activation: 'relu', dropout: 0.2 }).apply(tf.layers.lstm({
        units: window,
        name: 'lstm_macd',
        dropout: 0.2
    }).apply(macdinput))
    const maRelatedBranch = tf.layers.dense({ units: Math.floor(window * 1.5), dropout: 0.2 }).apply(tf.layers.concatenate().apply([bolstm, macdlstm]))
    //group in third layer
    //following a group of second layer
    const rsilstm = tf.layers.dense({ units: window, activation: 'relu', dropout: 0.2 }).apply(tf.layers.lstm({
        units: window,
        name: 'lstm_rsi',
        dropout: 0.2
    }).apply(rsiinput))
    const crsilstm = tf.layers.dense({ units: window, activation: 'relu', dropout: 0.2 }).apply(tf.layers.lstm({
        units: window,
        name: 'lstm_crsi',
        dropout: 0.2
    }).apply(crsiinput))
    const roclstm = tf.layers.dense({ units: window, activation: 'relu', dropout: 0.2 }).apply(tf.layers.lstm({
        units: window,
        name: 'lstm_roc',
        dropout: 0.2
    }).apply(rocinput))
    const mfilstm = tf.layers.dense({ units: window, activation: 'relu', dropout: 0.2 }).apply(tf.layers.lstm({
        units: window,
        name: 'lstm_mfi',
        dropout: 0.2
    }).apply(mfiinput))
    const solstm = tf.layers.dense({ units: window, activation: 'relu', dropout: 0.2 }).apply(tf.layers.lstm({
        units: window,
        name: 'lstm_so',
        dropout: 0.2
    }).apply(soinput))
    const nonMaBranch = tf.layers.dense({ units: Math.floor(window * 1.5), dropout: 0.2 }).apply(tf.layers.concatenate().apply([rsilstm, crsilstm, roclstm, mfilstm, solstm]))
    const ohlvclstmBranch = tf.layers.dense({ units: window, activation: 'relu', dropout: 0.2 }).apply(tf.layers.lstm({
        units: window,
        name: 'lstm_ohlvc',
        dropout: 0.2
    }).apply(nomralinput))

    const TechnicalBranch = tf.layers.dense({ units: window }).apply(tf.layers.concatenate().apply([maBranch, maRelatedBranch, nonMaBranch]))
    const allinone = tf.layers.dense({ units: 1, activation: 'relu' }).apply(tf.layers.dense({ units: window, activation: 'relu' }).apply(tf.layers.concatenate().apply([TechnicalBranch, ohlvclstmBranch])))



    const model = tf.model({
        inputs: [
            nomralinput,
            ma10input,
            ma20input,
            ma50input,
            ma100input,
            ma200input,
            ma250input,
            boinput,
            macdinput,
            rsiinput,
            crsiinput,
            soinput,
            rocinput,
            mfiinput
        ]
        
        , outputs: allinone
       
    })
    model.compile({
        optimizer: optimizer
        , loss: tf.losses.meanSquaredError
        , metrics: ['mse']
    })
    /** 
     * modle building end
    */

    //fitting the model
    await model.fit(realXs, realYs, {
        epochs: 100,
        batchSize: 10,
        callbacks: tfvis.show.fitCallbacks(
            { name: 'Training Performance' },
            ['loss', 'val_loss', 'acc', 'val_acc'],
            { height: 200, callbacks: ['onEpochEnd'] }),
        validationData: [realXsVal, realYsVal]
    }
    )
    const last = [
        tf.tensor(_.takeRight(answer.map(e => {//there will be 200 time step 30 feature for each
            return e.map((f, inde) => {
                return [
                    f[0], f[1], f[2], f[3],
                ]
            })
        }), 1)),
        tf.tensor(_.takeRight(answer.map(e => {//there will be 200 time step 30 feature for each
            return e.map((f, inde) => {
                return [
                    f[12], f[18], f[24]
                ]
            })
        }), 1)),
        tf.tensor(_.takeRight(answer.map(e => {//there will be 200 time step 30 feature for each
            return e.map((f, inde) => {
                return [
                    f[13], f[19], f[25]
                ]
            })
        }), 1)),
        tf.tensor(_.takeRight(answer.map(e => {//there will be 200 time step 30 feature for each
            return e.map((f, inde) => {
                return [
                    f[14], f[20], f[26]
                ]
            })
        }), 1)),
        tf.tensor(_.takeRight(answer.map(e => {//there will be 200 time step 30 feature for each
            return e.map((f, inde) => {
                return [
                    f[15], f[21], f[27]
                ]
            })
        }), 1)),
        tf.tensor(_.takeRight(answer.map(e => {//there will be 200 time step 30 feature for each
            return e.map((f, inde) => {
                return [
                    f[16], f[22], f[28]
                ]
            })
        }), 1)),
        tf.tensor(_.takeRight(answer.map(e => {//there will be 200 time step 30 feature for each
            return e.map((f, inde) => {
                return [
                    f[17], f[23], f[29]
                ]
            })
        }), 1)),
        tf.tensor(_.takeRight(answer.map(e => {//there will be 200 time step 30 feature for each
            return e.map((f, inde) => {
                return [
                    f[4], f[5],
                ]
            })
        }), 1)),
        tf.tensor(_.takeRight(answer.map(e => {//there will be 200 time step 30 feature for each
            return e.map((f, inde) => {
                return [f[6]]
            })
        }), 1)),
        tf.tensor(_.takeRight(answer.map(e => {//there will be 200 time step 30 feature for each
            return e.map((f, inde) => {
                return [f[7]]
            })
        }), 1)),
        tf.tensor(_.takeRight(answer.map(e => {//there will be 200 time step 30 feature for each
            return e.map((f, inde) => {
                return [f[8]]
            })
        }), 1)),
        tf.tensor(_.takeRight(answer.map(e => {//there will be 200 time step 30 feature for each
            return e.map((f, inde) => {
                return [f[9]]
            })
        }), 1)),
        tf.tensor(_.takeRight(answer.map(e => {//there will be 200 time step 30 feature for each
            return e.map((f, inde) => {
                return [f[10]]
            })
        }), 1)),
        tf.tensor(_.takeRight(answer.map(e => {//there will be 200 time step 30 feature for each
            return e.map((f, inde) => {
                return [f[11]]
            })
        }), 1)),
    ]

    const preds = model.predict(last)
    console.log(preds)
    preds.print()
    const predsArray = preds.arraySync()
    callback({
        answer: answer.map((e) => {//there will be 200 time step 30 feature for each
            //console.log(e.length)
            return e.map((f) => { return f[30] }).filter((f, inde, rarr) => { return inde == rarr.length - 1 })
        }), predict: predsArray
    })

}
/*
export const getData = () => {

}
export const predict = () => {

}*/