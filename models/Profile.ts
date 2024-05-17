import {SignInMethod} from '../services/authenticationServices';

export interface Profile {
  shouldOnboard: boolean;
  isRehydrated: boolean;
  userName?: string;
  signInMethod?: SignInMethod;
}

export default Profile;
