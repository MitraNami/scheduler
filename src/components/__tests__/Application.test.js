import React from "react";
import axios from "axios";

import { render, cleanup, waitForElement, fireEvent,
   prettyDOM, getByText,getByAltText, getAllByTestId, 
   getByPlaceholderText, queryByText, queryByAltText,
   waitForElementToBeRemoved,
   queryByPlaceholderText} from "@testing-library/react";

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


  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async() => {
    const {container, debug} = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));
    
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments.find(element => queryByText(element,"Archie Cohen"));

    fireEvent.click(queryByAltText(appointment, "Edit"));

    const input = queryByPlaceholderText(appointment, /Enter Student Name/i);
    fireEvent.change(input, {target: {value: "Mitra Nami"}});
    fireEvent.click(queryByAltText(appointment, "Sylvia Palmer"));

    expect(input).toHaveValue("Mitra Nami");
    expect(getByText(appointment, "Sylvia Palmer")).toBeInTheDocument();

    fireEvent.click(getByText(appointment, "Save"));

    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    await waitForElementToBeRemoved(() => getByText(appointment, "Saving"));

    expect(getByText(appointment, "Mitra Nami")).toBeInTheDocument();
    expect(getByText(appointment, "Sylvia Palmer")).toBeInTheDocument();

    const days = getAllByTestId(container, "day");
    const day = days.find(element => queryByText(element, "Monday"));
    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();
  });


  it("shows the save error when failing to save an appointment", async() => {
    axios.put.mockRejectedValueOnce();

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

    expect(getByText(appointment, /Could not save the appointment./i)).toBeInTheDocument();

    fireEvent.click(queryByAltText(appointment, "Close"));

    expect(getByAltText(appointment, "Add")).toBeInTheDocument();
  });


  it("shows the delete error when failing to delete an existing appointment", async() => {
    axios.delete.mockRejectedValueOnce();

    const {container, debug} = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments.find(element => queryByText(element, "Archie Cohen"));

    fireEvent.click(queryByAltText(appointment, "Delete"));
    fireEvent.click(getByText(appointment, "Confirm"));

    await waitForElementToBeRemoved(() => getByText(appointment, "Deleting"));

    expect(getByText(appointment, /Could not delete the appointment/i)).toBeInTheDocument();

    fireEvent.click(queryByAltText(appointment, "Close"));

    expect(getByText(appointment, "Archie Cohen")).toBeInTheDocument();
  });

});
