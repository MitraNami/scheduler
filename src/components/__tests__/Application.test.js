import React from "react";

import { render, cleanup, waitForElement, fireEvent,
   prettyDOM, getByText,getByAltText, getAllByTestId, 
   getByPlaceholderText, queryByText, queryByAltText,
   waitForElementToBeRemoved} from "@testing-library/react";

import Application from "components/Application";
import { element } from "prop-types";

afterEach(cleanup);

describe("Application", () => {

  it("defaults to Monday and changes the schedule when a new day is selected", () => {
    const {getByText} = render(<Application />);

    return waitForElement(() => getByText("Monday"))
      .then(() => {
        fireEvent.click(getByText("Tuesday"));
        expect(getByText("Leopold Silvers")).toBeInTheDocument();
      })
  });


  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async() => {
    
    const {container, debug} = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];

    fireEvent.click(getByAltText(appointment, "Add"));
    const input = getByPlaceholderText(appointment, /Enter Student Name/i);
    fireEvent.change(input, {target: {value: "Mitra Nami"}});
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.click(getByText(appointment, "Save"));
    
    expect(getByText(appointment, "Saving")).toBeInTheDocument();
  
    await waitForElementToBeRemoved(() => getByText(appointment, "Saving"));
   
    expect(getByText(appointment, "Mitra Nami")).toBeInTheDocument();

    const days = getAllByTestId(container, "day");
    const day = days.find((element) => queryByText(element, "Monday"));
    expect(getByText(day, "no spots remaining")).toBeInTheDocument();

  });


  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async() => {

    const {container, debug} = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));
    
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments.find(element => queryByText(element,"Archie Cohen"));

    fireEvent.click(queryByAltText(appointment, "Delete"));

    expect(getByText(appointment, "Are you sure you want to delete the appointment?"))
      .toBeInTheDocument();

    fireEvent.click(getByText(appointment, "Confirm"));
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();

    await waitForElementToBeRemoved(() => getByText(appointment, "Deleting"));

    expect(getByAltText(appointment, "Add")).toBeInTheDocument();

    const days = getAllByTestId(container, "day");
    const day = days.find(element => queryByText(element, "Monday"));
    expect(getByText(day, "2 spots remaining")).toBeInTheDocument();
    
  });


 

});
