import { useEffect, useReducer } from "react";
import axios from 'axios';

import {findDay} from '../helpers/selectors';


// action types that will be dispatched
const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";
const SET_SPOTS = "SET_SPOTS";

const reducer = (state, action) => {
  switch(action.type) {

    case SET_DAY: {
      const day = action.day;
      return {...state, day};
    }
    case SET_APPLICATION_DATA: {
      const {days, appointments, interviewers} = action;
      return {...state, days, appointments, interviewers};
    }
    case SET_INTERVIEW: {
      const {id, interview} = action;
      const appointment = {
        ...state.appointments[id], //create a new appointment object starting with the values copied from the existing appointment
        interview: interview === null ? null : {...interview}
      };
      //replace the existing record with the matching id with appointment obj created here
      const appointments = {
        ...state.appointments,
        [id] : appointment
      };
      return {...state, appointments};

    }
    case SET_SPOTS: {
      const {isCreated, id} = action;
      if (isCreated === false) { //interview is updated, spots won't change
        return state;
      }
      const [day, index] = findDay(state, id);
      const newDay = {...day, spots: isCreated ? day.spots - 1 : day.spots + 1};
      // replace day obj at which the interview is booked or deleted with newDay obj
      const days = state.days.map((day, i) => {
        if (i === index) {
          return newDay;
        }
        return day;
      });

      return {...state, days};
    }

    default: {
      throw new Error(
        `Tried to reduce with unsupported action type: ${action.type}`
      );
    }    
  }
};



// deals with data management of Application component
const useApplicationData = () => {

  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });


  //updates the state with a new day
  const setDay = day => dispatch({type: SET_DAY, day});

  // we need to update days, appointments, interviewers parts of the state at the same time
  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers")
    ]).then(all => {
      const [days, appointments, interviewers] = all.map(item => item.data);
      dispatch({type: SET_APPLICATION_DATA, days, appointments, interviewers});
    })
  }, []);
  

  //pass the function as prop to each Appointment component
  const bookInterview = (id, interview) => {
    // to know if an interview is created or updated
    const isCreated = state.appointments[id].interview ? false : true;
    //update the database 
    return axios.put(
      `/api/appointments/${id}`,
      {interview}
      )
    .then(() => {
      //update the state
      dispatch({type: SET_INTERVIEW, id, interview});
      dispatch({type: SET_SPOTS, id, isCreated});
    });
  };

  //pass the function as props to each Appointment component
  const cancelInterview = (id) => {
    //update the database 
    return axios.delete(`/api/appointments/${id}`)
      .then(() => {
        //update the state
        dispatch({type: SET_INTERVIEW, interview: null});
        dispatch({type: SET_SPOTS, id});
      });
  };

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview
  }
};


export default useApplicationData;
