import React, { useState, useContext, useEffect } from 'react'
import {
    interpolateRdBu,
    interpolatePuOr,
    interpolateRdYlBu,
    interpolateSpectral,
    interpolatePlasma,
} from 'd3-scale-chromatic'
import { select } from 'd3-selection'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import { Context } from '../Context'

export function HeatMap() {
    const [data, setData] = useState(0)
    const [electrodeNames, setElectrodeNames] = useState([])
    const [minVal, setMinVal] = useState()
    const [maxVal, setMaxVal] = useState(0)
    const [responses, setResponses] = useState({ timePoint: 0, value: 0 })

    const { brainCoord, mapData, setMapData } = useContext(Context)
    const sleep = (m) => new Promise((r) => setTimeout(r, m))

    useEffect(() => {
        var urlParams = new URLSearchParams(window.location.search)

        let recordType = urlParams.get('type') || 'HG'
        let recordName = urlParams.get('record')
        let subjectName = urlParams.get('subject')
        ;(async () => {
            let fetchRoute = `/api/data/${subjectName}/${recordName}/${recordType}`
            let response = await fetch(fetchRoute)
            let respData = await response.json()
            //@ts-ignore

            let minVals = []
            let maxVals = []
            let dataset = ''
            if (mapData == '') {
                dataset = 'lgData'
            } else {
                dataset = mapData
            }
            let names = Object.keys(respData.lgData.times).map((channel) => {
                minVals.push(
                    Math.min(...respData[`${dataset}`].times[`${channel}`])
                )
                maxVals.push(
                    Math.max(...respData[`${dataset}`].times[`${channel}`])
                )
                return channel
            })
            //@ts-ignore

            setMinVal(Math.min(...minVals))
            //@ts-ignore
            setMaxVal(Math.max(...maxVals))
            setElectrodeNames(names)

            //@ts-ignore
            setResponses(respData[`${dataset}`]['sscore'])

            setData(respData[`${dataset}`].times)
        })()
    }, [mapData])

    const mouseEntered = (elec) => {
        let channelSelected = elec
        let electrodeDot = document.getElementById(`${channelSelected}_circle`)
        select(electrodeDot).attr('fill', 'red').attr('r', '10')
    }
    const mouseLeft = (elec) => {
        let channelSelected = elec
        let electrodeDot = document.getElementById(`${channelSelected}_circle`)
        select(electrodeDot).attr('fill', 'white').attr('r', '2')
    }

    const HMap = (props) => {
        let mapHolder = document.getElementById('mapHolder')
        //@ts-ignore
        let svgWidth = mapHolder.width.baseVal.value
        //@ts-ignore
        let svgHeight = mapHolder.height.baseVal.value

        let parsedCoords = JSON.parse(brainCoord)
        let locData = {}
        parsedCoords.props.children.forEach((dot) => {
            let key = dot.key.split('_')[0]
            locData[key] = dot.props['data-location']
        })
        return (
            <OverlayTrigger
                placement="auto"
                overlay={
                    <Tooltip id={`tooltip-${props.elec}`}>
                        <div>
                            {props.elec}
                            <br />
                            ER:{' '}
                            <strong>{`${parseFloat(
                                responses[`${props.elec}`].ER[1]
                            ).toFixed(1)} @ ${
                                responses[`${props.elec}`].ER[0]
                            }`}</strong>
                            .
                            <br />
                            DR:{' '}
                            <strong>{`${
                                parseFloat(
                                    responses[`${props.elec}`].DR[1]
                                ).toFixed(1) + 451
                            } @ ${responses[`${props.elec}`].DR[0]}`}</strong>
                            .<br></br>
                            <strong>{locData[props.elec]}</strong>
                        </div>
                    </Tooltip>
                }
            >
                <svg
                    id={props.elec}
                    key={`${props.elec}_heatMap`}
                    onMouseEnter={() => mouseEntered(props.elec)}
                    onMouseLeave={() => mouseLeft(props.elec)}
                >
                    {/* //@ts-ignore */}
                    {data[props.elec].map((timePoint, i) => {
                        // let color = interpolateRdBu((timePoint + minVal) / maxVal);
                        // let color = interpolateSpectral((timePoint + minVal) / maxVal);

                        let color = interpolatePlasma(
                            (timePoint + minVal) / maxVal
                        )
                        return (
                            <rect
                                key={`${props.elec}_heatMap_${i}`}
                                x={(i * svgWidth) / data[props.elec].length}
                                y={
                                    (props.elecIndex * svgHeight) /
                                    Object.keys(data).length
                                }
                                width={svgWidth / data[props.elec].length}
                                height={svgHeight / Object.keys(data).length}
                                // stroke={"rgb(0,0,0)"}
                                fill={color}
                            ></rect>
                        )
                    })}
                </svg>
            </OverlayTrigger>
        )
    }

    return (
        <svg id="mapHolder" width={'100%'} height={'100%'}>
            {data ? (
                <>
                    <g transform={'translate(40,10)'}></g>
                    <g transform={'translate(0,10)'}>
                        {electrodeNames.map((name, i) => {
                            return (
                                <text
                                    key={`${name}_text`}
                                    style={{ font: '8px' }}
                                    //@ts-ignore
                                    // y={
                                    //     (i *
                                    //         document.getElementById('mapHolder')
                                    //             .height.baseVal.value) /
                                    //     Object.keys(data).length
                                    // }
                                >
                                    {name}
                                </text>
                            )
                        })}
                    </g>
                    <g transform={'translate(0,0)'}>
                        {electrodeNames.map((elec, elecIndex) => {
                            return (
                                <HMap
                                    key={`${elec}_HMap`}
                                    elecIndex={elecIndex}
                                    elec={elec}
                                ></HMap>
                            )
                        })}
                    </g>
                </>
            ) : (
                <div></div>
            )}
        </svg>
    )
}
