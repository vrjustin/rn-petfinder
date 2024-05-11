import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '../stores/store';
import Profile from '../models/Profile';

interface ProfileState {
  profile: Profile;
}

const initialState: ProfileState = {
  profile: {
    shouldOnboard: true,
    isRehydrated: false,
  },
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile(state, action: PayloadAction<Profile>) {
      state.profile = action.payload;
    },
  },
});

export const profile = (state: RootState) => state.profile.profile;

export const {setProfile} = profileSlice.actions;
export default profileSlice.reducer;
