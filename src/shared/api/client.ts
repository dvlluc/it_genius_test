import axios from "axios";
import {
  API_TIMEOUT_MS,
  DUMMY_JSON_BASE_URL,
  REST_COUNTRIES_BASE_URL,
} from "@/shared/config/constants";
import { ApiError } from "@/shared/api/errors";

export const apiClient = axios.create({
  baseURL: DUMMY_JSON_BASE_URL,
  timeout: API_TIMEOUT_MS,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ?? error.message ?? "Network request failed";
    return Promise.reject(
      new ApiError(message, error.response?.status, error.code),
    );
  },
);

export const countriesClient = axios.create({
  baseURL: REST_COUNTRIES_BASE_URL,
  timeout: API_TIMEOUT_MS,
});

countriesClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ?? error.message ?? "Network request failed";
    return Promise.reject(
      new ApiError(message, error.response?.status, error.code),
    );
  },
);
