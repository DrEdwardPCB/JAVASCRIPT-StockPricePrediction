import React, { useState, useEffect, } from 'react';
import { getquantdlink } from './constant'
import { Row, Col, Container, Form, Button } from 'react-bootstrap'
import { SimpleMovingAverage, WeightedMovingAverage, ExpotentialMovingAverage } from './technicalAnalysis/movingAverage'
import { bollingerBand } from './technicalAnalysis/BollingerBand'
import { MACD } from './technicalAnalysis/MACD'
import { RSI, CulterRSI } from './technicalAnalysis/RSI'
import { StochasticOscillator } from './technicalAnalysis/StochasticOscillator'
import { ROC } from './technicalAnalysis/ROC';
import { MFI } from './technicalAnalysis/MFI';
import dynamic from 'next/dynamic'
import { Line, Bar } from 'react-chartjs-2';
import _ from 'lodash';
import ResizeableDiv from './customComponent/resizeableDiv'
import { train, predict } from './ML/dataPackaging'
import io from 'socket.io-client'
import * as tfvis from '@tensorflow/tfjs-vis'

console.log(getquantdlink)
var trainHistory=[]
var surface={name:'model', tab:'model'}
function App() {
  //const [shouldFetch, setShouldFetch] = useState(true)
  const socketio = io()
  useEffect(() => {
    fetchData('00388')
    socketio.on('vis',(data)=>{
      console.log(data)
      if(data.type==='model'){
        //tfvis.show.modelSumary(surface,data.data)
      }else{
        trainHistory.push(data.data)
        tfvis.show.history(surface,trainHistory,['loss', 'val_loss'])
      }
    })
    socketio.on('result', (data)=>{
      alert('prediction done, result is in developer console')
      console.log(data)
      setReal(data.answer)
      setPredict(data.predict)
    })
  }, [])
  const [NPArray, setNPArray] = useState([])
  const [LabelArray, setLabelArray] = useState([])
  const [chartWidth, setChartWidth] = useState(1980)
  const [rawData, setRawData] = useState()
  const [real, setReal] = useState([])
  const [predict, setPredict] = useState([])
  const fetchData = (stid) => {
    console.log(getquantdlink(stid))
    fetch(getquantdlink(stid))
      .then(response => response.json())
      .then(data => {
        console.log(data)
        var indexOfNP = data.dataset.column_names.indexOf('Nominal Price')
        var indexofDate = data.dataset.column_names.indexOf('Date')
        var NpArray = data.dataset.data.map(e => e[indexOfNP]).reverse()
        var LAbelArray = data.dataset.data.map(e => e[indexofDate]).reverse()

        if (100 * 20 > 1980) {
          setChartWidth(100 * 20)
          console.log(100 * 20)
        } else {
          setChartWidth(1980)
        }
        setNPArray(NpArray)
        setLabelArray(LAbelArray)
        setRawData(data)
      })
  }
  return (
    <div id='app'>
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossOrigin="anonymous"></link>
      <Container>
        <Row>
          <Col>
            <Row>
              <Col>
                <h1>input the stock number you want</h1>
              </Col>
            </Row>
            <Row>
              <Col xs={8} sm={8}>
                <Form>
                  <Form.Control type="text" id='stockNumber' placeholder="00388" />
                </Form>
              </Col>
              <Col xs={4} sm={4}>
                <Button onClick={() => { fetchData(document.getElementById('stockNumber').value) }}>
                  fetch
              </Button>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col>
            <div style={{ overflow: 'scroll', height: '400px' }}>
              <ResizeableDiv width={chartWidth} height={400}>
                <Line
                  width={'100%'}
                  height={'100%'}
                  data={{
                    labels: _.takeRight(LabelArray, 100),
                    datasets: [{
                      label: 'Nominal Price',
                      backgroundColor: '#FF0000',
                      borderColor: '#FF0000',
                      data: _.takeRight(NPArray, 100),
                      fill: false,
                    }]
                  }}
                  options={{
                    responsive: true,
                    title: {
                      display: true,
                      text: 'Chart.js Line Chart'
                    },
                    tooltips: {
                      mode: 'index',
                      intersect: false,
                    },
                    hover: {
                      mode: 'nearest',
                      intersect: true
                    },
                    maintainAspectRatio: false,
                    scales: {
                      x: {
                        display: true,
                        scaleLabel: {
                          display: true,
                          labelString: 'Month'
                        }
                      },
                      y: {
                        display: true,
                        scaleLabel: {
                          display: true,
                          labelString: 'Value'
                        }
                      }
                    }
                  }} />
              </ResizeableDiv>
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
          </Col>
        </Row>
        <Row>
          <Col>
            <Button onClick={() => {
              train(rawData, (data) => {
                console.log(data)
              })
            }}>Train model with tf-webgl</Button>
          </Col><Col>
            <Button onClick={() => {
              trainHistory=[]
              socketio.emit('train', rawData)
            }}>Train model with tf-node-GPU</Button>
          </Col>
          <Col>
            <Button 
            disabled={true}
            onClick={() => {
              trainHistory=[]
              socketio.emit('trainCPU', rawData)
            }}>Train model with tf-node</Button>
          </Col>
        </Row>
        <Row>
          <Col>
            <div style={{ overflow: 'scroll', height: '400px' }}>
              <ResizeableDiv width={chartWidth} height={400}>
                <Line
                  width={'100%'}
                  height={'100%'}
                  data={{
                    labels: _.takeRight(predict.map((e, i) => { return i }), 100),
                    datasets: [{
                      label: 'real',
                      backgroundColor: '#F00000',
                      borderColor: '#F00000',
                      data: _.takeRight(real, 100),
                      fill: false,
                    },
                    {
                      label: 'predict',
                      backgroundColor: '#00F000',
                      borderColor: '#00F000',
                      data: _.takeRight(predict, 100),
                      fill: false,
                    },
                    ]
                  }}
                  options={{
                    responsive: true,
                    title: {
                      display: true,
                      text: 'Chart.js Line Chart'
                    },
                    tooltips: {
                      mode: 'index',
                      intersect: false,
                    },
                    hover: {
                      mode: 'nearest',
                      intersect: true
                    },
                    maintainAspectRatio: false,
                    scales: {
                      x: {
                        display: true,
                        scaleLabel: {
                          display: true,
                          labelString: 'Month'
                        }
                      },
                      y: {
                        display: true,
                        scaleLabel: {
                          display: true,
                          labelString: 'Value'
                        }
                      }
                    }
                  }} />
              </ResizeableDiv>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
