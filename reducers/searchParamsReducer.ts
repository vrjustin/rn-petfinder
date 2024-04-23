import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '../stores/store';
import SearchParameters from '../models/SearchParameters';

interface SearchParametersState {
  searchParameters: SearchParameters;
}

const initialState: SearchParametersState = {
  searchParameters: {
    location: {
      zipCode: '90210',
    },
    distance: 500, //in miles
    tagsPreferred: [],
  },
};

const searchParametersSlice = createSlice({
  name: 'searchParameters',
  initialState,
  reducers: {
    setSearchParameters(state, action: PayloadAction<SearchParameters>) {
      state.searchParameters = action.payload;
    },
  },
});

export const selectSearchParameters = (state: RootState) =>
  state.searchParameters.searchParameters;

export const {setSearchParameters} = searchParametersSlice.actions;
export default searchParametersSlice.reducer;
