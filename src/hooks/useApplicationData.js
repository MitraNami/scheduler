import { useState, useEffect } from "react";
import axios from 'axios';

// deals with data management of Application component
const useApplicationData = () => {

  //combine the states
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  //updates the state with a new day
  const setDay = day => setState(prev => ({...prev, day}));

  // we need to update days, appointments, interviewers parts of the state at the same time
  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("api/appointments"),
      axios.get("api/interviewers")
    ]).then(all => {
      const [days, appointments, interviewers] = all.map(item => item.data);
      setState(prev => ({...prev, days, appointments, interviewers}));
    })
  }, []);
  

  //pass the function as prop to each Appointment component
  const bookInterview = (id, interview) => {
    const appointment = {
      ...state.appointments[id], //create a new appointment object starting with the values copied from the existing appointment
      interview: {...interview}
    };
    //replace the existing record with the matching id with appointment obj created here
    const appointments = {
      ...state.appointments,
      [id] : appointment
    }

    //update the database
    return axios.put(
      `/api/appointments/${id}`,
      {interview}
      )
    .then(() => {
      setState({...state, appointments}) //change the state locally if the PUT request is successful
    });
  };

  //pass the function as props to each Appointment component
  const cancelInterview = (id) => {
    const appointment = {...state.appointments[id], interview : null};
    const appointments = {...state.appointments, [id] : appointment};

    return axios.delete(`/api/appointments/${id}`)
      .then(() => {
        setState({...state, appointments})
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
