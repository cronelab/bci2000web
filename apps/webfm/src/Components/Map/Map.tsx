//@ts-ignore
import React, { useEffect, useContext, useRef, useState } from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap'
// import Brain from "../../src_v1/Components/Brain";
import '../Record/Record.scss'
import fmdata from '../../shared/fmdata'
import fmui from '../../shared/fmui'
import OnlineDataSource from '../../shared/fmonline'
import BCI2K from 'bci2k'
// import { DataHeader } from "../DataHeader";
// import MapModals from "./MapModals";
// import HighGamma from "../HighGamma";
import Worker from '../../shared/dataIndex.worker'

// const dataIndexer = new Worker();
import { Context } from '../../Context'
import { select, selectAll, mouse } from 'd3-selection'
import { scaleLinear } from 'd3-scale'
import { extent } from 'd3-array'
import * as horizon from 'd3-horizon-chart'

export const Map = () => {
    const { subject, setNewSubject, setNewRecord, bci, setBCI } = useContext(
        Context
    )
    const [clicked, click] = useState(false)

    let bciSourceConnection = new BCI2K.bciData()
    const inputEl = useRef(null)

    useEffect(() => {
        ;(async () => {
            let request = await fetch(`/config`)
            let data = await request.json()

            let dataset = new fmdata()
            // let uiManager = new fmui();
            console.log(dataset)
            // console.log(uiManager)
            // uiManager.config.ui = data;
            // uiManager.setup();
            let dataSource = new OnlineDataSource()
            dataSource.connect('ws://127.0.0.1')
            dataSource.onproperties = (properties: any) => {
                dataset.setupChannels(properties.channels)
                // uiManager.updateChannelNames(properties.channels);
            }
            dataSource.onBufferCreated = () => {
                dataset.updateTimesFromWindow(
                    dataSource.trialWindow,
                    dataSource._trialBlocks
                )
            }
            // dataSource.onRawSignal = e => console.log(e)

            dataSource.onStartTrial = () => {
                //@ts-ignore
                // document.getElementsByClassName("fm-transfer-icon")[0].style.display = "";
                // document.getElementsByClassName("fm-trial-label")[0].classList.add("fm-trial-label-active");
                // console.log(dataset)
            }
            dataSource.ontrial = (trialData: any) => {
                // setTimeout(
                //     () =>
                //         document
                //             .getElementsByClassName(`fm-transfer-icon`)[0]
                //             .classList.add("d-none"),
                //     500
                // );
                //@ts-ignore
                // document.getElementsByClassName(`fm-working-icon`)[0].style.display = "";
                console.log(dataset)
                console.log(trialData)

                dataset.ingest(trialData).then(() => {
                    // console.log(trialData)
                    // updateDataDisplay();
                    // setTimeout(
                    //     () =>
                    //         document
                    //             .getElementsByClassName(`fm-working-icon`)[0]
                    //             .classList.add("d-none"),
                    //     500
                    // );
                    // uiManager.updateTrialCount(dataset.getTrialCount());
                    // document
                    //     .getElementsByClassName("fm-trial-label")[0]
                    //     .classList.remove("fm-trial-label-active");
                })
            }

            //     var updateDataDisplay = function () {
            //         uiManager.raster.update(dataset.displayData);

            //         var dataWindow = {
            //             start: dataset.contents.times[0],
            //             end: dataset.contents.times[dataset.contents.times.length - 1],
            //         };

            // dataIndexer.postMessage({
            //   displayData: dataset.displayData,
            //   newTime: uiManager.raster.cursorTime,
            //   dataWindow: dataWindow,
            // });
            // dataIndexer.onmessage = (e: any) => {
            //   uiManager.brain.update(e.data);
            //   // uiManager.brain.update(dataset.dataForTime(uiManager.raster.cursorTime));
            // };
            //         var timeBounds = dataset.getTimeBounds();
            //         console.log(timeBounds)
            //         if (!uiManager.raster.timeScale) {
            //             return;
            //         }
            //         uiManager.raster.timeScale.range([timeBounds.start, timeBounds.end]);
            //     };

            //     dataSource.onRawSignal = (rawSignal: any) => uiManager.scope.update(rawSignal);

            //     bciSourceConnection.connect("ws://127.0.0.1:20203").then(() => {
            //         bciSourceConnection.onSignalProperties = data => {
            //             console.log(data);
            //             dataset.setupChannels(data.channels);
            //             uiManager.updateChannelNames(data.channels);
            //         };
            //         bciSourceConnection.onGenericSignal = (data) => {
            //             console.log(data);
            //         };
            //     });
            let chartContainer = document.getElementById('chart')
            let step = chartContainer.offsetWidth / 30 //dataset.displayData.Ch1.length;
            console.log(Object.keys(dataset.displayData))
            let horizonChart = horizon
                .horizonChart()
                .height(30)
                // @ts-ignore
                .step(step)
                .colors([
                    '#313695',
                    '#4575b4',
                    '#74add1',
                    '#abd9e9',
                    // "#ffffff",
                    '#fee090',
                    '#fdae61',
                    '#f46d43',
                    '#d73027',
                ])

            select(chartContainer).append('svg').attr('class', 'fm-cursor-svg')
            console.log(dataset.contents.times)
            let x = scaleLinear()
                .domain(extent(dataset.contents.times))
                .range([0, chartContainer.offsetWidth])

            select(chartContainer)
                .selectAll('.fm-horizon')
                // @ts-ignore
                .data(Object.values(dataset.displayData))
                .enter()
                .append('div')
                .attr('class', 'fm-horizon')
                .attr('style', 'outline: thin solid black; height: 20px;')
                .each(horizonChart)
                .select('.title')
                .text((d, i) => Object.keys(dataset.displayData)[i])

            select('.fm-cursor-svg')
                .attr('width', chartContainer.offsetWidth)
                .attr('height', chartContainer.offsetHeight)
                .append('line')
                .attr('class', 'zeroLine')
                .style('stroke', 'black')
                .attr('stroke-width', 3)
                .attr('x1', x(0))
                .attr('y1', 0)
                .attr('x2', x(0))
                .attr('y2', chartContainer.offsetHeight)

            select('.fm-cursor-svg')
                .append('line')
                .attr('class', 'cursorLine')
                .style('stroke', 'red')
                .attr('stroke-width', 3)
                .attr('x1', x(1))
                .attr('y1', 0)
                .attr('x2', x(1))
                .attr('y2', chartContainer.offsetHeight)

            // selectAll(".fm-horizon").on("click", (d, i) => {
            //     locked = !locked;
            // });
            selectAll('.fm-horizon').on('mousemove', (d, i, nodes) => {
                // @ts-ignore

                let goal = x.invert(mouse(nodes[i])[0])
                let answer = dataset.contents.times.reduce((prev, curr) =>
                    Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev
                )
                // @ts-ignore

                Object.values(times).map((x, i) => {
                    if (x == answer) {
                        // @ts-ignore

                        cursorLineMover(mouse(nodes[i])[0], i)
                    }
                })
            })
            const cursorLineMover = (position, dataIndex) => {
                // if (!locked) {
                //     select(".cursorLine")
                //         .attr("x1", position)
                //         .attr("y1", 0)
                //         .attr("x2", position)
                //         .attr("y2", chartContainer.offsetHeight);
                // }
            }
        })()
    })

    useEffect(() => {
        // (async () => {
        // })
    }, [])

    return (
        <div className="Record">
            {/* <DataHeader></DataHeader> */}
            <Button className="fm-show-options" onClick={() => click(true)}>
                Button
            </Button>
            {/* <MapModals clicked={clicked} /> */}

            <Container id="chart" fluid={true} style={{ height: '100%' }}>
                <Row style={{ height: '100%', paddingBottom: 50 }}>
                    <Col
                        xs={6}
                        style={{ paddingBottom: '50px', paddingLeft: '0px' }}
                    >
                        <div id="fm" ref={inputEl} />
                        {/* <HighGamma></HighGamma> */}
                    </Col>
                </Row>
            </Container>
        </div>
    )
}
export default Map
