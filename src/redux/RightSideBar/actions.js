import {
  GET_CLUSTER_DETAILS,
} from './constants';

export function getClusterDetails(id) {
  return {
    type: GET_CLUSTER_DETAILS,
    id,
  };
}
