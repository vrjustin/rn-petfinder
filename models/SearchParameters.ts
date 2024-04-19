interface SearchParameters {
  location: {zipCode: string};
  distance: number;
  tagsPreffered: string[];
}

export default SearchParameters;
