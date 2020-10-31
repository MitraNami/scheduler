import React from "react";
import "components/Appointment/styles.scss";
import Header from "components/Appointment/Header";
import Show from "components/Appointment/Show";
import Empty from "components/Appointment/Empty";
import Form from "components/Appointment/Form";
import Status from "components/Appointment/Status";
import Confirm from "components/Appointment/Confirm";
import Error from "components/Appointment/Error";
import useVisualMode from "../../../src/hooks/useVisualMode";


const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const DELETING = "DELETING";
const CONFIRM = "CONFIRM";
const EDIT = "EDIT";
const ERROR_SAVE = "ERROR_SAVE";
const ERROR_DELETE = "ERROR_DELETE";


export default function Appointment(props) {

  const { mode, transition, back } = useVisualMode(props.interview ? SHOW : EMPTY);

  //pass it as prop to Form component
  const save = (name, interviewer) => {
    const interview = {
      student: name,
      interviewer
    };
    
    transition(SAVING, true); //the previous mode is either CREATE or EDIT, we want it replaced with SAVING in history

    props.bookInterview(props.id, interview)
      .then(() => transition(SHOW))
      .catch(error => transition(ERROR_SAVE, true)); //the previous mode is SAVING, we want to replace it with ERROR_SAVE in history
  };


  //pass it as prop to Show component
  const del = () => {
    
    transition(DELETING, true); //display the Deleting indicator, the previous mode is CONFIRM we want it, replaced with DELETING in history
    
    props.cancelInterview(props.id)
      .then(() => transition(EMPTY))
      .catch(error => transition(ERROR_DELETE, true)) //the previous mode is DELETING, we want it replaced with ERROR_DELETE in history
  };


  return (
    <article className="appointment">

      <Header time={props.time}/>

      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />} {/*to go to CREATE mode when the Empty component is clicked*/}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete={() => transition(CONFIRM)} /*to confirm with the user before actually deleting it*/
          onEdit={() => transition(EDIT)}
        />
      )}
      {mode === CREATE && (
        <Form
          interviewers={props.interviewers}
          onCancel={back} /*to return to the EMPTY mode when the cancel button is clicked*/
          onSave={save} /* to capture the name and interviewer id*/
        />
      )}
      {mode === SAVING && (
        <Status message="Saving" />
      )}
      {mode === DELETING && (
        <Status message="Deleting" />
      )}
      {mode === CONFIRM && (
        <Confirm 
          message="Are you sure you want to delete the appointment?"
          onCancel={back}  /*to return to the SHOW mode when the cancel button is clicked*/
          onConfirm={del}
        />
      )}
      {mode === EDIT && (
        <Form 
          name={props.interview.student}
          interviewer={props.interview.interviewer.id}
          interviewers={props.interviewers}
          onCancel={back}
          onSave={save}
        />
      )}
      {mode === ERROR_SAVE && (
        <Error 
          message="Could not save the appointment."
          onClose={back}
        />
      )}
      {mode === ERROR_DELETE && (
        <Error 
          message="Could not delete the appointment."
          onClose={back}
        />
      )}

    </article>
  );


}