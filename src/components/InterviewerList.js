import React from "react";
import InterviewerListItem from "components/InterviewerListItem";
import "components/InterviewerList.scss";


export default function InterviewerList(props) {

  const InterviewerListItems = props.interviewers.map((interviewer) => {
    const {id, name, avatar} = interviewer;
    return (
      <InterviewerListItem 
        key={id}
        name={name}
        avatar={avatar}
        selected={id === props.interviewer}
        setInterviewer={props.setInterviewer}
      />
    );
  });

  return (
    <section className="interviewers">
      <h4 className="interviewers__header text--light">Interviewer</h4>
      <ul className="interviewers__list">
        {InterviewerListItems}
      </ul>
    </section>
  );
}