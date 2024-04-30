import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '../stores/store';
import Organization from '../models/Organization';

interface OrganizationsState {
  organizations: Organization[];
}

const initialState: OrganizationsState = {
  organizations: [],
};

const organizationsSlice = createSlice({
  name: 'organizations',
  initialState,
  reducers: {
    setOrganizations(state, action: PayloadAction<Organization[]>) {
      state.organizations = action.payload;
    },
  },
});

export const selectOrganizations = (state: RootState) =>
  state.organizations.organizations;

export const {setOrganizations} = organizationsSlice.actions;
export default organizationsSlice.reducer;
