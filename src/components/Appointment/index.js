import React from "react";
import "components/Appointment/styles.scss";
import Header from "components/Appointment/Header";
import Show from "components/Appointment/Show";
import Empty from "components/Appointment/Empty";
import useVisualMode from "../../../src/hooks/useVisualMode";

const EMPTY = "EMPTY";
const SHOW = "SHOW";

export default function Appointment(props) {

  const { mode, transition, back } = useVisualMode(props.interview ? SHOW : EMPTY);
  return (
    <article className="appointment">

      <Header time={props.time}/>

      {mode === EMPTY && <Empty onAdd={() => console.log("Clicked onAdd")} />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
        />
      )}


    </article>
  );


}