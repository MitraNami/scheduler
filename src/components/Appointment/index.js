import React from "react";
import "components/Appointment/styles.scss";
import Header from "components/Appointment/Header";
import Show from "components/Appointment/Show";
import Empty from "components/Appointment/Empty";
import Form from "components/Appointment/Form";
import Status from "components/Appointment/Status";
import Confirm from "components/Appointment/Confirm";
import useVisualMode from "../../../src/hooks/useVisualMode";


const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const DELETING = "DELETING";
const CONFIRM = "CONFIRM";
const EDIT = "EDIT";

export default function Appointment(props) {

  const { mode, transition, back } = useVisualMode(props.interview ? SHOW : EMPTY);

  //pass it as prop to Form component
  const save = (name, interviewer) => {
    const interview = {
      student: name,
      interviewer
    };
    //display the SAVING indicator before transition to SHOW mode
    transition(SAVING);

    //Transition to SHOW when the promise returned by props.bookInterview resolves
    props.bookInterview(props.id, interview).then(() => transition(SHOW));
  
  };

  //pass it as prop to Show component
  const del = () => {
    //display the Deleting indicator before transition to EMPTY mode
    transition(DELETING);
    //Transition to EMPTY when the promise returned by props.bookInterview resolves
    props.cancelInterview(props.id).then(() => transition(EMPTY));
    
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

    </article>
  );


}