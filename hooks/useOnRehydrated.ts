import store from '../stores/store';
import {setProfile} from '../reducers/profileReducer';

export const useOnRehydrated = () => {
  const userProfile = store.getState().profile.profile;
  const {shouldOnboard, userName, signInMethod} = userProfile;
  store.dispatch(
    setProfile({
      ...userProfile,
      shouldOnboard: shouldOnboard,
      isRehydrated: true,
      userName: userName,
      signInMethod: signInMethod,
    }),
  );
};
