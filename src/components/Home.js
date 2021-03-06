import React from "react";
// Redux Connect
import {connect} from 'react-redux';
// Router
import {withRouter} from 'react-router-dom';
// Actions
import {fetchTickets, userSignOut} from '../actions/actions';
// Ant Design
import { Layout } from 'antd';
// Components
import SideMenu from './SideMenu';

const { Footer } = Layout;

const Home = props => {

    let Page = props.page;

    const handleSignOut = () => {
        props.userSignOut();
        props.history.push('/');
    }

    return (
        <div style={{backgroundColor: '#333', minHeight: '100vh', textAlign: 'center'}}>
            <Layout style={{ minHeight: '100vh' }}>
                <SideMenu signOut={handleSignOut}/>
                <Layout>
                    {/* Dynamic rendering of different componenets depending on NavBar */}
                    {Page}
                    <Footer style={{ textAlign: 'center' }}>Dev Desk</Footer>
                </Layout>
            </Layout>
        </div>
    )
}

const mapStateToProps = state => 
{
  return {
    user: state.user,
    tickets: state.tickets
  };
};

export default withRouter(connect(mapStateToProps, {fetchTickets, userSignOut})(Home))