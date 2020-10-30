import React from "react";
import "components/Appointment/styles.scss";
import Header from "components/Appointment/Header";
import Show from "components/Appointment/Show";
import Empty from "components/Appointment/Empty";
import Form from "components/Appointment/Form";
import Status from "components/Appointment/Status";
import useVisualMode from "../../../src/hooks/useVisualMode";


const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";

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
  
  }

  return (
    <article className="appointment">

      <Header time={props.time}/>

      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />} {/*to go to CREATE mode when the Empty component is clicked*/}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
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
        <Status message="Saving the appointment!" />
      )}


    </article>
  );


}