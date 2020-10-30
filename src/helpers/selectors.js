
// returns an array containing the appointment objects for the given day
const getAppointmentsForDay = (state, day) => {
  const days = state['days']; //an array containing day objects
  if (days.length === 0) {
    return [];
  }
  const intendedDayObj = days.find(dayObj => dayObj.name === day);
  //if the day is not found appointmentIds will be []
  const appointmentIds = intendedDayObj ? intendedDayObj['appointments'] : [];
  const appointments = state['appointments']; 

  const result = Object.values(appointments).reduce((acc, appointment) => {
    if (appointmentIds.indexOf(appointment.id) !== -1) {
      acc.push(appointment);
    }
    return acc;
  }, []);

  return result;
};

/* returns an object that contains the interview data if it is passed an object that 
contains an interviewer. getInterview(state, interview)
interview is an object:
{
  student: 'Mitra Nami',
  interviewer: 2
} or null
we want the returned value to be
{
  student: 'Mitra Nami',
  interviewer: {
    id: 2,
    name: 'Tori Malcolm',
    avatar: 'https://i.imgur.com/Nmx0Qxo.png'
  } or null respectively.
}

*/
const getInterview = (state, interview) => {
  if (interview === null) {
    return null;
  }
  const id = interview.interviewer;
  const interviewers = state['interviewers']; //an obj containing interviewer objs
  const interviewer = Object.values(interviewers).find(interviewer => interviewer.id === id);
  return (
    {
      student: interview['student'],
      interviewer
    }
  );

};

// returns an array containing the interviewers objects for the given day
const getInterviewersForDay = (state, day) => {
  const days = state['days']; //an array containing day objects
  if (days.length === 0) {
    return [];
  }
  const intendedDayObj = days.find(dayObj => dayObj.name === day);
  //if the day is not found interviewerIds will be []
  const interviewersIds = intendedDayObj ? intendedDayObj['interviewers'] : [];
  const interviewers = state['interviewers']; 

  const result = Object.values(interviewers).reduce((acc, interviewer) => {
    if (interviewersIds.indexOf(interviewer.id) !== -1) {
      acc.push(interviewer);
    }
    return acc;
  }, []);

  return result;
}




export { getAppointmentsForDay, getInterview, getInterviewersForDay }