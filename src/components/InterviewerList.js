import React from "react";
import PropTypes from 'prop-types';

import InterviewerListItem from "components/InterviewerListItem";
import "components/InterviewerList.scss";


function InterviewerList(props) {

  const interviewers = props.interviewers.map(item => {
    return (
      <InterviewerListItem 
        key={item.id}
        name={item.name}
        avatar={item.avatar}
        selected={item.id === props.interviewer}
        setInterviewer={event => props.setInterviewer(item.id)}
      />
    );
  });

  return (
    <section className="interviewers">
      <h4 className="interviewers__header text--light">Interviewer</h4>
      <ul className="interviewers__list">
        {interviewers}
      </ul>
    </section>
  );
}

//gives you Failed prop type Error if the interviewers prop is not geven an array
InterviewerList.propTypes = {
  interviewers: PropTypes.array.isRequired
};

export default InterviewerList;