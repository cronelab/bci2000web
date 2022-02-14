import React, { useContext, useEffect, useState } from 'react'
import Navbar from 'react-bootstrap/Navbar'
import { Context } from '../../Context'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import Modal from 'react-bootstrap/Modal'
import ListGroup from 'react-bootstrap/ListGroup'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import Table from 'react-bootstrap/Table'
import { fetch2DGeometry } from '../../helpers/pullAnatomicalData'
import {
    highlight2DElectrodes,
    highlight3DElectrodes,
} from '../../helpers/mutateElectrodes'
import Button from 'react-bootstrap/Button'
import { Mesh, Color, Material, MeshPhysicalMaterial } from 'three'
// import parse from "csv-parse/lib/sync";

import { Info } from 'react-bootstrap-icons'

export default function CortstimHeader() {
    const {
        activeSubject,
        activeElec1,
        activeElec2,
        setActiveElec1,
        setActiveElec2,
        cortstimParams,
        setCortstimParams,
        setCortstimNotes,
        cortstimNotes,
        threeDElectrodes,
        brainType,
    } = useContext(Context)
    const [electrodeNames, setElectrodeNames] = useState([])

    useEffect(() => {
        ;(async () => {
            let electrodes = await fetch2DGeometry(activeSubject)
            setElectrodeNames(Object.keys(electrodes))
        })()
    }, [activeElec2])

    useEffect(() => {
        if (activeElec1.length > 0) {
            let elecGroup = activeElec1.substring(
                0,
                activeElec1.indexOf(activeElec1.match(/\d+/g)[0])
            )
            let secondElecs = electrodeNames.filter((elec, i) => {
                if (
                    elec.substring(0, elec.indexOf(elec.match(/\d+/g)[0])) ==
                    elecGroup
                ) {
                    return electrodeNames[i]
                }
            })
            setElectrodeNames(secondElecs)
        }
    }, [activeElec1])

    const [dbData, setDbData] = useState()

    const [show, setShow] = useState(false)
    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)

    const [showReport, setShowReport] = useState(false)
    const handleCloseReport = () => setShowReport(false)
    const handleShowReport = () => setShowReport(true)

    function parseJSONToCSVStr(jsonData) {
        let csvStr = `${activeSubject}, ${jsonData.date}
      Electrodes, Time, Task, Current, Frequency, Duration, Result, Notes, Color, Area
      `
        jsonData.results.forEach((x) => {
            if (x.resultingArea == undefined) {
                x.resultingArea = ''
            }
            if (x.cortstimNotes) {
                csvStr += `${x.electrodes}, ${x.time}, ${x.task}, ${
                    x.current
                }, ${x.frequency}, ${x.duration}, ${
                    x.result
                }, ${x.cortstimNotes.replace(',', '.')}, ${x.color}, ${
                    x.resultingArea
                } \n`
            } else {
                csvStr += `${x.electrodes}, ${x.time}, ${x.task}, ${x.current}, ${x.frequency}, ${x.duration}, ${x.result}, null, ${x.color}, ${x.resultingArea} \n`
            }
        })
        return encodeURIComponent(csvStr)
    }

    const sendNewDataToDatabase = async () => {}

    const fetchDataFromDB = async () => {
        let req = await fetch(`/api/data/cortstim/${activeSubject}`)
        let res = await req.json()

        let csvStr = parseJSONToCSVStr(res)
        let dataUri = 'data:text/csv;charset=utf-8,' + csvStr

        let linkElement = document.createElement('a')
        linkElement.setAttribute('href', dataUri)
        linkElement.setAttribute('download', `cortstim_${activeSubject}.csv`)
        linkElement.click()
    }

    const grabDataFromDB = async () => {
        let req = await fetch(`/api/data/cortstim/${activeSubject}`)
        let res = await req.json()
        return res
    }

    const ReportModal = ({ data }) => {
        if (data != undefined) {
            console.log(data)
            return (
                <Modal
                    centered
                    size="xl"
                    // style={{marginLeft: "0px", marginRight: "0px"}}
                    // dialogClassName="modal-100w"
                    show={showReport}
                    onHide={handleCloseReport}
                >
                    <Modal.Title>{`${activeSubject}: ${data.date}`}</Modal.Title>
                    <Modal.Body>
                        <Table hover>
                            <thead>
                                <tr>
                                    <th>Electrodes</th>
                                    <th>Time</th>
                                    <th>Task</th>
                                    <th>Current</th>
                                    <th>Frequency</th>
                                    <th>Duration</th>
                                    <th>Results</th>
                                    <th>Notes</th>
                                    <th>Color</th>
                                    <th>Area</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.results.map((result) => {
                                    return (
                                        <tr>
                                            <th scope="row">
                                                {result.electrodes}
                                            </th>
                                            <th scope="row">{result.time}</th>
                                            <th scope="row">{result.task}</th>
                                            <th scope="row">
                                                {result.current}
                                            </th>
                                            <th scope="row">
                                                {result.frequency}
                                            </th>
                                            <th scope="row">
                                                {result.duration}
                                            </th>
                                            <th scope="row">{result.result}</th>
                                            <th scope="row">{result.notes}</th>
                                            <th scope="row">{result.color}</th>
                                            <th scope="row">{result.area}</th>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </Table>
                    </Modal.Body>
                </Modal>
            )
        } else {
            return <></>
        }
    }

    const handleUpload = (file) => {
        let reader = new FileReader()

        reader.readAsText(file)

        reader.onload = function () {
            //@ts-ignore
            // let data = parse(reader.result, { delimiter: ",", columns: true, from_line: 2  }).map((element) => element);
            console.log(data)
        }

        reader.onerror = function () {
            console.log(reader.error)
        }
    }

    return (
        <>
            <Navbar
                style={{
                    backgroundColor: 'lightgray',
                    zIndex: 999,
                    marginBottom: '10px',
                }}
                expand="lg"
            >
                <Navbar.Brand href="/dashboard">
                    WeBrain - Cortstim
                </Navbar.Brand>
                <Navbar.Brand className="justify-content-center">
                    {activeSubject}
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <NavDropdown
                        title={activeElec1}
                        id="elecSelection1"
                        key={'elec1Nav'}
                    >
                        {electrodeNames ? (
                            electrodeNames.map((name) => (
                                <NavDropdown.Item
                                    key={`${name}_1_item`}
                                    onClick={() => {
                                        if (brainType == '2D') {
                                            highlight2DElectrodes(
                                                name,
                                                'red',
                                                3
                                            )
                                        }
                                        if (brainType == '3D') {
                                            //@ts-ignore
                                            let child = threeDElectrodes.getObjectByName(
                                                name
                                            )
                                            let newMat = child.material.clone()
                                            newMat.color = new Color('red')
                                            child.material = newMat
                                            child.scale.set(3, 3, 3)
                                        }
                                        setActiveElec1(name)
                                    }}
                                >
                                    {name}
                                </NavDropdown.Item>
                            ))
                        ) : (
                            <></>
                        )}
                    </NavDropdown>
                    <NavDropdown
                        title={activeElec2}
                        id="elecSelection2"
                        key={'elec2Nav'}
                    >
                        {electrodeNames ? (
                            electrodeNames.map((name) => (
                                <NavDropdown.Item
                                    key={`${name}_2_item`}
                                    onClick={() => {
                                        if (brainType == '2D') {
                                            highlight2DElectrodes(
                                                name,
                                                'red',
                                                3
                                            )
                                        }
                                        if (brainType == '3D') {
                                            let child = threeDElectrodes.getObjectByName(
                                                name
                                            )
                                            let newMat = child.material.clone()
                                            newMat.color = new Color('red')
                                            child.material = newMat
                                            child.scale.set(3, 3, 3)
                                        }
                                        setActiveElec2(name)
                                    }}
                                >
                                    {name}
                                </NavDropdown.Item>
                            ))
                        ) : (
                            <></>
                        )}
                    </NavDropdown>
                    <Form style={{ width: '90px' }}>
                        <FormControl
                            size="sm"
                            type="text"
                            value={cortstimParams.freq}
                            className="mr-sm-2 text-center"
                            onChange={(e) => {
                                setCortstimParams({
                                    ...cortstimParams,
                                    freq: parseInt(e.target.value),
                                })
                            }}
                        />
                        <Form.Text className="text-muted text-center">
                            Frequency (Hz){' '}
                        </Form.Text>
                    </Form>
                    <Form style={{ width: '90px' }}>
                        <FormControl
                            size="sm"
                            type="text"
                            value={cortstimParams.duration}
                            className="mr-sm-1 text-center"
                            onChange={(e) => {
                                setCortstimParams({
                                    ...cortstimParams,
                                    duration: parseInt(e.target.value),
                                })
                            }}
                        />
                        <Form.Text className="text-muted text-center">
                            Duration (s){' '}
                        </Form.Text>
                    </Form>

                    <Form style={{ width: '90px' }}>
                        <FormControl
                            size="sm"
                            type="text"
                            value={cortstimParams.current}
                            className="mr-sm-3 text-center text-center"
                            onChange={(e) => {
                                setCortstimParams({
                                    ...cortstimParams,
                                    current: parseInt(e.target.value),
                                })
                            }}
                        />
                        <Form.Text className="text-muted text-center">
                            Current (mA)
                        </Form.Text>
                    </Form>

                    <Form style={{ width: '200px' }}>
                        <FormControl
                            size="sm"
                            type="text"
                            value={cortstimNotes}
                            className="mr-sm-3 text-center text-center"
                            onChange={(e) => setCortstimNotes(e.target.value)}
                        />
                        <Form.Text className="text-muted text-center">
                            Notes
                        </Form.Text>
                    </Form>
                    <Button
                        onClick={async () => {
                            await new Promise((resolve) =>
                                setTimeout(resolve, 500)
                            )
                            fetchDataFromDB()
                        }}
                    >
                        Generate Report
                    </Button>
                    <Button
                        onClick={async () => {
                            await new Promise((resolve) =>
                                setTimeout(resolve, 500)
                            )
                            let data = await grabDataFromDB()
                            setDbData(data)
                            setShowReport(true)
                        }}
                    >
                        View Report
                    </Button>
                    <Form>
                        <Form.File>
                            <Form.File.Label>Upload ESM Report</Form.File.Label>
                            <Form.File.Input
                                onChange={(e) =>
                                    handleUpload(e.target.files[0])
                                }
                            ></Form.File.Input>
                        </Form.File>
                    </Form>

                    {/* 
          <Button
            onClick={async () => {
              await new Promise((resolve) => setTimeout(resolve, 500));

              // let data = await grabDataFromDB();
              // setDbData(data);
              // setShowReport(true);
            }}
          >
            Upload Report
          </Button> */}

                    <Info
                        color="royalblue"
                        className="ml-auto"
                        size={30}
                        onClick={handleShow}
                    ></Info>
                </Navbar.Collapse>
            </Navbar>

            <ReportModal data={dbData}></ReportModal>

            <Modal show={show} onHide={handleClose}>
                <Tabs defaultActiveKey="guide" id="uncontrolled-tab-example">
                    <Tab eventKey="guide" title="Guide">
                        <Modal.Body>
                            <ListGroup>
                                <ListGroup.Item>
                                    Select the stimulating electrodes
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    Select the stimulation parameters
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    If titrating, select "No task", if
                                    performing a task, select "Task"
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    If performing a task, select the task from
                                    the "Task description" dropdown
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    If an effect was elicited select which
                                    effect from the "Effect" dropdown, else
                                    select clear
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    If the effect was a motor or sensory
                                    response, select "Motor" or "Sensory" from
                                    the "Effect" dropdown, then select
                                    "Left/Right", then select which area by
                                    clicking on the corresponding circle on the
                                    homunculus image
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    When complete, select the "Trial Complete"
                                    button and run the next stimulation
                                </ListGroup.Item>
                            </ListGroup>
                        </Modal.Body>
                    </Tab>
                    <Tab eventKey="changelog" title="Changelog">
                        <Modal.Body>
                            <ListGroup>
                                <ListGroup.Item>
                                    10/27/20: Added changelog and How-to
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    10/26/20: Added left/right selection for
                                    homunculus
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    10/26/20: Trial complete and Clear buttons
                                    revert app to default state
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    10/22/20: Embeded legend colors into Effect
                                    dropdown
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    10/20: Moved non-task related UI elements
                                    into headers (elecs/params/notes)
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    10/20: Second electrode selection depends on
                                    first electrode (matching groups)
                                </ListGroup.Item>
                            </ListGroup>
                        </Modal.Body>
                    </Tab>
                </Tabs>
            </Modal>
        </>
    )
}
