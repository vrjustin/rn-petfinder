import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '../stores/store';
import Animal from '../models/Animal';

interface AnimalsState {
  animals: Animal[];
}

const initialState: AnimalsState = {
  animals: [],
};

const animalsSlice = createSlice({
  name: 'animals',
  initialState,
  reducers: {
    setAnimals(state, action: PayloadAction<Animal[]>) {
      state.animals = action.payload;
    },
  },
});

export const selectAnimals = (state: RootState) => state.animals.animals;

export const {setAnimals} = animalsSlice.actions;
export default animalsSlice.reducer;
