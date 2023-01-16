import fetch from "isomorphic-fetch";
import qs from "query-string";

const apiHost = process.env.NEXT_PUBLIC_ENDPOINT || 'http://localhost:3001';

export enum ResponseStatusCode {
  success = 200,
  notFound = 404,
  internal = 500
}

export const getEndpoint = (endpoint: string, server?: boolean) => {
  return server ? `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT || ''}${endpoint}` : endpoint;
}

export class FetchError extends Error {
  constructor(msg?: string) {
    super();
    this.name = "FetchError",
      this.message = msg ?? "";
  }
}

const defaultHeaders = {
  "Content-Type": "application/json",
  Accept: "application/json"
}

export type RequestData = {
  endpoint: string;
  method?: RequestInit["method"],
  body?: any;
  customHeaders?: any;
  bodyType?: "json" | "multipart",
  responseType?: "json" | "buffer" | "text"
  withCredentials?: boolean;
  getRedirectResponseURL?: boolean;
};

const request = async (args: RequestData) => {
  const {
    endpoint,
    method = "GET",
    body,
    customHeaders = {},
    withCredentials = false,
    bodyType = "json",
    responseType = "json",
    getRedirectResponseURL
  } = args;
  let _endpoint = endpoint;
  if (!endpoint.startsWith("http")) {
    _endpoint = `${apiHost}${endpoint}`;
  }
  const headers = {
    ...defaultHeaders,
    ...customHeaders,
  }
  if (method === "POST" && bodyType === "multipart") headers["Content-Type"] = "multipart/form-data";
  try {
    const response = await fetch(_endpoint, {
      method,
      headers,
      body: body ? (bodyType === "multipart" ? body : JSON.stringify(body)) : null,
      credentials: withCredentials ? "include" : "omit"
    });

    const getResponse = async (response: Response) => {
      try {
        const data = responseType === "buffer"
          ? await response.arrayBuffer()
          : (responseType === "text" ? await response.text() : await response.json());
        return data;
      } catch (error) {
        if (getRedirectResponseURL) {
          return {
            responseURL: response.url
          };
        } else {
          throw error;
        }
      }
    }

    const data = await getResponse(response);
    return {
      error: response.status !== ResponseStatusCode.success,
      data,
      headers: response.headers
    }
  } catch (error) {
    throw new FetchError(error?.message ?? 'Unexpected Error');
  }
}

export const get = (args: Omit<RequestData, "method" | "body"> & { params?: any }) => {
  const { endpoint, params, ...rest } = args;
  let _endpoint = endpoint;
  if (params && !(params.constructor === Object && !Object.keys(params).length)) {
    _endpoint += `?${qs.stringify(params, { encode: true })}`;
  }
  return request({ endpoint: _endpoint, ...rest });
}

export const post = (args: Omit<RequestData, "method"> & { params?: any }) => {
  const { endpoint, params, ...rest } = args;
  let _endpoint = endpoint;
  if (params && !(params.constructor === Object && !Object.keys(params).length)) {
    _endpoint += `?${qs.stringify(params, { encode: true })}`;
  }
  return request({ method: "POST", endpoint: _endpoint, ...rest });
}

export const patch = (args: Omit<RequestData, "method"> & { params?: any }) => {
  const { endpoint, params, ...rest } = args;
  let _endpoint = endpoint;
  if (params && !(params.constructor === Object && !Object.keys(params).length)) {
    _endpoint += `?${qs.stringify(params, { encode: true })}`;
  }
  return request({ method: "PATCH", endpoint: _endpoint, ...rest });
}

export const del = (args: Omit<RequestData, "method"> & { params?: any }) => {
  const { endpoint, params, ...rest } = args;
  let _endpoint = endpoint;
  if (params && !(params.constructor === Object && !Object.keys(params).length)) {
    _endpoint += `?${qs.stringify(params, { encode: true })}`;
  }
  return request({ method: "DELETE", endpoint: _endpoint, ...rest });
}