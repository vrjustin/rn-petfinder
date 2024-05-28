import Breed from './Breed';

interface SearchParameters {
  location: {zipCode: string};
  distance: number;
  tagsPreferred: string[];
  breedsPreferred: Breed[];
  orgsPagination: {
    currentPage: number;
    totalPages: number;
  };
  animalsPagination: {
    currentPage: number;
    totalPages: number;
  };
}

export default SearchParameters;
