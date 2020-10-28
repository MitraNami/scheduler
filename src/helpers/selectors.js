
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

export { getAppointmentsForDay }