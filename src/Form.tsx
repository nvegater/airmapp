import React, { FC } from "react";
import { Button } from "@chakra-ui/react";
import { InputCoordinate } from "./InputCoordinate";
import { useForm } from "react-hook-form";

export interface BoundingBoxInputsForm {
  minLong: number;
  minLat: number;
  maxLong: number;
  maxLat: number;
}

export const Form: FC = () => {
  // GET /api/0.6/map?bbox=left,bottom,right,top

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<BoundingBoxInputsForm>();

  const onSubmit = (data: BoundingBoxInputsForm) => {
    console.log("Submitting", data);
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

      <Button mt={4} colorScheme="teal" type="submit">
        Get GeoJSON
      </Button>
    </form>
  );
};
