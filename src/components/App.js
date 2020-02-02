import React, {useEffect} from "react";
// Redux Connect
import {connect} from 'react-redux';
// Router
import {withRouter, Route} from 'react-router-dom';
import {PrivateRoute} from '../utils/PrivateRoute';
// Actions
import {homeLoaded} from '../actions/actions';
// Components
import Landing from './Landing';
import Home from './Home';
const App = props => 
{

  const historyPush = location => {
    props.history.push(location);
  }

  return (
    <div style={{backgroundColor: '#030405'}}>
      <Route exact path="/" render={props => <Landing {...props} push={historyPush} login={true}/>}></Route>
      <Route exact path="/signup" render={props => <Landing {...props} login={false} push={historyPush}/>}></Route>
      <PrivateRoute exact path="/home" component={Home} data={{...props}}/>
    </div>
  );
};

const mapStateToProps = state => 
{
  return {
    token: state.token
  };
};

export default withRouter(connect(mapStateToProps, {homeLoaded})(App))