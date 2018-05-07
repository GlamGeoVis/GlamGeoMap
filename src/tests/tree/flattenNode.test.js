import { flattenNode } from '../../utils/tree';
import { simpleTree, threeLevelTree, twoLevelTree } from './trees';

describe('flattenNode simpleTree', () => {
  const flattened = flattenNode(simpleTree);
  it('should be an array', () => {
    expect(Array.isArray(flattened)).toBe(true);
  });
  it('should be of length 1', () => {
    expect(flattened.length).toBe(1);
  });
});

describe('flattenNode twoLevelTree', () => {
  const flattened = flattenNode(twoLevelTree);
  it('should be an array', () => {
    expect(Array.isArray(flattened)).toBe(true);
  });
  it('should be of length 3', () => {
    expect(flattened.length).toBe(3);
  });
});

describe('flattenNode threeLevelTree', () => {
  const flattened = flattenNode(threeLevelTree);
  it('should be an array', () => {
    expect(Array.isArray(flattened)).toBe(true);
  });
  it('should be of length 5', () => {
    expect(flattened.length).toBe(5);
  });
});
