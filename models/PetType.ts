interface PetType {
  name: string;
  coats: string[];
  colors: string[];
  genders: string[];
  _links: {
    self: {href: string};
    breeds: {href: string};
  };
}

export default PetType;
