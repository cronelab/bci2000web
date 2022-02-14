//@ts-nocheck
import React, { useRef, useState, useEffect, useContext } from 'react'

import Image from 'react-bootstrap/Image'
import motor_homunculus from '../../../assets/motor_homunculus.jpg'
import sensory_homunculus from '../../../assets/sensory_homunculus.jpg'

import { Context } from '../../../Context'

const HomunculusSquare = (props) => {
    const { setHomunculusSelection, homunculusSelection } = useContext(Context)
    let circleRef = useRef()
    let { xPos, yPos, color, description } = props
    return (
        <circle
            ref={circleRef}
            //@ts-ignore
            transform={`translate(${xPos} ${yPos})`}
            r="18"
            fill={color}
            fillOpacity=".2"
            stroke={'black'}
            onClick={() => {
                let circleColor = circleRef.current.getAttribute('fill')
                if (circleColor == 'green') {
                    circleRef.current.setAttribute('fill', 'red')
                } else {
                    circleRef.current.setAttribute('fill', 'green')
                }
                if (homunculusSelection != undefined) {
                    setHomunculusSelection(
                        `${homunculusSelection}_${description}`
                    )
                } else {
                    setHomunculusSelection(description)
                }
            }}
        />
    )
}

const MotorHomunculus = () => {
    const motorRef = useRef()
    const [height, setHeight] = useState(0)
    const [width, setWidth] = useState(0)

    useEffect(() => {
        if (motorRef.current != undefined) {
            //@ts-ignore
            setWidth(motorRef.current.clientWidth)
            //@ts-ignore
            setHeight(motorRef.current.clientHeight)
        }
    }, [motorRef.current])

    useEffect(() => {
        function handleResize() {
            //@ts-ignore
            setHeight(motorRef.current.clientHeight)
            //@ts-ignore
            setWidth(motorRef.current.clientWidth)
        }

        window.addEventListener('resize', handleResize)
    })
    useEffect(() => {
        ;(async () => {
            await new Promise((resolve) => setTimeout(resolve, 500))

            window.dispatchEvent(new Event('resize'))
        })()
    }, [])

    const [colors, setColors] = useState('')

    return (
        <>
            <Image
                ref={motorRef}
                style={{ width: '100%', height: '100%' }}
                src={motor_homunculus}
            ></Image>
            <svg
                style={{
                    zIndex: 1,
                    position: 'absolute',
                    left: '0',
                    width: '100%',
                    height: '100%',
                }}
            >
                {height != 0 ? (
                    <>
                        <HomunculusSquare
                            xPos={0.137 * width}
                            yPos={0.474 * height}
                            description="Toes"
                            rotation="0"
                            color="green"
                        ></HomunculusSquare>
                        <HomunculusSquare
                            //@ts-ignore
                            xPos={0.06 * width}
                            yPos={0.17 * height}
                            description="Knee"
                            rotation="55"
                            color="green"
                        ></HomunculusSquare>
                        <HomunculusSquare
                            xPos={0.15 * width}
                            yPos={0.15 * height}
                            description="Trunk"
                            rotation="75"
                            color="green"
                        ></HomunculusSquare>
                        <HomunculusSquare
                            xPos={0.28 * width}
                            yPos={0.12 * height}
                            description="Shoulder"
                            rotation="90"
                            color="green"
                        ></HomunculusSquare>
                        <HomunculusSquare
                            xPos={0.353 * width}
                            yPos={0.11 * height}
                            description="Arm"
                            rotation="105"
                            color="green"
                        ></HomunculusSquare>
                        <HomunculusSquare
                            xPos={0.438 * width}
                            yPos={0.125 * height}
                            description="Elbow"
                            rotation="105"
                            color="green"
                        ></HomunculusSquare>
                        <HomunculusSquare
                            xPos={0.506 * width}
                            yPos={0.125 * height}
                            description="Wrist"
                            rotation="105"
                            color="green"
                        ></HomunculusSquare>
                        <HomunculusSquare
                            xPos={0.6 * width}
                            yPos={0.18 * height}
                            description="Fingers"
                            rotation="105"
                            color="green"
                        ></HomunculusSquare>
                        <HomunculusSquare
                            xPos={0.67 * width}
                            yPos={0.19 * height}
                            description="Thumb"
                            rotation="105"
                            color="green"
                        ></HomunculusSquare>
                        <HomunculusSquare
                            xPos={0.75 * width}
                            yPos={0.29 * height}
                            description="Neck"
                            rotation="105"
                            color="green"
                        ></HomunculusSquare>
                        <HomunculusSquare
                            xPos={0.8 * width}
                            yPos={0.37 * height}
                            description="Brow"
                            rotation="110"
                            color="green"
                        ></HomunculusSquare>
                        <HomunculusSquare
                            xPos={0.84 * width}
                            yPos={0.41 * height}
                            description="Eye"
                            rotation="115"
                            color="green"
                        ></HomunculusSquare>
                        <HomunculusSquare
                            xPos={0.87 * width}
                            yPos={0.5 * height}
                            description="Face"
                            rotation="125"
                            color="green"
                        ></HomunculusSquare>
                        <HomunculusSquare
                            xPos={0.875 * width}
                            yPos={0.58 * height}
                            description="Lips"
                            rotation="145"
                            color="green"
                        ></HomunculusSquare>
                        <HomunculusSquare
                            xPos={0.91 * width}
                            yPos={0.66 * height}
                            description="Jaw"
                            rotation="165"
                            color="green"
                        ></HomunculusSquare>
                        <HomunculusSquare
                            xPos={0.91 * width}
                            yPos={0.74 * height}
                            description="Tongue"
                            rotation="180"
                            color="green"
                        ></HomunculusSquare>
                        <HomunculusSquare
                            xPos={0.92 * width}
                            yPos={0.81 * height}
                            description="Pharynx"
                            rotation="190"
                            color="green"
                        ></HomunculusSquare>
                    </>
                ) : (
                    <></>
                )}
            </svg>
        </>
    )
}

const SensoryHomunculus = () => {
    const sensoryRef = useRef()
    const [height, setHeight] = useState()
    const [width, setWidth] = useState()
    useEffect(() => {
        window.dispatchEvent(new Event('resize'))
    }, [])

    useEffect(() => {
        if (sensoryRef.current != undefined) {
            //@ts-ignore
            setWidth(sensoryRef.current.clientWidth)
            //@ts-ignore
            setHeight(sensoryRef.current.clientHeight)
        }
    }, [sensoryRef.current])

    useEffect(() => {
        function handleResize() {
            //@ts-ignore
            setHeight(sensoryRef.current.clientHeight)
            //@ts-ignore
            setWidth(sensoryRef.current.clientWidth)
        }

        window.addEventListener('resize', handleResize)
    })
    useEffect(() => {
        ;(async () => {
            await new Promise((resolve) => setTimeout(resolve, 500))

            window.dispatchEvent(new Event('resize'))
        })()
    }, [])

    return (
        <>
            <Image
                src={sensory_homunculus}
                ref={sensoryRef}
                style={{ width: '100%' }}
            ></Image>
            <svg
                style={{
                    zIndex: 1,
                    position: 'absolute',
                    left: '0',
                    width: '100%',
                    height: '100%',
                }}
            >
                {height != 0 ? (
                    <>
                        <HomunculusSquare
                            //@ts-ignore
                            xPos={0.11 * width}
                            yPos={0.55 * height}
                            description="Lips"
                            rotation="10"
                            color="green"
                        ></HomunculusSquare>
                        <HomunculusSquare
                            //@ts-ignore
                            xPos={0.22 * width}
                            yPos={0.31 * height}
                            description="Eye"
                            rotation="65"
                            color="green"
                        ></HomunculusSquare>
                        <HomunculusSquare
                            xPos={0.27 * width}
                            yPos={0.25 * height}
                            description="Thumb"
                            rotation="45"
                            color="green"
                        ></HomunculusSquare>
                        <HomunculusSquare
                            xPos={0.35 * width}
                            yPos={0.2 * height}
                            description="Fingers"
                            rotation="45"
                            color="green"
                        ></HomunculusSquare>
                        <HomunculusSquare
                            xPos={0.42 * width}
                            yPos={0.17 * height}
                            description="Hand"
                            rotation="45"
                            color="green"
                        ></HomunculusSquare>
                        <HomunculusSquare
                            xPos={0.47 * width}
                            yPos={0.12 * height}
                            description="Forearm"
                            rotation="75"
                            color="green"
                        ></HomunculusSquare>
                        <HomunculusSquare
                            xPos={0.6 * width}
                            yPos={0.1 * height}
                            description="Arm"
                            rotation="85"
                            color="green"
                        ></HomunculusSquare>
                        <HomunculusSquare
                            xPos={0.55 * width}
                            yPos={0.11 * height}
                            description="Elbow"
                            rotation="85"
                            color="green"
                        ></HomunculusSquare>
                        <HomunculusSquare
                            xPos={0.7 * width}
                            yPos={0.09 * height}
                            description="Head"
                            rotation="90"
                            color="green"
                        ></HomunculusSquare>
                        <HomunculusSquare
                            xPos={0.77 * width}
                            yPos={0.1 * height}
                            description="Neck"
                            rotation="105"
                            color="green"
                        ></HomunculusSquare>
                        <HomunculusSquare
                            xPos={0.85 * width}
                            yPos={0.115 * height}
                            description="Hip"
                            rotation="105"
                            color="green"
                        ></HomunculusSquare>
                        <HomunculusSquare
                            xPos={0.95 * width}
                            yPos={0.12 * height}
                            description="Knee"
                            rotation="105"
                            color="green"
                        ></HomunculusSquare>
                        <HomunculusSquare
                            xPos={0.155 * width}
                            yPos={0.37 * height}
                            description="Nose"
                            rotation="200"
                            color="green"
                        ></HomunculusSquare>
                        <HomunculusSquare
                            xPos={0.14 * width}
                            yPos={0.45 * height}
                            description="Face"
                            rotation="190"
                            color="green"
                        ></HomunculusSquare>
                        <HomunculusSquare
                            xPos={0.08 * width}
                            yPos={0.62 * height}
                            description="Teeth"
                            rotation="195"
                            color="green"
                        ></HomunculusSquare>
                        <HomunculusSquare
                            xPos={0.075 * width}
                            yPos={0.75 * height}
                            description="Gums"
                            rotation="185"
                            color="green"
                        ></HomunculusSquare>
                        <HomunculusSquare
                            xPos={0.09 * width}
                            yPos={0.81 * height}
                            description="Tongue"
                            rotation="170"
                            color="green"
                        ></HomunculusSquare>
                    </>
                ) : (
                    <></>
                )}
            </svg>
        </>
    )
}

export { SensoryHomunculus, MotorHomunculus }
