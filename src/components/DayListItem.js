import React from "react";
import classNames from "classnames"

import "components/DayListItem.scss";


const formatSpots = (spots) => {
  let msg;
  switch(spots) {
    case 0:
      msg = "no spots remaining";
      break;
    case 1:
      msg = "1 spot remaining";
      break;
    default:
      msg = `${spots} spots remaining`;
  }
  return msg;
};


export default function DayListItem(props) {

  const { name, spots, selected, setDay } = props;

  const listClass = classNames('day-list__item', {
    "day-list__item--selected" : selected,
    "day-list__item--full" : (spots === 0)
  });

  return (
    <li className={listClass} onClick={() => setDay(name)} data-testid="day">
      <h2 className="text--regular">{name}</h2> 
      <h3 className="text--light">{formatSpots(spots)}</h3>
    </li>
  );
}