import {petTypesLocaleResolver} from '../strings/en.json';

const dogImage = require('../resources/black-1869685_1280.jpg');
const catImage = require('../resources/cat.jpg');
const rabbitImage = require('../resources/rabbit.jpg');
const smallFurryImage = require('../resources/chinchilla.jpg');
const horseImage = require('../resources/horse.jpg');
const birdImage = require('../resources/bird.jpg');
const lizardImage = require('../resources/lizard.jpg');
const llamaImage = require('../resources/lama.jpg');

export interface PetType {
  displayName: string;
  name: string;
  coats: string[];
  colors: string[];
  genders: string[];
  _links: {
    self: {href: string};
    breeds: {href: string};
  };
}

export const petTypeImages: Record<string, string> = {
  Dog: dogImage,
  Cat: catImage,
  Rabbit: rabbitImage,
  'Small & Furry': smallFurryImage,
  Horse: horseImage,
  Bird: birdImage,
  'Scales, Fins & Other': lizardImage,
  Barnyard: llamaImage,
};

export const mapTypeNameToLocaleName = (name: string): string | undefined => {
  switch (name) {
    case 'Dog':
      return petTypesLocaleResolver.Dog;
    case 'Cat':
      return petTypesLocaleResolver.Cat;
    case 'Rabbit':
      return petTypesLocaleResolver.Rabbit;
    case 'Small & Furry':
      return petTypesLocaleResolver.SmallFurry;
    case 'Horse':
      return petTypesLocaleResolver.Horse;
    case 'Bird':
      return petTypesLocaleResolver.Bird;
    case 'Scales, Fins & Other':
      return petTypesLocaleResolver.ScalesFinsOther;
    case 'Barnyard':
      return petTypesLocaleResolver.Barnyard;
  }
};
