import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '../stores/store';
import Animal from '../models/Animal';

interface AnimalsState {
  animals: Animal[];
  favorites: Animal[];
}

const initialState: AnimalsState = {
  animals: [],
  favorites: [],
};

const animalsSlice = createSlice({
  name: 'animals',
  initialState,
  reducers: {
    setAnimals(state, action: PayloadAction<Animal[]>) {
      state.animals = action.payload;
    },
    toggleFavorite(state, action: PayloadAction<Animal>) {
      const isFavorite = state.favorites.some(
        fav => fav.id === action.payload.id,
      );
      if (isFavorite) {
        state.favorites = state.favorites.filter(
          fav => fav.id !== action.payload.id,
        );
      } else {
        state.favorites.push(action.payload);
      }
    },
  },
});

export const selectAnimals = (state: RootState) => state.animals.animals;
export const selectFavorites = (state: RootState) => state.animals.favorites;

export const {setAnimals, toggleFavorite} = animalsSlice.actions;
export default animalsSlice.reducer;
