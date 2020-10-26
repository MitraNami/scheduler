import React from "react";

import "components/Button.scss";

export default function Button(props) {
   let buttonClass = "button";

   if (props.confirms) {
      buttonClass += " button--confirm";
   }
   
   if (props.danger) {
      buttonClass += " button--danger";
   }

   return <button className={buttonClass}>{ props.children }</button>;
}
