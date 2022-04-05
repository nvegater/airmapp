import React, { FC } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { InputCoordinate } from "./InputCoordinate";
import { useForm } from "react-hook-form";
import { BoundingBoxInputsForm } from "./Form";
import { ChakraProvider } from "@chakra-ui/react";

interface MockFormProps {
  submitFn: () => void;
}

const Wrapper: FC<MockFormProps> = ({ submitFn }) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<BoundingBoxInputsForm>();
  const onSubmit = (data: BoundingBoxInputsForm) => {
    submitFn();
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <InputCoordinate
        name={"minLong"}
        label={"Min Longitude"}
        range={{ min: -180, max: 180 }}
        placeholder={"Left or west coordinate"}
        control={control}
        error={errors.minLong}
      />
      <button type="submit">Submit</button>
    </form>
  );
};

describe("InputCoordinate test", () => {
  test("renders InputCoordinate component", () => {
    render(
      <ChakraProvider>
        <Wrapper submitFn={() => {}} />
      </ChakraProvider>
    );
    expect(screen.getByTestId("testId-Label-minLong")).toBeInTheDocument();
  });

  test("invalid value renders error message and prevents submit", async () => {
    const mockFn = jest.fn();

    render(
      <ChakraProvider>
        <Wrapper submitFn={mockFn} />
      </ChakraProvider>
    );

    fireEvent.input(screen.getByRole("spinbutton"), {
      target: {
        value: 200,
      },
    });

    fireEvent.submit(screen.getByRole("button"));

    expect(
      await screen.findByTestId("testId-Error-minLong")
    ).toBeInTheDocument();
    expect(mockFn).not.toBeCalled();
  });

  test("valid value allows submit, displays no error", async () => {
    const mockFn = jest.fn();

    render(
      <ChakraProvider>
        <Wrapper submitFn={mockFn} />
      </ChakraProvider>
    );

    fireEvent.input(screen.getByRole("spinbutton"), {
      target: {
        value: 20,
      },
    });

    fireEvent.submit(screen.getByRole("button"));

    await waitFor(() => expect(mockFn).toBeCalled());

    expect(screen.queryByTestId("testId-Error-minLong")).toBeNull();
  });
});
