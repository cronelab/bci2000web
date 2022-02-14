import React from 'react'
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import VolumetricRender from './Views/VolumetricRender';
import SlicedView from './Views/SlicedView';
import SurfaceView from './Views/SurfaceView';
import 'bootstrap/dist/css/bootstrap.min.css';
// import NiftiRaw from './Views/notyet/NiftiRaw';
// import TwoDFiber from './Views/notyet/TwoDFiber';
// import TwoD from './Views/notyet/TwoD';
// import ThreeDFiber from './Views/notyet/ThreeDFiber';
// import CombinedView from './Views/notyet/CombinedView';

ReactDOM.render(
  <Router>
    <Switch>
      <Route exact path="/">
        <Dashboard />
      </Route>
      {/* <Route exact path="/all">
        <CombinedView />
      </Route> */}
      <Route exact path="/volume">
        <VolumetricRender />
      </Route>
      <Route exact path="/slice">
        <SlicedView />
      </Route>
      <Route exact path="/surface">
        <SurfaceView />
      </Route>
      {/* <Route exact path="/nifti-fiber">
        <TwoDFiber />
      </Route>
      <Route exact path="/nifti">
        <TwoD />
      </Route>
      <Route exact path="/nifti3D">
        <ThreeDFiber />
      </Route> */}
    </Switch>
  </Router>,

  document.getElementById('root')
);
