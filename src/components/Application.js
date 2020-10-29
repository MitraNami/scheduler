import React, { useState, useEffect } from "react";
import axios from 'axios';

import DayList from "components/DayList";
import "components/Application.scss";
import Appointment from "components/Appointment";
import { getAppointmentsForDay, getInterview } from "../helpers/selectors";


export default function Application(props) {

  //combine the states
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

 
  //updates the state with a new day
  const setDay = day => setState({...state, day})

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

  //holds a list of appointments for that day
  const dailyAppointments = getAppointmentsForDay(state, state.day);

  //iterate over appointment objs of the day and create Appointment components
  const schedules = dailyAppointments.map(appointment => {
    //transfer interview data before passing it as a prop
    const interview = getInterview(state, appointment.interview);

    return (
      <Appointment 
      key={appointment.id} 
      id={appointment.id}
      time={appointment.time}
      interview={interview}
      />
    );
  })

  return (
    <main className="layout">
      <section className="sidebar">
      <img
        className="sidebar--centered"
        src="images/logo.png"
        alt="Interview Scheduler"
      />
      <hr className="sidebar__separator sidebar--centered" />
      <nav className="sidebar__menu">
        <DayList
          days={state.days}
          day={state.day}
          setDay={setDay}
        />
      </nav>
      <img
        className="sidebar__lhl sidebar--centered"
        src="images/lhl.png"
        alt="Lighthouse Labs"
      />
      </section>
      <section className="schedule">
        {/*Map over the appointments, the last Appointment is for CSS styling*/}
        {[...schedules, <Appointment key="last" time="5pm" />]}
      </section>
    </main>
  );
}
