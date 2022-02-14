import React, { useState } from 'react'

export const Context = React.createContext(null)

export const MyProvider = (props: any) => {
    const [subjects, setSubjects] = useState([''])
    const [activeSubject, setActiveSubject] = useState(null)
    const [brainType, setBrainType] = useState<String>('2D')
    const [activeRecord, setActiveRecord] = useState('')
    const [records, setRecords] = useState({
        hg: [],
        ep: [],
        ccsr: [],
    })

    const [rasterSize, setRasterSize] = useState(1)
    const [rasterGain, setRasterGain] = useState(3)
    const [twoDReconstructionCircles, setTwoDReconstructionCircles] = useState(
        null
    )
    const [threeDScene, setThreeDScene] = useState()
    const [homunculusSelection, setHomunculusSelection] = useState()
    const [threeDElectrodes, setThreeDElectrodes] = useState()
    const [activeElec1, setActiveElec1] = useState('Electrode 1')
    const [activeElec2, setActiveElec2] = useState('Electrode 2')
    const [cortstimParams, setCortstimParams] = useState({
        current: 5,
        duration: 5,
        freq: 50,
    })
    const [cortstimNotes, setCortstimNotes] = useState('Type in some notes')
    const [annotator, setAnnotator] = useState('')
    const [annotateDate, setAnnotationDate] = useState('')
    return (
        <Context.Provider
            value={{
                subjects,
                setSubjects,
                activeSubject,
                setActiveSubject,
                brainType,
                setBrainType, // 2D or //3D
                records,
                setRecords, // all records for active subject
                activeRecord,
                setActiveRecord, // current record
                rasterSize,
                setRasterSize, // Zoom in/out on raster
                rasterGain,
                setRasterGain, // Change gain on raster
                twoDReconstructionCircles,
                setTwoDReconstructionCircles,
                threeDElectrodes,
                setThreeDElectrodes,
                activeElec1,
                setActiveElec1,
                activeElec2,
                setActiveElec2,
                cortstimParams,
                setCortstimParams,
                homunculusSelection,
                setHomunculusSelection,
                cortstimNotes,
                setCortstimNotes,
                threeDScene,
                setThreeDScene,
                annotator,
                setAnnotator,
                annotateDate,
                setAnnotationDate,
            }}
        >
            {props.children}
        </Context.Provider>
    )
}
