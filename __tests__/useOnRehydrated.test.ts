import {useOnRehydrated} from '../hooks/useOnRehydrated';
import {setProfile} from '../reducers/profileReducer';
import {googleSignedInProfile} from '../__mocks__/mocks';

jest.mock('../stores/store', () => ({
  getState: jest.fn(),
  dispatch: jest.fn(),
}));

const mockStore = require('../stores/store');

describe('useOnRehydrated', () => {
  beforeEach(() => {
    mockStore.getState.mockReturnValue({
      profile: {
        profile: googleSignedInProfile,
      },
    });
    mockStore.dispatch.mockClear();
  });

  it('should dispatch setProfile action with the correct payload', () => {
    const expectedAction = {
      type: setProfile.type,
      payload: {
        shouldOnboard: false,
        isRehydrated: true,
        userName: 'google-test-user',
        signInMethod: 'google',
      },
    };

    useOnRehydrated();

    expect(mockStore.dispatch).toHaveBeenCalledWith(expectedAction);
  });
});
