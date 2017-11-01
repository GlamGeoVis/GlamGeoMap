import { REQUEST_COMPLETED, REQUEST_DATA, REQUEST_ERROR } from './constants';

export const request = (parameters) => ({ type: REQUEST_DATA, parameters });
export const requestCompleted = (data) => ({ type: REQUEST_COMPLETED, data });
export const requestError = (error) => ({ type: REQUEST_ERROR, error });
