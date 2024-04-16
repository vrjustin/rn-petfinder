import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '../stores/store';
import {PetType} from '../models/PetType';

interface PetTypesState {
  petTypes: PetType[];
}

const initialState: PetTypesState = {
  petTypes: [],
};

const petTypesSlice = createSlice({
  name: 'petTypes',
  initialState,
  reducers: {
    setPetTypes(state, action: PayloadAction<PetType[]>) {
      state.petTypes = action.payload;
    },
  },
});

export const selectPetTypes = (state: RootState) => state.petTypes.petTypes;

export const {setPetTypes} = petTypesSlice.actions;
export default petTypesSlice.reducer;
