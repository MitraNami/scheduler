import React from "react";
import {render, cleanup, fireEvent, getByText, getByTestId, queryByTestId, queryByText} from "@testing-library/react";

import Form from "components/Appointment/Form";

afterEach(cleanup);

describe("Form", () => {

  const interviewers = [
    {
      id: 1,
      name: "Sylvia Palmer",
      avatar: "https://i.imgur.com/LpaY82x.png"
    }
  ];

  it("renders without student name if not provided", () => {
    const {getByPlaceholderText} = render(<Form interviewers={interviewers} />);
    expect(getByPlaceholderText("Enter Student Name")).toHaveValue("");
  });

  it("renders with initial student name", () => {
    const {getByTestId} = render(<Form interviewers={interviewers} name="Lydia Miller-Jones" />);
    expect(getByTestId("student-name-input")).toHaveValue("Lydia Miller-Jones");
  });

  it("validates that the student name is not blank", () => {
    const onSave = jest.fn();
    const {getByText} = render(<Form  interviewers={interviewers} onSave={onSave} />);
    const btn = getByText(/Save/i);
    fireEvent.click(btn);

    expect(getByText(/student name cannot be blank/i)).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  });

  it("can successfully save after trying to submit an empty student name", () => {
    const onSave = jest.fn();
    const {getByText, queryByTestId, queryByText, queryByAltText} = render(
      <Form interviewers={interviewers} onSave={onSave} />
    );

    fireEvent.click(queryByAltText("Sylvia Palmer"));
    const btn = getByText(/save/i);
    fireEvent.click(btn);

    expect(getByText(/student name cannot be blank/i)).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();

    const input = queryByTestId("student-name-input");
    fireEvent.change(input, {target: {value: "Mitra Nami"}});
    fireEvent.click(btn);

    const error = queryByText(/student name cannot be blank/i);
    expect(error).toBeNull();
    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onSave).toHaveBeenCalledWith("Mitra Nami", 1);

  });

  it("calls onCancel and resets the input field", () => {
    const onCancel = jest.fn();
    const { getByText, queryByText, queryByTestId } = render(
      <Form
        interviewers={interviewers}
        onSave={jest.fn()}
        onCancel={onCancel}
      />
    );
    fireEvent.click(getByText("Save"));
    fireEvent.click(getByText("Cancel"));
  
    const error = queryByText(/student name cannot be blank/i);
    expect(error).toBeNull();
    expect(queryByTestId("student-name-input")).toHaveValue("");
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
  
});