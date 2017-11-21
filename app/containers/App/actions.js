import {
  GET_CLUSTER_DETAILS, GET_CLUSTER_DETAILS_COMPLETED, GET_CLUSTER_DETAILS_ERROR, REQUEST_COMPLETED, REQUEST_DATA,
  REQUEST_ERROR,
} from './constants';

export const request = (parameters) => ({ type: REQUEST_DATA, parameters });
export const requestCompleted = (data) => ({ type: REQUEST_COMPLETED, data });
export const requestError = (error) => ({ type: REQUEST_ERROR, error });

export const getClusterDetails = (id) => ({ type: GET_CLUSTER_DETAILS, id });
export const getClusterDetailsCompleted = (data) => ({ type: GET_CLUSTER_DETAILS_COMPLETED, data });
export const getClusterDetailsError = (error) => ({ type: GET_CLUSTER_DETAILS_ERROR, error });
