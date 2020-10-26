import React from "react";
import DayListItem from 'components/DayListItem';

// DayList component holds multiple days
export default function DayList(props) {

  const DayListComponents = props.days.map(dayobj => {
    const { id, name, spots } = dayobj;
    return (
      <DayListItem 
        key={id} 
        name={name}
        spots={spots} 
        selected={name === props.day} 
        setDay={props.setDay}
      />
    )
  });

  return (
    <ul>
      {DayListComponents}
    </ul>
  );
};