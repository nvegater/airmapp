import React, { FC, useState } from "react";
import { Box, Button, FormControl, FormErrorMessage } from "@chakra-ui/react";
import { InputCoordinate } from "./InputCoordinate";
import { FieldErrors, useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import axios from "axios";
import qs from "qs";
import osmtogeojson from "osmtogeojson";

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

  const [boundBoxOSM, setBoundBoxOSM] = useState<any>(null);
  const [geoJSON, setGeoJSON] = useState<any>(null);

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

    if (boundBox && boundBox.elements.length > 0) {
      setBoundBoxOSM(boundBox);
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
        Get OSM JSON from openstreet map
      </Button>

      {boundBoxOSM !== null && (
        <Button
          onClick={() => {
            const geoJSON = osmtogeojson(boundBoxOSM);
            if (geoJSON) {
              setGeoJSON(geoJSON);
            }
          }}
        >
          Convert to GeoJSON
        </Button>
      )}

      <Box mt={5}>
        <MapContainer
          center={[51.505, -0.09]}
          zoom={13}
          style={{ height: "350px", width: "100wh" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[51.505, -0.09]}>
            <Popup>
              A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
          </Marker>
        </MapContainer>
      </Box>
    </form>
  );
};
