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
    breedsPreferred: [],
    orgsPagination: {
      currentPage: 1,
      totalPages: 1,
    },
    animalsPagination: {
      currentPage: 1,
      totalPages: 1,
    },
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
