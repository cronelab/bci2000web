import React, { useContext, useEffect, useState, useRef } from 'react'
import { Context } from '../../Context'
import { Container, Row, Col, OverlayTrigger, Tooltip } from 'react-bootstrap'
import Brain_2D from '../BrainContainers/Brain_2D'
import { Model } from '../BrainContainers/Brain_3D'
import { pullRecordEP } from '../../helpers/pullElectrophyisiologicalData'
import DataHeader from '../Headers/DataHeader'
import * as d3 from 'd3'
import { selectAll, select, mouse } from 'd3-selection'
import * as horizon from 'd3-horizon-chart'

export default function CCSR() {
    const { brainType, activeRecord, activeSubject, rasterSize } = useContext(
        Context
    )
    const [height, setHeight] = useState(0)
    const [width, setWidth] = useState(0)

    const [displayData, setDisplayData] = useState([])
    const [isMounted, setIsMounted] = useState(false)

    const fmRef = useRef()
    const sleep = (m) => new Promise((r) => setTimeout(r, m))

    useEffect(() => {
        ;(async () => {
            let record = await pullRecordEP(
                activeSubject,
                `${activeRecord}_CCSR`,
                'CCSR'
            )
            console.log(record)
            let _displayData = {}
            Object.keys(record).forEach((x) => {
                _displayData[x] = record[x].times
            })
            //@ts-ignore
            setDisplayData(_displayData)
            sleep(5000)
            setIsMounted(true)
        })()
    }, [])

    useEffect(() => {
        let chartContainer = document.getElementById('fm')
        if (isMounted) {
            d3.selectAll('.horizon')
                .data(Object.values(displayData))
                .each(
                    horizon
                        .horizonChart()
                        .height(15 / rasterSize)
                        .step(
                            chartContainer.offsetWidth /
                                displayData[Object.keys(displayData)[0]].length
                        )
                    // .colors(colors[rasterGain])
                )
                .select('.title')
                .text((d, i) => Object.keys(displayData)[i])
                .style('font', '8px times')

            setHeight(chartContainer.offsetHeight)
            setWidth(chartContainer.offsetWidth)
        }
    }, [isMounted])

    return (
        <>
            <DataHeader></DataHeader>
            <Container fluid>
                <Row>
                    <Col>
                        <div
                            id="fm"
                            ref={fmRef}
                            style={{
                                height: `${window.innerHeight * 0.8}px`,
                                overflow: 'auto',
                            }}
                        >
                            {/* {isMounted ? <StimulationOnset></StimulationOnset> : <div></div>} */}
                            {isMounted &&
                                Object.keys(displayData).map((channel) => {
                                    return (
                                        <div
                                            className="horizon"
                                            key={`${channel}_horizon`}
                                            id={`${channel}_horizon`}
                                            style={{
                                                outline: 'thin solid black',
                                            }}
                                            // onMouseOver={e => console.log(mouse(document.getElementsByClassName("horizon")[0]))}
                                        ></div>
                                    )
                                })}
                        </div>
                    </Col>
                    <Col>
                        {brainType == '2D' ? (
                            <Brain_2D></Brain_2D>
                        ) : (
                            <Model></Model>
                        )}
                    </Col>
                </Row>
            </Container>
        </>
    )
}
