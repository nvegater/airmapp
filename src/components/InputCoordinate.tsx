import React, { FC } from "react";
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  NumberInput,
  NumberInputField,
} from "@chakra-ui/react";
import { Control, FieldError, useController } from "react-hook-form";
import { BoundingBoxInputsForm } from "./Form";

type Range = { min: number; max: number };

interface InputCoordinateProps {
  name: "minLong" | "minLat" | "maxLong" | "maxLat";
  label: string;
  range: Range;
  placeholder: string;
  control: Control<BoundingBoxInputsForm, any>;
  error: FieldError | undefined;
}

export const InputCoordinate: FC<InputCoordinateProps> = ({
  name,
  label,
  range,
  placeholder,
  control,
  error,
}) => {
  const { field, fieldState } = useController({
    name,
    control,
    rules: {
      required: `${name} is required`,
      min: {
        value: range.min,
        message: `Minimum value is ${range.min.toString()} `,
      },
      max: {
        value: range.max,
        message: `Maximum value is ${range.max.toString()} `,
      },
    },
  });

  return (
    <FormControl isInvalid={fieldState.invalid} mb={5}>
      <FormLabel htmlFor={field.name} data-testid={`testId-Label-${name}`}>
        {label}
      </FormLabel>
      <NumberInput precision={6} pattern="(-)?[0-9]*(.[0-9]+)?">
        <NumberInputField
          {...field}
          placeholder={placeholder}
          data-testid={`testId-Input-${field.name}`}
        />
      </NumberInput>
      <FormErrorMessage data-testid={`testId-Error-${name}`}>
        {error?.message}
      </FormErrorMessage>
    </FormControl>
  );
};
