import {
    NavItem,
    Modal,
    Row,
    Col,
    Table,
    OverlayTrigger,
    Tab,
    FormGroup,
    Form,
    Nav,
    Popover,
    Tooltip,
} from 'react-bootstrap'
import React, { useState } from 'react'

const MapModals = (props) => {
    const [clicked, click] = useState(props.clicked)

    const popover = (
        <Popover id="modal-popover" title="popover">
            very popover. such engagement
        </Popover>
    )
    const tooltip = <Tooltip id="modal-tooltip">wow.</Tooltip>

    const _handleClick = () => {
        console.log(tooltip)
        console.log(clicked)
        click(false)
    }
    return (
        <div>
            {/* <Button onClick={console.log(this.state.clicked)}>d</Button> */}

            <Modal
                show={clicked}
                onHide={_handleClick.bind(this)}
                id="fm-options-modal"
                // tabindex="-1"
                role="dialog"
                aria-labelledby="fmOptionsModal"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="fmOptionsModal">
                        Options, Tools, &amp; Goodies
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Tab.Container
                        id="left-tabs-example"
                        defaultActiveKey="first"
                    >
                        <Row className="clearfix">
                            <Col sm={3}>
                                {/* <Nav bsStyle="pills" stacked className="fm-options-tab-list">
                  <NavItem href="#fm-options-content-options" eventKey="first">
                    <Glyphicon glyph="wrench" style={{ color: "#000" }}>
                      &emsp;Options
                    </Glyphicon>
                  </NavItem>

                  <NavItem href="#fm-options-content-montage" eventKey="second">
                    <Glyphicon glyph="list" style={{ color: "#000" }}>
                      &emsp;Montage
                    </Glyphicon>
                  </NavItem>

                  <NavItem href="#fm-options-content-scope" eventKey="three">
                    <Glyphicon glyph="eye-open" style={{ color: "#000" }}>
                      &emsp;Scope
                    </Glyphicon>
                  </NavItem>

                  <NavItem href="#fm-options-content-save" eventKey="four">
                    <Glyphicon glyph="cloud-upload" style={{ color: "#000" }}>
                      &emsp;Save
                    </Glyphicon>
                  </NavItem>

                  <NavItem href="#fm-options-content-about" eventKey="five">
                    <Glyphicon glyph="console" style={{ color: "#000" }}>
                      &emsp;Dev
                    </Glyphicon>
                  </NavItem>

                  <NavItem eventKey="six">
                    <Glyphicon glyph="sunglasses" style={{ color: "#000" }}>
                      &emsp;About
                    </Glyphicon>
                  </NavItem>
                </Nav> */}
                            </Col>
                            <Col sm={9}>
                                <Tab.Content>
                                    {/* <Tab.Pane eventKey="first" id="fm-options-content-options">
                    <h3 style={{ "marginTop": "6px" }}>Timing</h3>
                    <p>
                      Set the windows used for clipping data relative to events,
                      as well as for computing baseline feature distributions.
                    </p>
                    <p className="text-warning">
                      Changing these options in the middle of a session{" "}
                      <strong>resets all computed features.</strong>
                    </p>
                    <h4>Stimulus</h4>
                    <Form>
                      <FormGroup>
                        <Col md={3} sm={4}>
                          Trial window
                        </Col>
                        <Col md={1} sm={1}>
                          Start
                        </Col>
                        <label
                        //   for="fm-option-stim-trial-start"
                          className="col-md-1 col-sm-1 control-label"
                        >
                          Start
                        </label>
                        <Col md={2} sm={3}>
                          <input
                            type="text"
                            className="form-control"
                            id="fm-option-stim-trial-start"
                            placeholder="-1.0"
                          />
                        </Col>
                        <label
                        //   for="fm-option-stim-trial-end"
                          className="col-md-1 col-sm-1 control-label"
                        >
                          End
                        </label>
                        <Col md={2} sm={3}>
                          <input
                            type="text"
                            className="form-control"
                            id="fm-option-stim-trial-end"
                            placeholder="3.0"
                          />
                        </Col>
                      </FormGroup>
                    </Form>

                    <Form>
                      <FormGroup>
                        <Col md={3} sm={4}>
                          Baseline
                        </Col>
                        <Col md={1} sm={1}>
                          Start
                        </Col>
                        <label
                        //   for="fm-option-stim-baseline-start"
                          class="col-md-1 col-sm-1 control-label"
                        >
                          Start
                        </label>
                        <Col md={2} sm={3}>
                          <input
                            type="text"
                            className="form-control"
                            id="fm-option-stim-baseline-start"
                            placeholder="-1.0"
                          />
                        </Col>
                        <label
                        //   for="fm-option-stim-baseline-end"
                          class="col-md-1 col-sm-1 control-label"
                        >
                          End
                        </label>
                        <Col md={2} sm={3}>
                          <input
                            type="text"
                            class="form-control"
                            id="fm-option-stim-baseline-end"
                            placeholder="-0.2"
                          />
                        </Col>
                      </FormGroup>
                    </Form>
                    <h4>Response</h4>
                    <Form horizontal>
                      <FormGroup>
                        <Col componentClass={ControlLabel} md={3} sm={4}>
                          Trial window
                        </Col>
                        <Col componentClass={ControlLabel} md={1} sm={1}>
                          Start
                        </Col>
                        <label
                          for="fm-option-stim-trial-start"
                          class="col-md-1 col-sm-1 control-label"
                        >
                          Start
                        </label>
                        <Col md={2} sm={3}>
                          <input
                            type="text"
                            class="form-control"
                            id="fm-option-stim-trial-start"
                            placeholder="-1.0"
                          />
                        </Col>
                        <label
                          for="fm-option-stim-trial-end"
                          class="col-md-1 col-sm-1 control-label"
                        >
                          End
                        </label>
                        <Col md={2} sm={3}>
                          <input
                            type="text"
                            class="form-control"
                            id="fm-option-stim-trial-end"
                            placeholder="3.0"
                          />
                        </Col>
                      </FormGroup>
                    </Form>

                    <Form horizontal>
                      <FormGroup>
                        <Col componentClass={ControlLabel} md={3} sm={4}>
                          Baseline
                        </Col>
                        <Col componentClass={ControlLabel} md={1} sm={1}>
                          Start
                        </Col>
                        <label
                          for="fm-option-stim-baseline-start"
                          class="col-md-1 col-sm-1 control-label"
                        >
                          Start
                        </label>
                        <Col md={2} sm={3}>
                          <input
                            type="text"
                            class="form-control"
                            id="fm-option-stim-baseline-start"
                            placeholder="-1.0"
                          />
                        </Col>
                        <label
                          for="fm-option-stim-baseline-end"
                          class="col-md-1 col-sm-1 control-label"
                        >
                          End
                        </label>
                        <Col md={2} sm={3}>
                          <input
                            type="text"
                            class="form-control"
                            id="fm-option-stim-baseline-end"
                            placeholder="-0.2"
                          />
                        </Col>
                      </FormGroup>
                    </Form>

                    <h3>Event Triggers</h3>
                    <p>
                      Set options relating to how events are triggered from the
                      received data. When using precision timing, you can use
                      the{" "}
                      <strong>
                        <span class="glyphicon glyphicon-eye-open"></span> Scope
                      </strong>{" "}
                      tool to identify reasonable threshold values.
                    </p>

                    <p>
                      For state timing, an on value of "<strong>x</strong>"
                      indicates triggering on any nonzero state value.
                    </p>

                    <h4>Stimulus</h4>
                    <h4>Popover in a modal</h4>
                    <p>
                      there is a{" "}
                      <OverlayTrigger overlay={popover}>
                        <a href="#popover">popover</a>
                      </OverlayTrigger>{" "}
                      here
                    </p>
                    <Form horizontal>
                      <FormGroup>
                        <Col componentClass={ControlLabel} md={3} sm={4}>
                          Trial window
                        </Col>
                        <Col componentClass={ControlLabel} md={1} sm={1}>
                          Start
                        </Col>
                        <label
                          for="fm-option-stim-trial-start"
                          class="col-md-1 col-sm-1 control-label"
                        >
                          Start
                        </label>
                        <Col md={2} sm={3}>
                          <input
                            type="text"
                            class="form-control"
                            id="fm-option-stim-trial-start"
                            placeholder="-1.0"
                          />
                        </Col>
                        <label
                          for="fm-option-stim-trial-end"
                          class="col-md-1 col-sm-1 control-label"
                        >
                          End
                        </label>
                        <Col md={2} sm={3}>
                          <input
                            type="text"
                            class="form-control"
                            id="fm-option-stim-trial-end"
                            placeholder="3.0"
                          />
                        </Col>
                      </FormGroup>
                    </Form>

                    <Form horizontal>
                      <FormGroup>
                        <Col componentClass={ControlLabel} md={3} sm={4}>
                          Baseline
                        </Col>
                        <Col componentClass={ControlLabel} md={1} sm={1}>
                          Start
                        </Col>
                        <label
                          for="fm-option-stim-baseline-start"
                          class="col-md-1 col-sm-1 control-label"
                        >
                          Start
                        </label>
                        <Col md={2} sm={3}>
                          <input
                            type="text"
                            class="form-control"
                            id="fm-option-stim-baseline-start"
                            placeholder="-1.0"
                          />
                        </Col>
                        <label
                          for="fm-option-stim-baseline-end"
                          class="col-md-1 col-sm-1 control-label"
                        >
                          End
                        </label>
                        <Col md={2} sm={3}>
                          <input
                            type="text"
                            class="form-control"
                            id="fm-option-stim-baseline-end"
                            placeholder="-0.2"
                          />
                        </Col>
                      </FormGroup>
                    </Form>
                    <h4>Response</h4>
                    <Form horizontal>
                      <FormGroup>
                        <Col componentClass={ControlLabel} md={3} sm={4}>
                          Trial window
                        </Col>
                        <Col componentClass={ControlLabel} md={1} sm={1}>
                          Start
                        </Col>
                        <label
                          for="fm-option-stim-trial-start"
                          class="col-md-1 col-sm-1 control-label"
                        >
                          Start
                        </label>
                        <Col md={2} sm={3}>
                          <input
                            type="text"
                            class="form-control"
                            id="fm-option-stim-trial-start"
                            placeholder="-1.0"
                          />
                        </Col>
                        <label
                          for="fm-option-stim-trial-end"
                          class="col-md-1 col-sm-1 control-label"
                        >
                          End
                        </label>
                        <Col md={2} sm={3}>
                          <input
                            type="text"
                            class="form-control"
                            id="fm-option-stim-trial-end"
                            placeholder="3.0"
                          />
                        </Col>
                      </FormGroup>
                    </Form>

                    <Form horizontal>
                      <FormGroup>
                        <Col componentClass={ControlLabel} md={3} sm={4}>
                          Baseline
                        </Col>
                        <Col componentClass={ControlLabel} md={1} sm={1}>
                          Start
                        </Col>
                        <label
                          for="fm-option-stim-baseline-start"
                          class="col-md-1 col-sm-1 control-label"
                        >
                          Start
                        </label>
                        <Col md={2} sm={3}>
                          <input
                            type="text"
                            class="form-control"
                            id="fm-option-stim-baseline-start"
                            placeholder="-1.0"
                          />
                        </Col>
                        <label
                          for="fm-option-stim-baseline-end"
                          class="col-md-1 col-sm-1 control-label"
                        >
                          End
                        </label>
                        <Col md={2} sm={3}>
                          <input
                            type="text"
                            class="form-control"
                            id="fm-option-stim-baseline-end"
                            placeholder="-0.2"
                          />
                        </Col>
                      </FormGroup>
                    </Form>
                    <h3>Cookies</h3>
                    <p>
                      <strong>WebFM</strong> uses cookies to store commonly set
                      settings locally, so that you don't need to re-enter them
                      every time you reload the page. If you'd like to clear
                      these out and get a fresh start, hit the button below.
                    </p>
                    <p>
                      <span class="text-warning">
                        Doing this will <strong>restart WebFM.</strong>
                      </span>
                    </p>

                    <Form horizontal>
                      <FormGroup>
                        <Col componentClass={ControlLabel} md={3} sm={4}>
                          <label for="fm-option-nuke-cookies">
                            Nuke cookies
                          </label>
                        </Col>
                        <Col md={9} sm={8}>
                          <button
                            type="submit"
                            class="btn btn-warning"
                            id="fm-option-nuke-cookies"
                          >
                            <span class="glyphicon glyphicon-fire"></span>
                            &emsp;OBLITERATE
                          </button>
                        </Col>
                      </FormGroup>
                    </Form>
                  </Tab.Pane>
                  <Tab.Pane eventKey="second" id="fm-options-content-montage">
                    <h3 style={{ "margin-top": "6px" }}>Montage</h3>
                    <p>
                      <strong>Click</strong> electrodes in the list to exclude
                      or un-exclude them from the displayed channel raster.
                    </p>
                    <Table condensed hover className="fm-montage-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Excluded</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th scope="row">LTG01</th>
                          <td>No</td>
                        </tr>
                      </tbody>
                    </Table>

                    {/* </div> */}
                                    {/* </Tab.Pane> */}
                                    {/* <Tab.Pane eventKey="three" id="fm-options-content-scope">
                    <h3 style={{ "margin-top": "6px" }}>Scope</h3>

                    <p>
                      Enter a <strong>Channel</strong> name to begin scoping
                      live data. By default, the scale will automatically adjust
                      to match the incoming signal; alternatively, you can fix
                      the scale by entering a <strong>Min</strong> or{" "}
                      <strong>Max</strong> value.
                    </p>
                    <Form horizontal>
                      <FormGroup>
                        <label
                          for="fm-option-scope-channel"
                          class="col-md-2 col-sm-3 control-label"
                        >
                          Channel
                        </label>
                        <Col md={3} sm={7}>
                          <input
                            type="text"
                            class="form-control"
                            id="fm-option-scope-channel"
                            placeholder="ainp1"
                          />
                        </Col>
                        <label
                          for="fm-option-scope-min"
                          class="col-md-1 col-sm-3 control-label"
                        >
                          Min
                        </label>
                        <Col md={2} sm={3}>
                          <input
                            type="text"
                            class="form-control"
                            id="fm-option-scope-min"
                            placeholder="-100"
                          />
                        </Col>
                        <label
                          for="fm-option-scope-max"
                          class="col-md-1 col-sm-1 control-label"
                        >
                          Max
                        </label>
                        <Col md={2} sm={3}>
                          <input
                            type="text"
                            class="form-control"
                            id="fm-option-scope-max"
                            placeholder="100"
                          />
                        </Col>
                      </FormGroup>
                    </Form>

                    <div id="fm-scope"></div>
                  </Tab.Pane>
                  <Tab.Pane eventKey="four" id="fm-options-content-save">
                    <h3 style={{ "margin-top": "6px" }}>Save</h3>
                    <Row>
                      <Col md={6}>
                        <p>
                          <strong>Enter</strong> a name below to save your map
                          to the WebFM cloud.
                        </p>
                        <Form inline>
                          <input
                            type="text"
                            class="form-control"
                            id="fm-option-save-name"
                            value="[Task]"
                          />
                          <button
                            type="button"
                            class="btn btn-default fm-save-cloud"
                          >
                            <span class="glyphicon glyphicon-cloud-upload"></span>{" "}
                            Save
                          </button>
                        </Form>
                      </Col>

                      <Col md={6}>
                        <Table class="table table-hover table-condensed">
                          <thead>
                            <tr>
                              <th>
                                Saved records for{" "}
                                <span class="fm-subject-name">[subject]</span>
                              </th>
                            </tr>
                          </thead>
                          <tbody id="fm-cloud-records-table"></tbody>
                        </Table>
                      </Col>
                    </Row>
                  </Tab.Pane>
                  <Tab.Pane eventKey="five">In progress...</Tab.Pane>
                  <Tab.Pane eventKey="six" id="fm-options-content-about"> 
                    <h1>
                      WebFM <small>v2.0-alpha</small>
                    </h1>

                    <p>Online functional mapping&mdash;online.</p>

                    <p>
                      Fork me on{" "}
                      <a href="http://github.com/cronelab/webfm">GitHub</a>.
                    </p>

                    <h4 style={{ "margin-top": "30px" }}>Written by</h4>

                    <p>
                      <dl class="dl-horizontal">
                        <dt>Max Collard</dt>
                        <dd>Web frontend, Map, Server, bci2k.js</dd>
                        <dt>Griffin Milsap</dt>
                        <dd>BCI2000Web, bci2k.js</dd>
                        <dt>Christopher Coogan</dt>
                        <dd>React, 3D visualization</dd>
                      </dl>
                    </p>

                    <h4>Powered by</h4>

                    <p>
                      <ul class="list-inline">
                        <li>
                          <a href="https://github.com/griffinmilsap/bci2k.js">
                            bci2k.js
                          </a>
                        </li>
                        <li>Bootstrap</li>
                        <li>Node + Express</li>
                        <li>d3</li>
                        <li>React</li>
                        <li>Unity (WebGL)</li>
                      </ul>
                    </p>
                  </Tab.Pane>*/}
                                </Tab.Content>
                            </Col>
                        </Row>
                    </Tab.Container>
                </Modal.Body>
            </Modal>
        </div>
    )
}
export default MapModals
