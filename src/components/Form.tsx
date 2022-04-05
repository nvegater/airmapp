import React, { FC, useState } from "react";
import { Box, Button, FormControl, FormErrorMessage } from "@chakra-ui/react";
import { FieldErrors, useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { InputCoordinate } from "./InputCoordinate";
import { Map } from "./Map";
import useMapApi, { OSMMapParams_0_6 } from "../api/useMapApi";

export interface BoundingBoxInputsForm {
  minLong: number;
  minLat: number;
  maxLong: number;
  maxLat: number;
  error: any;
}

type ErrorSummaryProps<T> = {
  errors: FieldErrors<T>;
};

type ErrorType = "lat" | "long" | "area";

const validateCoordinates = (data: BoundingBoxInputsForm): ErrorType | null => {
  // The form converts the inputs to chars, this corrects that for validation
  const minLat = parseFloat(data.minLat as unknown as string);
  const maxLat = parseFloat(data.maxLat as unknown as string);
  const minLong = parseFloat(data.minLong as unknown as string);
  const maxLong = parseFloat(data.maxLong as unknown as string);

  // based on https://github.com/openstreetmap/openstreetmap-website/blob/master/lib/bounding_box.rb
  const latErr = minLat > maxLat;
  const longErr = minLong > maxLong;

  if (latErr) {
    return "lat";
  }
  if (longErr) {
    return "long";
  }

  let latDiff = Math.abs(data.maxLat) - Math.abs(data.minLat);
  let longDiff = Math.abs(data.maxLong) - Math.abs(data.minLong);

  const area = latDiff * longDiff;
  // The API is limited to bounding boxes of about 0.5 degree by 0.5 degree
  const AREA_LIMIT = 0.25; // 0.5 * 0.5

  if (area > AREA_LIMIT) {
    return "area";
  }

  return null;
};

export function ErrorSummary<T>({ errors }: ErrorSummaryProps<T>) {
  if (Object.keys(errors).length === 0) {
    return null;
  }
  return (
    <div className="error-summary">
      {Object.keys(errors).map((fieldName) => (
        <ErrorMessage
          errors={errors}
          name={fieldName as any}
          as="div"
          key={fieldName}
        />
      ))}
    </div>
  );
}

export const Form: FC = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
    setError,
    clearErrors,
    reset,
  } = useForm<BoundingBoxInputsForm>();

  const [isValidCoordinates, setIsValidCoordinates] = useState<boolean>(false);
  const [bboxCoordinates, setBboxCoordinates] = useState<OSMMapParams_0_6>([
    0, 0, 0, 0,
  ]);

  const { boundsGeoJSON, error } = useMapApi({
    pause: !isValidCoordinates,
    isMock: false,
    params: { bbox: bboxCoordinates },
  });

  const onSubmit = async (data: BoundingBoxInputsForm) => {
    // clear general errors
    clearErrors("error");
    const errors = validateCoordinates(data);
    if (errors === "lat") {
      setError("maxLat", {
        message: "",
      });
      setError("minLat", {
        message: "",
      });
      setError("error", {
        message: "minima must be less than the maxima.",
      });
      return;
    }
    if (errors === "long") {
      setError("maxLong", {
        message: "",
      });
      setError("minLong", {
        message: "",
      });
      setError("error", {
        message: "minima must be less than the maxima.",
      });
      return;
    }

    if (errors === "area") {
      setError("maxLat", {
        message: `The area is too big`,
      });
      return;
    }

    if (errors === null) {
      setIsValidCoordinates(true);
      setBboxCoordinates([
        data.minLong,
        data.minLat,
        data.maxLong,
        data.maxLat,
      ]);
      reset();
    }
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
      <InputCoordinate
        name={"minLat"}
        label={"Min Latitude"}
        range={{ min: -90, max: 90 }}
        placeholder={"Bottom or south coordinate"}
        control={control}
        error={errors.minLat}
      />

      <InputCoordinate
        name={"maxLong"}
        label={"Max Longitude"}
        range={{ min: -180, max: 180 }}
        placeholder={"Right or east coordinate"}
        control={control}
        error={errors.maxLong}
      />

      <InputCoordinate
        name={"maxLat"}
        label={"Max Latitude"}
        range={{ min: -90, max: 90 }}
        placeholder={"Top or north coordinate"}
        control={control}
        error={errors.maxLat}
      />

      <FormControl isInvalid={Boolean(errors)}>
        <FormErrorMessage>
          <ErrorSummary errors={errors} />
        </FormErrorMessage>
      </FormControl>

      <Button mt={4} colorScheme="teal" type="submit">
        Display elements
      </Button>

      {!error && (
        <Box mt={5}>
          <Map data={boundsGeoJSON} />
        </Box>
      )}
    </form>
  );
};
