import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Form } from "./Form";
import userEvent from "@testing-library/user-event";

describe("Form", () => {
  test("renders Form component with all inputs", async () => {
    render(<Form />);
    expect(screen.getByTestId("testId-Input-minLong")).toBeInTheDocument();
    expect(screen.getByTestId("testId-Input-minLat")).toBeInTheDocument();
    expect(screen.getByTestId("testId-Input-maxLong")).toBeInTheDocument();
    expect(screen.getByTestId("testId-Input-maxLat")).toBeInTheDocument();
  });

  test("Good boundary box [-0.1,-0.1, 0.1, 0.1 ]", async () => {
    const onSubmitMock = jest.fn();

    render(<Form sideEffectsOnSubmit={onSubmitMock} />);
    addValueToInput(-0.1, "testId-Input-minLong");
    addValueToInput(-0.1, "testId-Input-minLat");
    addValueToInput(0.1, "testId-Input-maxLong");
    addValueToInput(0.1, "testId-Input-maxLat");

    userEvent.click(screen.getByText("Display elements"));

    await waitFor(() => expect(onSubmitMock).toBeCalled());
  });

  test("Other Good boundary box [ 51.1,-0.1,51.2,0  ]", async () => {
    const onSubmitMock = jest.fn();

    render(<Form sideEffectsOnSubmit={onSubmitMock} />);
    addValueToInput(51.1, "testId-Input-minLong");
    addValueToInput(-0.1, "testId-Input-minLat");
    addValueToInput(51.2, "testId-Input-maxLong");
    addValueToInput(0, "testId-Input-maxLat");

    userEvent.click(screen.getByText("Display elements"));

    await waitFor(() => expect(onSubmitMock).toBeCalled());
  });

  test("Bad positive boundary box [ 181, 91, 0, 0  ]", async () => {
    const onSubmitMock = jest.fn();

    render(<Form sideEffectsOnSubmit={onSubmitMock} />);
    addValueToInput(181, "testId-Input-minLong");
    addValueToInput(91, "testId-Input-minLat");
    addValueToInput(0, "testId-Input-maxLong");
    addValueToInput(0, "testId-Input-maxLat");

    userEvent.click(screen.getByText("Display elements"));

    await waitFor(() => expect(onSubmitMock).not.toBeCalled());
  });

  test("Bad negative boundary box [ -181, -91, 0, 0 ]", async () => {
    const onSubmitMock = jest.fn();

    render(<Form sideEffectsOnSubmit={onSubmitMock} />);
    addValueToInput(-181, "testId-Input-minLong");
    addValueToInput(-91, "testId-Input-minLat");
    addValueToInput(0, "testId-Input-maxLong");
    addValueToInput(0, "testId-Input-maxLat");

    userEvent.click(screen.getByText("Display elements"));

    await waitFor(() => expect(onSubmitMock).not.toBeCalled());
  });

  test("Area is too big Bad big boundary box [ 10,10,11,11 ]", async () => {
    const onSubmitMock = jest.fn();

    render(<Form sideEffectsOnSubmit={onSubmitMock} />);
    addValueToInput(10, "testId-Input-minLong");
    addValueToInput(10, "testId-Input-minLat");
    addValueToInput(11, "testId-Input-maxLong");
    addValueToInput(11, "testId-Input-maxLat");

    userEvent.click(screen.getByText("Display elements"));

    await waitFor(() => {
      expect(onSubmitMock).not.toBeCalled();
    });
  });
});

const addValueToInput = (value: number, testId: string) => {
  fireEvent.input(screen.getByTestId(testId), {
    target: {
      value,
    },
  });
};
