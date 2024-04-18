import {combineReducers, configureStore} from '@reduxjs/toolkit';
import petTypesReducer from '../reducers/petTypesReducer';
import petBreedsReducer from '../reducers/petBreedsReducer';
import animalsReducer from '../reducers/animalsReducer';
import searchParamsReducer from '../reducers/searchParamsReducer';

const createDebugger = require('redux-flipper').default;

const rootReducer = combineReducers({
  petTypes: petTypesReducer,
  petBreeds: petBreedsReducer,
  animals: animalsReducer,
  searchParameters: searchParamsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    __DEV__
      ? getDefaultMiddleware({serializableCheck: false}).concat(
          createDebugger(),
        )
      : getDefaultMiddleware({serializableCheck: false}),
});

export default store;
