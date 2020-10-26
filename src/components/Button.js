import React from "react";

import "components/Button.scss";

export default function Button(props) {

   const { confirm, danger, disabled, onClick } = props;

   let buttonClass = "button";

   if (confirm) {
      buttonClass += " button--confirm";
   }
   
   if (danger) {
      buttonClass += " button--danger";
   }


   return (
      <button
       className={buttonClass}
       onClick={onClick}
       disabled={disabled}
       >
         { props.children 
      }</button>
   );
}
