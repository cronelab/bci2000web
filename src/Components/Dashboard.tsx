import React, { useEffect, useContext } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import { Context } from '../Context'
import { useHistory } from 'react-router-dom'
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import Brain_2D from './BrainContainers/Brain_2D'
import { Model } from './BrainContainers/Brain_3D'

export default function Dashboard() {
    const {
        activeSubject,
        brainType,
        setAnnotator,
        setAnnotationDate,
        setRecords,
        records,
        setActiveRecord,
    } = useContext(Context)
    const history = useHistory()

    useEffect(() => {
        ;(async () => {
            if (activeSubject) {
                let _hgRecords = await fetch(`/api/records/HG/${activeSubject}`)
                let _epRecords = await fetch(`/api/records/EP/${activeSubject}`)
                let _ccsrRecords = await fetch(
                    `/api/records/CCSR/${activeSubject}`
                )
                let _eaRecords = await fetch(
                    `/api/data/epilepsy/${activeSubject}`
                )

                let hgRecords, epRecords, ccsrRecords, eaRecords
                if (_hgRecords.status == 200) {
                    hgRecords = await _hgRecords.json()
                } else {
                    hgRecords = []
                }
                if (_epRecords.status == 200) {
                    epRecords = await _epRecords.json()
                } else {
                    epRecords = []
                }

                if (_ccsrRecords.status == 200) {
                    ccsrRecords = await _ccsrRecords.json()
                } else {
                    ccsrRecords = []
                }
                if (_eaRecords.status == 200) {
                    eaRecords = await _eaRecords.json()
                } else {
                    eaRecords = []
                }
                setRecords({
                    hg: hgRecords,
                    ep: epRecords,
                    ccsr: ccsrRecords,
                    ea: eaRecords,
                })
            }
        })()
    }, [activeSubject])

    return (
        <>
            <Container fluid>
                {activeSubject == null ? (
                    <div
                        style={{
                            textAlign: 'center',
                            fontSize: '20px',
                            marginTop: '100px',
                        }}
                    >
                        Select a Patient
                    </div>
                ) : (
                    <Row>
                        <Col sm={7}>
                            <Tabs
                                defaultActiveKey="fm"
                                id="uncontrolled-tab-example"
                            >
                                <Tab
                                    eventKey="fm"
                                    title="Functional Mapping"
                                    key={'fm_tab'}
                                >
                                    <Card className="text-center">
                                        <Card.Body>
                                            <Card.Title>
                                                Functional Mapping
                                            </Card.Title>
                                            <Card.Text>
                                                {' '}
                                                Traditional WebFM
                                            </Card.Text>
                                            <ButtonGroup vertical>
                                                {records['hg'].map((hg) => {
                                                    return (
                                                        <Button
                                                            key={`${hg}_button`}
                                                            onClick={() => {
                                                                setActiveRecord(
                                                                    hg
                                                                )
                                                                history.push(
                                                                    '/hg'
                                                                )
                                                            }}
                                                            size="sm"
                                                        >
                                                            {hg}
                                                        </Button>
                                                    )
                                                })}
                                            </ButtonGroup>
                                        </Card.Body>
                                    </Card>
                                </Tab>
                                <Tab
                                    eventKey="spes"
                                    title="SPES"
                                    key={'spes_tab'}
                                >
                                    <Card className="text-center">
                                        <Card.Body>
                                            <Card.Title>SPES</Card.Title>
                                            <Tabs
                                                style={{ margin: 'auto' }}
                                                defaultActiveKey="trials"
                                            >
                                                <Tab
                                                    eventKey="cceps"
                                                    title="CCEPS"
                                                    key={'cceps_tab'}
                                                >
                                                    {records['ep'].map((ep) => {
                                                        return (
                                                            <Button
                                                                key={`${ep}_ccep_button`}
                                                                onClick={() => {
                                                                    setActiveRecord(
                                                                        ep
                                                                    )
                                                                    history.push(
                                                                        '/ep'
                                                                    )
                                                                }}
                                                                size="sm"
                                                            >
                                                                {ep}
                                                            </Button>
                                                        )
                                                    })}
                                                </Tab>
                                                <Tab
                                                    eventKey="ccsr"
                                                    title="CCSRs"
                                                    key={'ccsr_tab'}
                                                >
                                                    {records['ccsr'].map(
                                                        (ccsr) => {
                                                            return (
                                                                <Button
                                                                    key={`${ccsr}_ccsr_button`}
                                                                    onClick={() => {
                                                                        setActiveRecord(
                                                                            ccsr
                                                                        )
                                                                        history.push(
                                                                            '/ccsr'
                                                                        )
                                                                    }}
                                                                    size="sm"
                                                                >
                                                                    {ccsr}
                                                                </Button>
                                                            )
                                                        }
                                                    )}
                                                </Tab>
                                                <Tab
                                                    eventKey="matrices"
                                                    title="Adjaceny Matrix"
                                                    key={'matrix_tab'}
                                                >
                                                    <h2>3</h2>
                                                </Tab>
                                            </Tabs>
                                        </Card.Body>
                                    </Card>
                                </Tab>
                                <Tab
                                    eventKey="cs"
                                    title="Cortical Stimulation"
                                    key={'cortstim_tab'}
                                >
                                    <Card className="text-center">
                                        <Card.Body>
                                            <Card.Title>
                                                Cortical Stimulation
                                            </Card.Title>
                                            <Card.Text> Cortstim</Card.Text>
                                            <Button
                                                onClick={() => {
                                                    history.push('/cortstim')
                                                }}
                                            >
                                                View Data
                                            </Button>
                                        </Card.Body>
                                    </Card>
                                </Tab>
                                <Tab
                                    eventKey="ea"
                                    title="Epileptic Areas"
                                    key={'ea_tab'}
                                >
                                    <Card className="text-center">
                                        <Card.Body>
                                            <Card.Title>
                                                Epileptic Areas
                                            </Card.Title>
                                            <Card.Text>
                                                Displays interesting Electrodes
                                            </Card.Text>
                                            <Button
                                                // key={`${ea}_button`}
                                                onClick={() => {
                                                    // console.log()
                                                    setActiveRecord(
                                                        records['ea']
                                                    )
                                                    history.push('/ea')
                                                }}
                                                size="sm"
                                            >
                                                {'ea'}
                                            </Button>
                                            {/* </ButtonGroup> */}
                                        </Card.Body>
                                    </Card>
                                </Tab>
                                <Tab
                                    eventKey="reconstruction"
                                    title="Reconstruction"
                                    key={'recon_tab'}
                                >
                                    <Card className="text-center">
                                        <Card.Body>
                                            <Card.Title>
                                                Clinical Reconstruction
                                            </Card.Title>
                                            <Button
                                                onClick={() =>
                                                    window.open(
                                                        `http://zappa.neuro.jhu.edu:5000?subject=${activeSubject}`
                                                    )
                                                }
                                            >
                                                View T1 and 3D Mesh
                                            </Button>
                                        </Card.Body>
                                    </Card>
                                </Tab>
                                <Tab
                                    eventKey="annotate"
                                    title="Clinical Annotation"
                                    key={'annotation_tab'}
                                >
                                    <Card className="text-center">
                                        <Card.Body>
                                            <Card.Title>
                                                Attention Clinicians
                                            </Card.Title>
                                            <Card.Body>
                                                Use the following to draw
                                                annotations on the
                                                reconstruction
                                            </Card.Body>
                                            <Form>
                                                <Form.Row>
                                                    <Form.Group
                                                        as={Col}
                                                        controlId="formGridEmail"
                                                    >
                                                        <Form.Label>
                                                            Name
                                                        </Form.Label>
                                                        <Form.Control
                                                            type="email"
                                                            placeholder="Enter name"
                                                            //@ts-ignore
                                                            onChange={(e) =>
                                                                setAnnotator(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                        />
                                                    </Form.Group>

                                                    <Form.Group
                                                        as={Col}
                                                        controlId="formGridPassword"
                                                    >
                                                        <Form.Label>
                                                            Date
                                                        </Form.Label>
                                                        <Form.Control
                                                            type="date"
                                                            placeholder="Date"
                                                            onChange={(e) =>
                                                                setAnnotationDate(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                        />
                                                    </Form.Group>
                                                </Form.Row>
                                                <ButtonGroup vertical>
                                                    <Button
                                                        onClick={() => {
                                                            if (activeSubject) {
                                                                history.push(
                                                                    '/annotation'
                                                                )
                                                            } else {
                                                                alert(
                                                                    'Select a patient first'
                                                                )
                                                            }
                                                        }}
                                                    >
                                                        Annotate
                                                    </Button>
                                                </ButtonGroup>
                                            </Form>
                                        </Card.Body>
                                    </Card>
                                </Tab>
                            </Tabs>
                        </Col>
                        <Col sm={5}>
                            <>
                                {brainType == '2D' ? (
                                    <Brain_2D></Brain_2D>
                                ) : (
                                    <Model></Model>
                                )}
                            </>
                        </Col>
                    </Row>
                )}
            </Container>
        </>
    )
}
