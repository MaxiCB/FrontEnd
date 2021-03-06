// Axios import
import axios from 'axios';
import { axiosWithAuth } from '../utils/axiosWithAuth';

// Action Exports
export const HOME_LOADED = "HOME_LOADED";
// Account is Helper Action
export const IS_HELPER = "IS_HELPER";
// Login Actions - Login action functionality and handling possible errors
export const LOGIN_USER = "LOGIN_USER";
export const LOGIN_USER_ERROR = "LOGIN_USER_ERROR";
export const SET_USER_ID = "SET_USER_ID";
// Signup Actions - Signup action functionality and handling possible errors
export const SIGNUP_USER = "SIGNUP_USER";
export const SIGNUP_USER_ERROR = "SIGNUP_USER_ERROR";
// Admin Login Actions - Admin login functionality and handling possible errors
export const LOGIN_ADMIN = "LOGIN_ADMIN";
export const LOGIN_ADMIN_ERROR = "LOGIN_ADMIN_ERROR";
// Fetching Tickets Actions - Used for fetching all tickets that are in the system and handling possible errors
export const FETCH_TICKETS = "FETCH_TICKETS";
export const FETCH_TICKETS_ERROR = "FETCH_TICKETS_ERROR";
// Fetching User Tickets Actions - Used for fetching all tickets that are in the system and handling possible errors
export const FETCH_USER_TICKETS = "FETCH_TICKETS";
export const FETCH_USER_TICKETS_ERROR = "FETCH_TICKETS_ERROR";
// Clearing tickets Action
export const CLEAR_TICKETS = "CLEAR_TICKETS";
// Create Ticket Actions - Used for creating a new ticket and handling possible errors
export const ADD_TICKET = "ADD_TICKETS";
export const ADD_TICKET_ERROR = "ADD_TICKET_ERROR";
// Assign Ticket Actions - Used for assigning tickets to users or moving back into the pool and handling possible errors
export const ASSIGN_TICKET = "ASSIGN_TICKET";
export const ASSIGN_TICKET_ERROR = "ASSIGN_TICKET_ERROR";
// Resolve Ticket Actions - Used for marking tickets as resolved and handling possible errors
export const RESOLVE_TICKET = "RESOLVE_TICKET";
export const RESOLVE_TICKET_ERROR = "RESOLVE_TICKET_ERROR";
// Fetching User by ID Actions - Used to show Username on cards
export const FETCH_USER = "FETCH_USER";
export const FETCH_USER_ERROR = "FETCH_USER_ERROR";
// Fethching and Loading status for various actions
export const FETCHING_TICKETS = "FETCHING_TICKETS";
export const ADDING_TICKET = "ADDING_TICKET";
export const ASSIGNING_TICKET = "ASSIGNING_TICKET";
export const RESOLVING_TICKET = "RESOLVING_TICKET";

export const CLEAR_STATE = "CLEAR_STATE";
 
// Action Const's
const API = 'https://devdeskdb.herokuapp.com/api/';

// Testing Method
export const homeLoaded = () =>
{
    return {
        type: HOME_LOADED,
        payload: localStorage.getItem('token')
    };
};

// User Signup Method
export const userSignUp = (user, helper) => dispatch =>
{
    let route = helper ? 'helpers' : 'students';
    console.log(helper);
    console.log(route);

    return new Promise((resolve, reject) => {
        axios.post(API + 'auth/'+ route +'/register', user)
        .then((res) => {
            // console.log(res);
            dispatch(signupUserSuccess(res.data));
            if(helper){dispatch(signUpUserHerlper(true))}
            resolve();
        })
        .catch((err) => {
            dispatch(signupUserError(err.response.data.message));
            reject();
        });
    })
};

export const signupUserSuccess = data => {
    return dispatch => {
        dispatch({type: SIGNUP_USER, payload: data.username})
        dispatch({type: SET_USER_ID, payload: data.id})
    }
}

export const signUpUserHerlper = bool => {
    console.log('Registered as helper');
    return dispatch =>{ dispatch({type: IS_HELPER, payload: bool})}
}

export const signupUserError = error => ({
    type: SIGNUP_USER_ERROR,
    payload: error
})

// Signin Method for User's
// Need to check for helper specific key and respond accordingly
export const userSignIn = (user, helper) => dispatch => {

    let route = helper ? 'helpers' : 'students';
    console.log(route);
    console.log(helper);
    localStorage.setItem('helper', helper ? true : false);

    return new Promise((resolve, reject) => {
        axios.post(API + 'auth/'+ route + '/login', user)
            .then((res) => {
                localStorage.setItem('token', '');
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('id', '');
                localStorage.setItem('id', helper ? res.data.helperid : res.data.studentid);
                let id = helper ? res.data.helperid : res.data.studentid;
                if(helper){
                    dispatch(loginUserHerlper(res.data.token, id))
                } else {
                    dispatch(loginUserSuccess(res.data.token, id));
                }
                resolve();
            })
            .catch((err) => {
                console.log('here', err);
                dispatch(loginUserError(err.response.data.message));
                reject();
            });
    })
};

export const loginUserSuccess = (user, id) => {
    return dispatch => {
        localStorage.setItem('helper', false);
        dispatch({ type: LOGIN_USER, payload: user})
        dispatch({ type: SET_USER_ID, payload: id})
        dispatch({type: IS_HELPER, payload: false})
    }
}
export const loginUserHerlper = (user, id) => {
    return dispatch => {
        localStorage.setItem('helper', true);
        dispatch({ type: LOGIN_USER, payload: user})
        dispatch({ type: SET_USER_ID, payload: id})
        dispatch({type: IS_HELPER, payload: true})
    }
}

export const loginUserError = error => {
    return dispatch => {
    dispatch({type: LOGIN_USER_ERROR, payload: error})
    }
}

export const fetchUser = (id, helper) => {

    let route = helper ? 'helpers/' : 'students/';

    const promise = axiosWithAuth().get(API + route + id);

    return dispatch => {
        promise
        .then((res) => {
            let userID = helper ? res.data.helperid : res.data.studentid;
            dispatch({type: LOGIN_USER, payload: localStorage.getItem('token')});
            dispatch({type: SIGNUP_USER, payload: res.data.username});
            dispatch({ type: SET_USER_ID, payload: userID});
            if(res.data.helperid != null){localStorage.setItem('helper', true); dispatch({type: IS_HELPER, payload: true})}
        })
        .catch((err) => {
            dispatch({type: LOGIN_USER_ERROR, payload: err.response.data.message});
        })
    };
}

// Signout Method for User's
export const userSignOut = () =>
{
    localStorage.setItem('token', '');
    localStorage.setItem('id', '');
    localStorage.setItem('helper', false);
    return dispatch => {
        dispatch({type: LOGIN_USER, payload: ''})
    };
};

// Admin signin method
export const adminSignin = user => 
{
    axios.post(API + 'adminLogin', user)
        .then((res) => 
        {
            localStorage.setItem('token', res.data.token);
        })
        .catch((err) =>
        {
            return {
                type: LOGIN_ADMIN_ERROR,
                payload: err
            }
        })
        return {
            type: LOGIN_ADMIN,
            payload: localStorage.getItem('token')
        };
};

// Admin signout method
export const adminSignOut = () => 
{
    localStorage.setItem('token', '');
    return {
        type: LOGIN_ADMIN,
        payload: ''
    };
};

// Fetching of tickets
export const fetchTickets = () => 
{
    const promise = axiosWithAuth().get(API + 'requests/');

    return dispatch => {
        dispatch({ type: FETCHING_TICKETS});
        promise
        .then((res) => {
            dispatch({type: FETCH_TICKETS, payload: res.data});
            dispatch({type: FETCHING_TICKETS});
        })
        .catch((err) => {
            dispatch({type: FETCH_TICKETS_ERROR, payload: err});
            dispatch({type: FETCHING_TICKETS})
        })
    };
};

// Fetching of tickets
export const fetchUserTickets = id => 
{
    const promise = axiosWithAuth().get('https://devdeskdb.herokuapp.com/api/students/' + id + '/requests');
console.log('USER')
    return dispatch => {
        dispatch({type: FETCHING_TICKETS});
        promise
        .then((res) => {
            console.log(res);
            dispatch({type: CLEAR_TICKETS})
            dispatch({type: FETCH_TICKETS, payload: res.data});
            dispatch({type: FETCHING_TICKETS});
        })
        .catch((err) => {
            dispatch({type: FETCH_TICKETS_ERROR, payload: err});
            dispatch({type: FETCHING_TICKETS});
        })
    };
};

// Adding of ticket
export const addTicket = ticket => {
    const promise = axiosWithAuth().post(API + 'requests/', ticket);

    return dispatch => {
        dispatch({type: ADDING_TICKET});
    promise
    .then((res) => {
        dispatch({type: ADD_TICKET, payload: res.data});
        dispatch({type: ADDING_TICKET});
        dispatch({type: ASSIGNING_TICKET});fetchTickets()
    })
    .catch((err) => {
        dispatch({type: ADD_TICKET_ERROR, payload: err});
        dispatch({type: ADDING_TICKET});
    })
    };
};

// Assigning of ticket
export const assignTicket = (id, ticket) => {
    const promise = axiosWithAuth().put(API + 'requests/' + ticket.id, ticket);

    return dispatch => {
        dispatch({type: ASSIGNING_TICKET});
    promise
    .then((res) => {
        dispatch({type: ASSIGN_TICKET, payload: res.data});
        dispatch({type: ASSIGNING_TICKET});
    })
    .catch((err) => {
        dispatch({type: ASSIGN_TICKET_ERROR, payload: err});
        dispatch({type: ASSIGNING_TICKET});
    })
    };
};

// Resolving of a ticker
export const resolveTicket = ticket => {
    const promise = axiosWithAuth().put(API + 'requests/' + ticket.id, ticket);

    return dispatch => {
        dispatch({type: RESOLVING_TICKET});
    promise
    .then((res) => {
        dispatch({type: RESOLVE_TICKET, payload: res.data});
        dispatch({type: RESOLVING_TICKET});
    })
    .catch((err) => {
        dispatch({type: RESOLVE_TICKET_ERROR, payload: err});
        dispatch({type: RESOLVING_TICKET});
    })
    };
};

export const refreshTickets = () => {
    return dispatch => {
        dispatch({type: ASSIGN_TICKET});
        console.log('Refreshing')
        fetchTickets();
    }
}

// Deletion of a ticket
export const deleteTicket = ticket => {
    const promise = axiosWithAuth().delete(API + 'requests/' + ticket.id);
    return dispatch => {
        promise
            .then((res) => {dispatch({type: ASSIGN_TICKET});fetchTickets()})
            .catch((err) => console.log(err))
    }

}