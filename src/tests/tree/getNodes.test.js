import { getNodesForScale } from '../../utils/tree';
import { simpleTree, threeLevelTree, twoLevelTree } from './trees';

describe('getNodesForScale simpleTree', () => {
  const nodes = getNodesForScale(simpleTree);
  it('should be an array', () => {
    expect(Array.isArray(nodes)).toBe(true);
  });
  it('should be of length 1', () => {
    expect(nodes.length).toBe(1);
  });
});


describe('getNodesForScale twoLevelTree', () => {
  it('should be of length 2 at t=0', () => {
    expect(getNodesForScale(twoLevelTree, 0).length).toBe(2);
  });
  it('should be of length 1 at t=1', () => {
    expect(getNodesForScale(twoLevelTree, 1).length).toBe(1);
  });
});


describe('getNodesForScale threeLevelTree', () => {
  it('should be of length 3 at t=0', () => {
    expect(getNodesForScale(threeLevelTree, 0).length).toBe(3);
  });
  it('should be of length 2 at t=1', () => {
    expect(getNodesForScale(threeLevelTree, 1).length).toBe(2);
  });
  it('should be of length 1 at t=2', () => {
    expect(getNodesForScale(threeLevelTree, 2).length).toBe(1);
  });
});
