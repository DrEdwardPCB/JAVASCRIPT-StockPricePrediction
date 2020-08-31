import * as tf from '@tensorflow/tfjs';

export const buildModel = () => {
    //creation of model
    const model = tf.sequential()

    //define input and output
   
    const output=tf.layers.activation({
        activation:'linear',
        name:'linear_output'
    })
    const optimizer=tf.train.adam()


    //define hidden layers lstm layer
    const lstmlayerapply = tf.layers.lstm({
        units:100,
        name:'lstm_0',
        inputShape:[200,30]
    })
    model.add(lstmlayerapply)
    model.add(tf.layers.dropout({
        units:100,
        rate:0.2,
        name:'lstm_dropout'
    }))
    model.add(tf.layers.dense({
        units:1500,
        name:'dense_1'
    }))
    model.add(tf.layers.dense({
        units:1000,
        name:'dense_2'
    }))
    model.add(tf.layers.dense({
        units:100,
        name:'dense_3'
    }))
    model.add(tf.layers.dense({
        units:1,
        name:'dense_4'
    }))
    model.add(output)
    const compiledModel= model.compile({optimizer:optimizer, loss:tf.losses.meanSquaredError, metrics: ['accuracy']})
    return compiledModel
}
