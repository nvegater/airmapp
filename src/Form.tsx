import React, { FC } from "react";
import { Button, FormControl, FormErrorMessage } from "@chakra-ui/react";
import { InputCoordinate } from "./InputCoordinate";
import { FieldErrors, useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

import axios from "axios";
import qs from "qs";

export interface BoundingBoxInputsForm {
  minLong: number;
  minLat: number;
  maxLong: number;
  maxLat: number;
  error: any;
}

type OSMMapParams_0_6 = [
  left: number,
  bottom: number,
  right: number,
  top: number
];

interface OSMBBox {
  bbox: OSMMapParams_0_6;
}

const OSMApi_map_0_6 = "https://www.openstreetmap.org/api/0.6/map";

const boundBoxFetcher = (url: string, params: OSMBBox) => {
  console.log(params);
  return axios
    .get(url, {
      params,
      paramsSerializer: () => {
        return qs.stringify(params, { arrayFormat: "comma", encode: false });
      },
    })
    .then(({ data }) => data);
};

type ErrorSummaryProps<T> = {
  errors: FieldErrors<T>;
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
  // GET /api/0.6/map?bbox=left,bottom,right,top

  const {
    handleSubmit,
    control,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<BoundingBoxInputsForm>();

  const onSubmit = async (data: BoundingBoxInputsForm) => {
    // clear general errors
    clearErrors("error");
    let latDiff = Math.abs(data.maxLat) - Math.abs(data.minLat);
    let longDiff = Math.abs(data.maxLong) - Math.abs(data.minLong);

    if (latDiff < 0) {
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
    if (longDiff < 0) {
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

    const area = latDiff * longDiff;
    // The API is limited to bounding boxes of about 0.5 degree by 0.5 degree
    const AREA_LIMIT = 0.25; // 0.5 * 0.5

    if (area > AREA_LIMIT) {
      setError("maxLat", {
        message: `The area ${area} is too big`,
      });
      return;
    }
    const boundBox = await boundBoxFetcher(OSMApi_map_0_6, {
      bbox: [data.minLong, data.minLat, data.maxLong, data.maxLat],
    });

    console.log(boundBox);
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
        Get GeoJSON
      </Button>
    </form>
  );
};
