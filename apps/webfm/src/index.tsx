import React from 'react'
import * as ReactDOM from 'react-dom'
import '../node_modules/bootstrap/dist/css/bootstrap.css'
import Welcome from './Components/Welcome'
import Dashboard from './Components/Dashboard'
import { Container } from 'react-bootstrap'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import Header from './Components/Headers/Header'
import CortstimHeader from './Components/Headers/CortstimHeader'
import FunctionalMapping from './Components/Modules/FunctionalMapping'
import { MyProvider } from './Context'
import EvokedPotentials from './Components/Modules/EvokedPotentials'
import Cortstim from './Components/Modules/Cortstim'
import HeatMap from './Components/Modules/HeatMap'
import ClinicalAnnotation from './Components/Modules/ClinicalAnnotation'
import CCSR from './Components/Modules/CCSR'
import EpilepticAreas from './Components/Modules/EpilepticAreas'
ReactDOM.render(
    <MyProvider>
        <Router>
            <Switch>
                <Route exact path="/">
                    <Container fluid>
                        <div
                            style={{
                                position: 'absolute',
                                left: '50%',
                                top: '50%',
                                transform: 'translate(-50%, -50%)',
                            }}
                        >
                            <Welcome></Welcome>
                        </div>
                    </Container>
                </Route>
                <Route exact path="/dashboard">
                    <Header></Header>

                    <Dashboard></Dashboard>
                </Route>
                <Route exact path="/hg">
                    <Header></Header>
                    <FunctionalMapping></FunctionalMapping>
                </Route>
                <Route exact path="/hm">
                    <Header></Header>
                    <HeatMap></HeatMap>
                </Route>
                <Route exact path="/ep">
                    <Header></Header>
                    <EvokedPotentials></EvokedPotentials>
                </Route>
                <Route exact path="/ea">
                    <Header></Header>
                    <EpilepticAreas></EpilepticAreas>
                </Route>

                <Route exact path="/ccsr">
                    <Header></Header>
                    <CCSR />
                </Route>

                <Route exact path="/cortstim">
                    <Header></Header>

                    <CortstimHeader></CortstimHeader>
                    <Cortstim></Cortstim>
                </Route>
                <Route exact path="/annotation">
                    <ClinicalAnnotation></ClinicalAnnotation>
                </Route>
            </Switch>
        </Router>
    </MyProvider>,
    document.getElementById('root')
)
