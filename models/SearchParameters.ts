import Breed from './Breed';

interface SearchParameters {
  location: {zipCode: string};
  distance: number;
  tagsPreferred: string[];
  breedsPreferred: Breed[];
}

export default SearchParameters;
