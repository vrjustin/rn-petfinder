interface SearchParameters {
  location: {zipCode: string};
  distance: number;
  tagsPreferred: string[];
}

export default SearchParameters;
