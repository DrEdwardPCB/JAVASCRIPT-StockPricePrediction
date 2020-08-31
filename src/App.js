import React, { useState, useEffect, } from 'react';
import logo from './logo.svg';
import './App.css';
import { getquantdlink } from './constant'
import { Row, Col, Container, Form, Button } from 'react-bootstrap'
import { SimpleMovingAverage, WeightedMovingAverage, ExpotentialMovingAverage } from './technicalAnalysis/movingAverage'
import { bollingerBand } from './technicalAnalysis/BollingerBand'
import { MACD } from './technicalAnalysis/MACD'
import { RSI, CulterRSI } from './technicalAnalysis/RSI'
import { StochasticOscillator } from './technicalAnalysis/StochasticOscillator'
import { ROC } from './technicalAnalysis/ROC';
import { MFI } from './technicalAnalysis/MFI';
import { Line, Bar } from 'react-chartjs-2';
import _ from'lodash';
import ResizeableDiv from './customComponent/resizeableDiv'
import {train, predict} from './ML/dataPackaging'

console.log(getquantdlink)
function App() {
  //const [shouldFetch, setShouldFetch] = useState(true)
  useEffect(() => {
    fetchData('00388')
  }, [])
  const [NPArray, setNPArray] = useState([])
  const [LabelArray, setLabelArray] = useState([])
  const [chartWidth, setChartWidth] = useState(1980)
  const [BollingerBand, setBollingerBand] = useState({ BOLU: [], BOLD: [] })
  const [MovingAverage, setMovingAverage] = useState({ e10: [], e50: [], e200: [] })
  const [Macd, setMacd] = useState()
  const [Rsi, setRsi] = useState()
  const [Mfi, setMfi] = useState()
  const [Roc, setRoc] = useState()
  const [So, setSo] = useState()
  const [rawData,setRawData]=useState()
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
        const [bolu, bold] = bollingerBand(NpArray)
        setBollingerBand({ BOLU: bolu, BOLD: bold })
        setMovingAverage({
          e10: ExpotentialMovingAverage(NpArray,10, 2),
          e50: ExpotentialMovingAverage(NpArray,50, 2),
          e200: ExpotentialMovingAverage(NpArray,200, 2),
        })
        setRawData(data)
        setMacd(MACD(NpArray))
        setMfi(MFI(NpArray))
        setRoc(ROC(NpArray))
        setRsi(RSI(NpArray))
        setSo(StochasticOscillator(NpArray))
      })
  }
  return (
    <div id='app'>
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous"></link>
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
                    labels: _.takeRight(LabelArray,100),
                    datasets: [{
                      label: 'Nominal Price',
                      backgroundColor: '#FF0000',
                      borderColor: '#FF0000',
                      data: _.takeRight(NPArray,100),
                      fill: false,
                    },
                    {
                      label: 'BOLU',
                      backgroundColor: '#d0d0d0',
                      borderColor: '#d0d0d0',
                      data: _.takeRight(BollingerBand.BOLU,100),
                      fill: false,
                    },
                    {
                      label: 'BOLD',
                      backgroundColor: '#d0d0d0',
                      borderColor: '#d0d0d0',
                      data: _.takeRight(BollingerBand.BOLD,100),
                      fill: false,
                    },
                    //moving average
                    {
                      label: 's10',
                      backgroundColor: '#0EB1D2',
                      borderColor: '#999999',
                      data: _.takeRight(MovingAverage.s10,100),
                      fill: false,
                    },
                    {
                      label: 's50',
                      backgroundColor: '#709176',
                      borderColor: '#999999',
                      data: _.takeRight(MovingAverage.s50,100),
                      fill: false,
                    },
                    {
                      label: 's200',
                      backgroundColor: '#E6F8B2',
                      borderColor: '#999999',
                      data: _.takeRight(MovingAverage.s200,100),
                      fill: false,
                    },
                    {
                      label: 'w10',
                      backgroundColor: '#0EB1D2',
                      borderColor: '#d0d0d0',
                      data: _.takeRight(MovingAverage.w10,100),
                      fill: false,
                    },
                    {
                      label: 'w50',
                      backgroundColor: '#709176',
                      borderColor: '#d0d0d0',
                      data: _.takeRight(MovingAverage.w50,100),
                      fill: false,
                    },
                    {
                      label: 'w200',
                      backgroundColor: '#E6F8B2',
                      borderColor: '#d0d0d0',
                      data: _.takeRight(MovingAverage.w200,100),
                      fill: false,
                    },
                    {
                      label: 'e10',
                      backgroundColor: '#0EB1D2',
                      borderColor: '#dddddd',
                      data: _.takeRight(MovingAverage.e10,100),
                      fill: false,
                    },
                    {
                      label: 'e50',
                      backgroundColor: '#709176',
                      borderColor: '#dddddd',
                      data: _.takeRight(MovingAverage.e50,100),
                      fill: false,
                    },
                    {
                      label: 'e200',
                      backgroundColor: '#E6F8B2',
                      borderColor: '#dddddd',
                      data: _.takeRight(MovingAverage.e200,100),
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
        <Row>
          <Col>
            <div style={{ overflow: 'scroll', height: '250px' }}>
              <ResizeableDiv width={chartWidth} height={200}>
                <Line
                  width={'100%'}
                  height={'100%'}
                  data={{
                    labels:  _.takeRight(LabelArray,100),
                    datasets: [{
                      label: 'MACD',
                      backgroundColor: '#F00000',
                      borderColor: '#F00000',
                      data: _.takeRight(Macd,100),
                      fill: false,
                    },
                    {
                      label: 'MFI',
                      backgroundColor: '#00F000',
                      borderColor: '#00F000',
                      data: _.takeRight(Mfi,100),
                      fill: false,
                    },
                    {
                      label: 'ROC',
                      backgroundColor: '#0000F0',
                      borderColor: '#0000F0',
                      data: _.takeRight(Roc,100),
                      fill: false,
                    },
                    {
                      label: 'RSI',
                      backgroundColor: '#FF0000',
                      borderColor: '#FF0000',
                      data: _.takeRight(Rsi,100),
                      fill: false,
                    },
                    {
                      label: 'StochasticOscillator',
                      backgroundColor: '#00FF00',
                      borderColor: '#00FF00',
                      data: _.takeRight(So,100),
                      fill: false,
                    }
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
        <Row>
          <Col>
            <Button onClick={()=>{train(rawData)}}>Train model</Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
