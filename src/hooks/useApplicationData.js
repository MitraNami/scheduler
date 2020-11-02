import { useEffect, useReducer } from "react";
import axios from 'axios';


const findDay = (state, appointmentId) => {
  for (let i = 0; i < state.days.length; i++) {
    if (state.days[i]['appointments'].indexOf(appointmentId) !== -1) {
      return [state.days[i], i];
    }
  }
};

const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";

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
    default: {
      
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
      axios.get("api/appointments"),
      axios.get("api/interviewers")
    ]).then(all => {
      const [days, appointments, interviewers] = all.map(item => item.data);
      dispatch({type: SET_APPLICATION_DATA, days, appointments, interviewers});
    })
  }, []);
  

  //pass the function as prop to each Appointment component
  const bookInterview = (id, interview) => {
    // const appointment = {
    //   ...state.appointments[id], //create a new appointment object starting with the values copied from the existing appointment
    //   interview: {...interview}
    // };
    // //replace the existing record with the matching id with appointment obj created here
    // const appointments = {
    //   ...state.appointments,
    //   [id] : appointment
    // }

    //
    const isCreated = state.appointments[id].interview ? false : true;

    //Update the spots
    const days = [...state.days];
    if (isCreated) {
      const [day, index] = findDay(state, id);
      const newDay = {...day, spots: day.spots - 1};
      days.splice(index, 1, newDay);
    }

    //update the database
    return axios.put(
      `/api/appointments/${id}`,
      {interview}
      )
    .then(() => {
      //setState(prev => ({...prev, appointments, days})) //change the state locally if the PUT request is successful
      dispatch({type: SET_INTERVIEW, id, interview})
    });
  };

  //pass the function as props to each Appointment component
  const cancelInterview = (id) => {
    // const appointment = {...state.appointments[id], interview : null};
    // const appointments = {...state.appointments, [id] : appointment};

    //Update the spots
    const [day, index] = findDay(state, id);
    const newDay = {...day, spots: day.spots + 1};
    const days = [...state.days];
    days.splice(index, 1, newDay);

    return axios.delete(`/api/appointments/${id}`)
      .then(() => {
        //setState(prev => ({...state, appointments, days}))
        dispatch({type: SET_INTERVIEW, interview: null});
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
