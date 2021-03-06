import React, {useEffect, useState} from "react";
// Redux Connect
import {connect} from 'react-redux';
// Router
import {withRouter} from 'react-router-dom';
// Actions
import {fetchTickets} from '../../actions/actions';
// Ant Design
import {Layout, List, Radio, Icon, PageHeader} from 'antd';
// Components
import TicketCard from './TicketCard';
import TicketRow from "./TicketRow";

const {Content} = Layout;

const Base = props => {

  const [layout, setLayout] = useState('vertical');

    const fetch = () => {
        props.fetchTickets();
    }

    const handleChange = e => {
      setLayout(e.target.value)
      console.log(e.target.value)
    }

    useEffect(() => {
      props.fetchTickets();
    }, [props.testing])

    return (
        <Content >
          <PageHeader
            style={{
              border: '1px solid rgb(235, 237, 240)',
            }}
            title="Home"
            subTitle="View all tickets here!"
            extra={[<Radio.Group key="group" defaultValue="vertical" buttonStyle="solid" onChange={handleChange}>
            <Radio.Button key="vertical" value="vertical"><Icon type="table" /></Radio.Button>
            <Radio.Button key="horizontal" value="horizontal"><Icon type="menu" /></Radio.Button>
            </Radio.Group>]}
          />
          {layout === 'vertical' ?
            <List grid={{gutter: 10, xs: 1, sm: 2, md: 2, lg: 3, xl: 4, xxl: 5}}
            size="large"
            pagination={{
                onChange: page => {
                  console.log(page);
                  props.fetchTickets();
                },
                pageSize: 50,
                style: {textAlign: 'center'}
              }}
                dataSource={props.tickets}
                renderItem={ticket => (
                    <List.Item style={{margin: '10px'}}>
                        <TicketCard ticket={ticket}/>
                    </List.Item>
            )}>
        </List>
        : 
        <List
        style={{minHeight: '320px'}}
            size="large"
            layout="horizontal"
            pagination={{
                onChange: page => {
                  console.log(page);
                },
                pageSize: 50,
                style: {textAlign: 'center'}
              }}
                dataSource={props.tickets}
                renderItem={ticket => (
                    // <List.Item style={{margin: '10px'}}>
                        <TicketRow ticket={ticket}/>
                    // </List.Item>
            )}>
        </List>
        }
        </Content>
    )
}

const mapStateToProps = state => 
{
  return {
    tickets: state.tickets,
    testing: state.testing
  };
};

export default withRouter(connect(mapStateToProps, {fetchTickets})(Base))