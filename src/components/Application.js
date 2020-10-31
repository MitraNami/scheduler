import React from "react";

import DayList from "components/DayList";
import "components/Application.scss";
import Appointment from "components/Appointment";
import { getAppointmentsForDay, getInterview, getInterviewersForDay } from "../helpers/selectors";
import useApplicationData from "../hooks/useApplicationData";


export default function Application(props) {

  const {state, setDay, bookInterview, cancelInterview} = useApplicationData();

  //holds a list of the interviewers for that day, it will passed as a prop
  //to each Appointment of that day
  const interviewers = getInterviewersForDay(state, state.day);

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
      interviewers={interviewers}
      bookInterview={bookInterview}
      cancelInterview={cancelInterview}
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
        {schedules}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
