import React, { useEffect, useContext, useState, useRef } from 'react'
import { pullRecordHG } from '../../helpers/pullElectrophyisiologicalData'
import { Context } from '../../Context'
import { fmdata } from '../../helpers/fmdata'
import * as horizon from 'd3-horizon-chart'
import * as d3 from 'd3'
import Brain_2D from '../BrainContainers/Brain_2D'
import { Model } from '../BrainContainers/Brain_3D'
import './Record.scss'
import { Container, Row, Col } from 'react-bootstrap'
import DataHeader from '../Headers/DataHeader'
import { interpolateRdBu } from 'd3-scale-chromatic'
import { selectAll, select, pointer } from 'd3-selection'
import { range, ticks } from 'd3-array'
import { Mesh, Color } from 'three'
import { dotColorScale } from '../../helpers/mutateElectrodes'
// import Colorbar from './Submodules/Colorbar'
export default function FunctionalMapping() {
    const {
        activeSubject,
        brainType,
        activeRecord,
        rasterSize,
        rasterGain,
        twoDReconstructionCircles,
        threeDElectrodes,
    } = useContext(Context)
    const [displayData, setDisplayData] = useState([])
    const [isMounted, setIsMounted] = useState(false)
    const [height, setHeight] = useState(0)
    const [width, setWidth] = useState(0)
    const [dataset, setDataset] = useState()
    const colors = [
        [interpolateRdBu(0), interpolateRdBu(1)],
        [
            interpolateRdBu(0),
            interpolateRdBu(0.33),
            interpolateRdBu(0.66),
            interpolateRdBu(1),
        ],
        [
            interpolateRdBu(0),
            interpolateRdBu(0.2),
            interpolateRdBu(0.4),
            interpolateRdBu(0.6),
            interpolateRdBu(0.8),
            interpolateRdBu(1),
        ],
        [
            interpolateRdBu(0),
            interpolateRdBu(0.142),
            interpolateRdBu(0.284),
            interpolateRdBu(0.426),
            interpolateRdBu(0.568),
            interpolateRdBu(0.71),
            interpolateRdBu(0.852),
            interpolateRdBu(0.994),
            interpolateRdBu(1),
        ],
        [
            interpolateRdBu(0),
            interpolateRdBu(0.11),
            interpolateRdBu(0.22),
            interpolateRdBu(0.33),
            interpolateRdBu(0.44),
            interpolateRdBu(0.55),
            interpolateRdBu(0.66),
            interpolateRdBu(0.77),
            interpolateRdBu(0.88),
            interpolateRdBu(0.99),
        ],
        [
            interpolateRdBu(0),
            interpolateRdBu(0.091),
            interpolateRdBu(0.182),
            interpolateRdBu(0.273),
            interpolateRdBu(0.364),
            interpolateRdBu(0.455),
            interpolateRdBu(0.546),
            interpolateRdBu(0.637),
            interpolateRdBu(0.728),
            interpolateRdBu(0.819),
            interpolateRdBu(0.91),
            interpolateRdBu(1),
        ],
    ]

    useEffect(() => {
        ;(async () => {
            let _dataset = new fmdata()
            // let record = await pullRecordHG(activeSubject, activeRecord);

            const recReq = await fetch(
                `/api/data/HG/${activeSubject}/${activeRecord}`
            )

            let record = await recReq.json()
            await _dataset.get(record)
            setDisplayData(_dataset.displayData)
            //@ts-ignore
            setDataset(_dataset)
            setIsMounted(true)
        })()
    }, [])

    useEffect(() => {
        let chartContainer = document.getElementById('fm')
        if (isMounted) {
            let dataMax = Object.values(displayData).map((x, i) => {
                if (
                    !Object.keys(displayData)[i].startsWith('ainp') &&
                    !Object.keys(displayData)[i].startsWith('DC')
                ) {
                    return Math.max(...x)
                } else {
                    return 0
                }
            })
            let dataMin = Object.values(displayData).map((x) => Math.min(...x))

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

            let data = ticks(
                Math.min(...dataMin),
                Math.max(...dataMax),
                chartContainer.offsetHeight / 5
            ).reverse()
            console.log(chartContainer.offsetHeight)
            console.log(data)
            //@ts-ignore
            let svg = select('#colorbarDiv')
                .append('svg')
                .attr('width', 60)
                .attr('height', chartContainer.offsetHeight)

            let colorRows = svg
                .selectAll('.firstrow')
                .data(data)
                .enter()
                .append('rect')
                .attr('height', 5)
                .attr('width', 30)
                .attr('y', (d, i) => i * 5)
                .attr('x', 0)
                .attr('fill', (d) => dotColorScale(d))

            let group = colorRows._groups[0]
            console.log(group)
            if (group.length > 0) {
                svg.append('text')
                    .attr('font-family', 'FontAwesome')
                    .attr('font-size', 15)
                    .attr('y', 10)
                    .attr('x', 30)
                    .text(group[0].__data__.toString())

                svg.append('text')
                    .attr('font-family', 'FontAwesome')
                    .attr('font-size', 15)
                    .attr('y', chartContainer.offsetHeight - 10)
                    .attr('x', 30)
                    .text(group[group['length'] - 1].__data__.toString())
            }
        }
    }, [isMounted])

    useEffect(() => {
        let chartContainer = document.getElementById('fm')
        if (isMounted) {
            d3.selectAll('.horizon > *').remove()

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
        }
    }, [rasterSize, rasterGain])

    const cursorLine = useRef()
    const fmRef = useRef()

    const StimulationOnset = () => {
        return (
            <svg
                className="fm-cursor-svg"
                style={{
                    position: 'fixed',
                    zIndex: 100,
                    pointerEvents: 'none',
                    height: `${window.innerHeight * 0.8}px`,
                    width: '100%',
                }}
            >
                <line
                    className="zeroLine"
                    style={{
                        stroke: 'black',
                    }}
                    strokeWidth={3}
                    x1={196}
                    x2={196}
                    y1={0}
                    y2={`${window.innerHeight * 0.8}px`}
                />
                <line
                    ref={cursorLine}
                    className="cursorLine"
                    style={{ stroke: 'red' }}
                    strokeWidth={3}
                    y1={0}
                    y2={`${window.innerHeight * 0.8}px`}
                />
            </svg>
        )
    }
    selectAll('.horizon').on('mousemove', () => {
        let firstHorizon = document.getElementsByClassName('horizon')[0]
        //@ts-ignore
        let position = pointer(firstHorizon)[0]
        if (cursorLine.current) {
            //@ts-ignore
            cursorLine.current.setAttribute('x1', position)
            //@ts-ignore
            cursorLine.current.setAttribute('x2', position)
        }
        let zedIndex = Math.floor(
            position /
                //@ts-ignore
                (firstHorizon.offsetWidth /
                    Object.values(displayData)[0].length)
        )
        let vals = {}
        Object.keys(displayData).forEach((x, i) => {
            let elec = document.getElementById(`${x}_circle`)
            if (elec && brainType == '2D') {
                if (displayData[x][zedIndex] != 0) {
                    vals[x] = displayData[x][zedIndex]
                    elec.setAttribute(
                        'fill',
                        dotColorScale(displayData[x][zedIndex])
                    )
                    elec.setAttribute(
                        'r',
                        (Math.abs(displayData[x][zedIndex]) * 5 + 5).toString()
                    )
                } else {
                    elec.setAttribute('fill', 'white')
                    elec.setAttribute('r', '2.5')
                }
            } else if (brainType == '3D') {
                if (displayData[x][zedIndex] != 0) {
                    threeDElectrodes.traverse((child) => {
                        if (child instanceof Mesh) {
                            if (child.name == x) {
                                console.log(child.name)
                                let scaleVal =
                                    Math.abs(displayData[x][zedIndex] * 2.5) + 1
                                child.scale.set(scaleVal, scaleVal, scaleVal)
                                // child.material.color.r = dotColorScale(displayData[x][zedIndex]).r
                                // let color = dotColorScale(displayData[x][zedIndex]).split("(");
                                //@ts-ignore
                                child.material.color = new Color(
                                    dotColorScale(displayData[x][zedIndex] * 4)
                                )
                            }
                        }
                    })
                } else {
                    threeDElectrodes.traverse((child) => {
                        if (child instanceof Mesh) {
                            if (child.name == x) {
                                child.scale.set(1, 1, 1)
                            }
                        }
                    })
                }
            }
        })
    })

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
                            {isMounted ? (
                                <StimulationOnset></StimulationOnset>
                            ) : (
                                <div></div>
                            )}
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
                    <Col md={1}>
                        <div id="colorbarDiv"></div>
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
