import { getLeaves } from '../../utils/tree';
import { simpleTree, threeLevelTree, twoLevelTree } from './trees';

describe('getLeaves simpleTree', () => {
  const leaves = getLeaves(simpleTree);
  it('should be an array', () => {
    expect(Array.isArray(leaves)).toBe(true);
  });
  it('should be of length 1', () => {
    expect(leaves.length).toBe(1);
  });
});

describe('getLeaves twoLevelTree', () => {
  const leaves = getLeaves(twoLevelTree);
  it('should be an array', () => {
    expect(Array.isArray(leaves)).toBe(true);
  });
  it('should be of length 2', () => {
    expect(leaves.length).toBe(2);
  });
});

describe('getLeaves threeLevelTree', () => {
  const leaves = getLeaves(threeLevelTree);
  it('should be an array', () => {
    expect(Array.isArray(leaves)).toBe(true);
  });
  it('should be of length 2', () => {
    expect(leaves.length).toBe(3);
  });
});
