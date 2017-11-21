/*
 * AppConstants
 * Each action has a corresponding type, which the reducer knows and picks up on.
 * To avoid weird typos between the reducer and the actions, we save them as
 * constants here. We prefix them with 'yourproject/YourComponent' so we avoid
 * reducers accidentally picking up actions they shouldn't.
 *
 * Follow this format:
 * export const YOUR_ACTION_CONSTANT = 'yourproject/YourContainer/YOUR_ACTION_CONSTANT';
 */

export const DEFAULT_LOCALE = 'en';
export const REQUEST_DATA = 'app/REQUEST_DATA';
export const REQUEST_COMPLETED = 'app/REQUEST_DATA/completed';
export const REQUEST_ERROR = 'app/REQUEST_DATA/error';
export const GET_CLUSTER_DETAILS = 'app/GET_CLUSTER_DETAILS';
export const GET_CLUSTER_DETAILS_COMPLETED = 'app/GET_CLUSTER_DETAILS/completed';
export const GET_CLUSTER_DETAILS_ERROR = 'app/GET_CLUSTER_DETAILS/error';

export const BACKEND_URL = process.env.NODE_ENV === 'production'
  ? '/api'
  : 'http://localhost:8000';
