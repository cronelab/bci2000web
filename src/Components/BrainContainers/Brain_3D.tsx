// @ts-nocheck
import React, { useRef, useState, useContext, Suspense, useEffect } from 'react'
import { OrthographicCamera, OrbitControls } from '@react-three/drei'

import { Context } from '../../Context'
import { fetchAnatomicalLocations } from '../../helpers/pullAnatomicalData'
import { useLoader, Canvas, useFrame } from 'react-three-fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { Mesh, Color } from 'three'
import { withControls, Controls, useControl } from 'react-three-gui'
import { Canvas } from 'react-three-fiber'

function Brain_3D(props) {
    let first = true
    let initialGyriColorsDeclared = false
    let initialSubcortColorsDeclared = false

    const elecInfoRef = useRef()

    const subCortRef = useRef()
    const gyriRef = useRef()
    const wmRef = useRef()

    const cam = useRef()
    const lightRef = useRef()
    const brainRef = useRef()
    const electrodeRef = useRef()
    const controlRef = useRef()

    const brain = useLoader(GLTFLoader, `/api/brain/3D/${props.activeSubject}`)
    const electrodes = useLoader(
        GLTFLoader,
        `/api/geometry/3D/${props.activeSubject}`
    )

    const [labels, setLabels] = useState([])
    useEffect(() => {
        ;(async () => {
            let anatomy = await fetchAnatomicalLocations(props.activeSubject)
            if (anatomy != null) {
                let data = anatomy.map((element) => {
                    return {
                        name: element[0],
                        location: element[4],
                    }
                })
                setLabels(data)
            }
        })()
    }, [])

    const { Electrodes } = electrodes.nodes
    props.setThreeDElectrodes(Electrodes)
    const { Gyri, SubcorticalStructs, WhiteMatter } = brain.nodes

    const [allowHover, setAllowHover] = useState(false)
    const [selectedGyri, setSelectedGyri] = useState(
        'Click a gyri to display name'
    )
    const [elecState, setElecState] = useState(
        'Hover over an electrode to view location'
    )

    const subcortTransparency = useControl('Transparency: Subcort', {
        type: 'number',
        min: 0,
        max: 1,
        value: 0.5,
    })
    const gyriTransparency = useControl('Transparency: Gyri', {
        type: 'number',
        min: 0,
        max: 1,
        value: 0,
    })
    const wmTransparency = useControl('Transparency: WM', {
        type: 'number',
        min: 0,
        max: 1,
        value: 0.8,
    })

    const gyriGrayScale = useControl('Gyri colors: grayscale', {
        type: 'boolean',
        value: false,
    })
    const subcortGrayScale = useControl('Subcort colors: grayscale', {
        type: 'boolean',
        value: false,
    })
    const disableElectrode = useControl('Disable electrodes?', {
        type: 'boolean',
        value: false,
    })

    useEffect(() => {
        if (initialGyriColorsDeclared === false) {
            initialGyriColorsDeclared = gyriRef.current.children.map(
                (mat) => mat.material.color
            )
        }
        if (gyriGrayScale === true)
            gyriRef.current.children.map((mat) => {
                mat.material.color = new Color('rgb(255,255,255)')
                mat.material.opacity = 1
            })
        else if (gyriGrayScale === false) {
            gyriRef.current.children.map((mat, i) => {
                mat.material.color = initialGyriColorsDeclared[i]
                mat.material.opacity = 0
            })
        }
    }, [gyriGrayScale])

    useEffect(() => {
        if (initialSubcortColorsDeclared === false) {
            initialSubcortColorsDeclared = subCortRef.current.children.map(
                (mat) => {
                    if (mat instanceof Mesh) {
                        return mat.material.color
                    } else {
                        return null
                    }
                }
            )
        }
        if (subcortGrayScale === true)
            subCortRef.current.children.map((mat) => {
                if (mat instanceof Mesh) {
                    mat.material.color = new Color('rgb(50,50,50)')
                    mat.materialopacity = 1
                }
            })
        else if (subcortGrayScale === false) {
            subCortRef.current.children.map((mat, i) => {
                if (mat instanceof Mesh) {
                    mat.material.color = initialSubcortColorsDeclared[i]
                    mat.materialopacity = 0
                }
            })
        }
    }, [subcortGrayScale])

    useControl('Test', {
        type: 'custom',
        name: 'Elec state',
        value: elecState,
        component: () => <div ref={elecInfoRef}>{elecState}</div>,
    })
    const gyriNameRef = useRef()
    useControl('selectedgyri', {
        type: 'custom',
        value: selectedGyri,
        component: () => <div ref={gyriNameRef}>{selectedGyri}</div>,
    })

    useEffect(() => {
        electrodeRef.current.children.forEach((child) => {
            child.traverse((electrode) => {
                electrode.visible = !disableElectrode
            })
        })
    }, [disableElectrode])

    useEffect(() => {
        if (subcortTransparency === 0) {
            subCortRef.current.visible = false
        } else {
            subCortRef.current.visible = true
        }
        subCortRef.current.traverse((child) => {
            if (child instanceof Mesh) {
                child.material.transparent = true
                child.material.opacity = subcortTransparency
            }
        })
    }, [subcortTransparency])

    useEffect(() => {
        if (wmTransparency === 0) {
            wmRef.current.visible = false
        } else {
            wmRef.current.visible = true
        }
        wmRef.current.traverse((child) => {
            if (child instanceof Mesh) {
                child.material.transparent = true
                child.material.opacity = wmTransparency
            }
        })
    }, [wmTransparency])

    useEffect(() => {
        if (gyriTransparency === 0) {
            gyriRef.current.visible = false
        } else {
            gyriRef.current.visible = true
        }
        gyriRef.current.traverse((child) => {
            if (child instanceof Mesh) {
                child.material.transparent = true
                child.material.opacity = gyriTransparency
            }
        })
    }, [gyriTransparency])
    const [isHovered, setIsHovered] = useState(false)
    const [isActive, setIsActive] = useState(false)

    useFrame(({ camera, scene }) => {
        lightRef.current.position.copy(camera.position)
        //    console.log(electrodeRef)
    })
    //renderOrder
    useEffect(() => {
        if (controlRef.current && first === true) {
            first = false
            controlRef.current.addEventListener('end', (e) =>
                setAllowHover(true)
            )
            controlRef.current.addEventListener('start', (e) =>
                setAllowHover(false)
            )
        }
    }, [controlRef.current || first])

    return (
        <group dispose={null}>
            <directionalLight ref={lightRef} position={[0, 0, -400]} />
            <OrthographicCamera ref={cam} position={[0, 0, 0]} zoom={0} />
            <OrbitControls
                ref={controlRef}
                rotateSpeed={2}
                target0={brainRef}
            />

            <primitive
                onClick={(e) => {
                    e.stopPropagation()
                    e.object.scale.set(1.5, 1.5, 1.5)
                    gyriNameRef.current.innerText = `Selected gyri: ${e.object.name}`
                    setTimeout(() => {
                        gyriNameRef.current.innerText = `Select a gyri`
                        e.object.scale.set(1, 1, 1)
                    }, 1000)
                }}
                ref={gyriRef}
                {...props}
                object={Gyri}
            ></primitive>
            <primitive ref={wmRef} {...props} object={WhiteMatter}></primitive>
            <primitive
                ref={subCortRef}
                {...props}
                object={SubcorticalStructs}
            ></primitive>
            <primitive
                ref={electrodeRef}
                object={Electrodes}
                {...props}
                onPointerOver={(e) => {
                    e.stopPropagation()
                    //   console.log(e.object)
                    e.object.scale.set(3, 3, 3)
                    let location = labels.filter((label) => {
                        let withoutApost = label.name.split("'")
                        if (
                            withoutApost[0] + withoutApost[1] ===
                            e.object.name
                        ) {
                            return label
                        } else {
                            return null
                        }
                    })
                    elecInfoRef.current.innerText = `${e.object.name}: ${location[0].location}`
                }}
                onPointerOut={(e) => {
                    elecInfoRef.current.innerText = `Hover over another electrode`

                    e.object.scale.set(1, 1, 1)
                }}
            ></primitive>
        </group>
    )
}

export function Model(props) {
    const { activeSubject, setThreeDElectrodes } = useContext(Context)
    const YourCanvas = withControls(Canvas)

    return (
        <Controls.Provider>
            <YourCanvas
                style={{ backgroundColor: 'black' }}
                color={'black'}
                colorManagement
                pixelRatio={window.devicePixelRatio}
                orthographic
                camera={{ position: [0, 0, -400], fov: 70 }}
            >
                <Suspense fallback={null}>
                    <Brain_3D
                        setThreeDElectrodes={setThreeDElectrodes}
                        activeSubject={activeSubject}
                        rotation={[-Math.PI / 2, 0, Math.PI / 2]}
                        position={[0, 0, 0]}
                    ></Brain_3D>
                </Suspense>
            </YourCanvas>
            <Controls title="Patient #" anchor="bottom_right" />
        </Controls.Provider>
    )
}
