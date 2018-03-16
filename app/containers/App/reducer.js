/* eslint-disable no-param-reassign */
import {
  GET_CLUSTER_DETAILS_COMPLETED,
  REQUEST_COMPLETED, SET_GLYPHS_DATA,
} from './constants';

const initialState = {
  clusters: {},
  years: {},
  total: 0,
  leafData: [],
  glyphs: [],
};

const tagClusters = (clusters, idx = 0) => {
  idx += 1;
  clusters.idx = idx;
  if (clusters.c) {
    clusters.c.forEach((child) => {
      idx = tagClusters(child, idx);
    });
  }
  return idx;
};

const parseClusters = (rawClusters) => {
  const clusters = JSON.parse(rawClusters);
  tagClusters(clusters);
  return clusters;
};

export function dataReducer(state = initialState, action) {
  switch (action.type) {
    case REQUEST_COMPLETED:
      return {
        clusters: parseClusters(action.data.clusters),
        years: action.data.years,
        total: action.data.total,
        leafData: action.data.data,
      };
    default:
      return state;
  }
}

export function clusterDetailsReducer(state = [], action) {
  switch (action.type) {
    case GET_CLUSTER_DETAILS_COMPLETED:
      return action.data;
    default:
      return state;
  }
}

export const setGlyphsDataReducer = (state = [], action) =>
  action.type === SET_GLYPHS_DATA
    ? action.glyphs
    : state;
