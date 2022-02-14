import React, { useContext, useEffect } from 'react'
import {
    Navbar,
    Nav,
    NavDropdown,
    Form,
    FormControl,
    Button,
    ButtonGroup,
    ToggleButton,
} from 'react-bootstrap'
import { Context } from '../../Context'
import { fetchSubjects } from '../../helpers/pullAnatomicalData'
export default function Header() {
    const {
        subjects,
        setSubjects,
        activeSubject,
        setActiveSubject,
        brainType,
        setBrainType,
    } = useContext(Context)

    useEffect(() => {
        ;(async () => {
            let subjs = await fetchSubjects()
            setSubjects(subjs)
        })()
    }, [])

    // const SubList = useState(() => {
    //   ( async () => {
    //     let subjs = await fetchSubjects();
    //     setSubjects(subjs)
    //   })()
    // })
    return (
        <Navbar bg="light" expand="lg">
            <Navbar.Brand href="/dashboard">WeBrain</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Link href="#home"> </Nav.Link>
                    <Nav.Link href="#link"> </Nav.Link>
                    <NavDropdown
                        title={activeSubject || 'Subject list'}
                        id="SubjectDropdown"
                    >
                        {subjects.map((subjs) => {
                            return (
                                <NavDropdown.Item
                                    key={subjs}
                                    onClick={() => setActiveSubject(subjs)}
                                >
                                    {subjs}
                                </NavDropdown.Item>
                            )
                        })}
                    </NavDropdown>
                </Nav>
                <p style={{ top: '50%', margin: '20px' }}>Brain type:</p>
                <ButtonGroup toggle>
                    {['2D', '3D'].map((radio, idx) => (
                        <ToggleButton
                            key={idx}
                            type="radio"
                            variant="secondary"
                            name="radio"
                            value={radio}
                            checked={brainType === radio}
                            onChange={(e) =>
                                setBrainType(e.currentTarget.value)
                            }
                        >
                            {radio}
                        </ToggleButton>
                    ))}
                </ButtonGroup>
            </Navbar.Collapse>
        </Navbar>
    )
}
