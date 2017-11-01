
import {
  setTimeRange,
} from '../actions';
import {
  SET_TIME_RANGE,
} from '../constants';

describe('Timeline actions', () => {
  describe('setTimeRange Action', () => {
    it('has a type of SET_TIME_RANGE', () => {
      const expected = {
        type: SET_TIME_RANGE,
      };
      expect(setTimeRange().type).toEqual(expected.type);
    });
  });
});
