import useSWR from "swr";
import axios from "axios";
import qs from "qs";
import { mockedOSM } from "./mockedOsm";
import { useMemo } from "react";

export type OSMMapParams_0_6 = [
  left: number,
  bottom: number,
  right: number,
  top: number
];

interface OSMBBox {
  bbox: OSMMapParams_0_6;
}

// GET /api/0.6/map?bbox=left,bottom,right,top
const OSMApi_map_0_6 = "https://www.openstreetmap.org/api/0.6/map";

const boundBoxFetcher = (url: string, params: OSMBBox) => {
  return axios
    .get(url, {
      params,
      paramsSerializer: () => {
        return qs.stringify(params, { arrayFormat: "comma", encode: false });
      },
    })
    .then(({ data }) => data);
};

interface UseMapApiProps {
  pause: boolean;
  isMock: boolean;
  params: OSMBBox;
}

interface UseMapApiResult {
  boundsGeoJSON: any;
  loading: boolean;
  error: any;
}

const useMapApi = ({
  pause,
  isMock,
  params,
}: UseMapApiProps): UseMapApiResult => {
  const memoizedSearchParams: OSMBBox = useMemo(
    () => ({ ...params }),
    [params]
  );

  const { data, error } = useSWR(
    pause || isMock ? null : [OSMApi_map_0_6, memoizedSearchParams],
    boundBoxFetcher
  );

  return isMock
    ? {
        boundsGeoJSON: mockedOSM,
        loading: false,
        error: undefined,
      }
    : {
        boundsGeoJSON: data,
        loading: !data && !error,
        error: error,
      };
};

export default useMapApi;
