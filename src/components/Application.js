import React, { useState, useEffect } from "react";
import axios from 'axios';

import DayList from "components/DayList";
import "components/Application.scss";
import Appointment from "components/Appointment";


// const appointments = [
//   {
//     id: 1,
//     time: "12pm",
//   },
//   {
//     id: 2,
//     time: "1pm",
//     interview: {
//       student: "Lydia Miller-Jones",
//       interviewer: {
//         id: 1,
//         name: "Sylvia Palmer",
//         avatar: "https://i.imgur.com/LpaY82x.png",
//       }
//     }
//   },
//   {
//     id: 3,
//     time: "2pm",
//   },
//   {
//     id: 4,
//     time: "3pm",
//     interview: {
//       student: "Mitra Nami",
//       interviewer: {
//         id: 2,
//         name: "Tori Malcolm",
//         avatar: "https://i.imgur.com/Nmx0Qxo.png",
//       }
//     }
//   },
//   {
//     id: 5,
//     time: "4pm",
//     interview: {
//       student: "Kartina Crane",
//       interviewer: {
//         id: 4,
//         name: "Cohana Roy",
//         avatar: "https://i.imgur.com/FK8V841.jpg",
//       }
//     }
//   }
// ];

export default function Application(props) {

  //combine the states for day, days, appointments
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {}
  });

  //holds a list of appointments for that day
  const dailyAppointments = [];

  //updates the state with a new day
  const setDay = day => setState({...state, day})

  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("api/appointments"),
    ]).then(all => {
      setState(prev => ({...prev, days: all[0].data, appointments: all[1].data }))
    })
  }, []);



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
        {[...dailyAppointments.map(appointment => 
          <Appointment key={appointment.id} {...appointment} />
        ), <Appointment key="last" time="5pm" />]}
      </section>
    </main>
  );
}
