import { ApiResponse } from '../types/api';
import { getAuthHeader } from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_ENDPOINT || 'http://localhost:3002';

export const apiCall = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'An error occurred',
      };
    }

    if (data.success !== undefined && data.data !== undefined) {
      return data;
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred',
    };
  }
};

export const apiGet = async <T>(endpoint: string): Promise<ApiResponse<T>> => {
  return apiCall<T>(endpoint, {
    method: 'GET',
  });
};

export const apiPost = async <T>(
  endpoint: string,
  body?: any
): Promise<ApiResponse<T>> => {
  return apiCall<T>(endpoint, {
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined,
  });
};

export const apiPut = async <T>(
  endpoint: string,
  body?: any
): Promise<ApiResponse<T>> => {
  return apiCall<T>(endpoint, {
    method: 'PUT',
    body: body ? JSON.stringify(body) : undefined,
  });
};

export const apiDelete = async <T>(endpoint: string): Promise<ApiResponse<T>> => {
  return apiCall<T>(endpoint, {
    method: 'DELETE',
  });
};

export const apiPatch = async <T>(
  endpoint: string,
  body?: any
): Promise<ApiResponse<T>> => {
  return apiCall<T>(endpoint, {
    method: 'PATCH',
    body: body ? JSON.stringify(body) : undefined,
  });
};

