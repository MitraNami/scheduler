import React from "react";

import { render, cleanup, waitForElement, fireEvent,
   prettyDOM, getByText,getByAltText, getAllByTestId, 
   getByPlaceholderText, queryByText,
   waitForElementToBeRemoved} from "@testing-library/react";

import Application from "components/Application";

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
    
    //await waitForElement(() => getByText(appointment, "Mitra Nami"));

    const days = getAllByTestId(container, "day");
    const day = days.find((element) => queryByText(element, "Monday"));
    expect(getByText(day, "no spots remaining")).toBeInTheDocument();

  });

});
