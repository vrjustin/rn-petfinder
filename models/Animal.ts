interface Animal {
  id: number;
  organization_id: string;
  url: string;
  age: string;
  gender: string;
  size: string;
  coat: string;
  name: string;
  description: string;
  status: string;
  breeds: {
    mixed: boolean;
    primary: string;
    secondary: string | null;
    unknown: boolean;
  };
  colors: {
    primary: string;
    secondary: string | null;
    tertiary: string | null;
  };
  contact: {
    address: {
      address1: string;
      address2: string | null;
      city: string;
      country: string;
      postcode: string;
      state: string;
    };
    email: string;
    phone: string;
  };
  photos: {
    full: string;
    large: string;
    medium: string;
    small: string;
  }[];
  primary_photo_cropped: {
    full: string;
    large: string;
    medium: string;
    small: string;
  };
  species: string;
  tags: string[];
}

export default Animal;
