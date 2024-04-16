import {combineReducers, configureStore} from '@reduxjs/toolkit';
import petTypesReducer from '../reducers/petTypesReducer';
import petBreedsReducer from '../reducers/petBreedsReducer';

const rootReducer = combineReducers({
  petTypes: petTypesReducer,
  petBreeds: petBreedsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

const store = configureStore({
  reducer: rootReducer,
});

export default store;
