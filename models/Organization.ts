export interface Organization {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: {
    address1: string;
    address2: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  };
  hours: {
    monday: string | null;
    tuesday: string | null;
    wednesday: string | null;
    thursday: string | null;
    friday: string | null;
    saturday: string | null;
    sunday: string | null;
  };
  url: string;
  website: string | null;
  mission_statement: string | null;
  adoption: {
    policy: string | null;
    url: string | null;
  };
  social_media: {
    facebook: string | null;
    twitter: string | null;
    youtube: string | null;
    instagram: string | null;
    pinterest: string | null;
  };
  photos: [
    {
      small: string;
      medium: string;
      large: string;
      full: string;
    },
  ];
  distance: number;
  _links: {
    self: {
      href: string;
    };
    animals: {
      href: string;
    };
  };
}

export default Organization;
