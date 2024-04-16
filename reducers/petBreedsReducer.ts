import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import Breed from '../models/Breed';
import {RootState} from '../stores/store';

interface BreedsState {
  breeds: Breed[];
}

const initialState: BreedsState = {
  breeds: [],
};

const breedsSlice = createSlice({
  name: 'breeds',
  initialState,
  reducers: {
    setBreeds(state, action: PayloadAction<Breed[]>) {
      state.breeds = action.payload;
    },
  },
});

export const selectPetBreeds = (state: RootState) => state.petBreeds.breeds;

export const {setBreeds} = breedsSlice.actions;
export default breedsSlice.reducer;
