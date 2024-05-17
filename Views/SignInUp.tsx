import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import {createConfig, signInWithBrowser} from '@okta/okta-react-native';
import base64 from 'base-64';
import SplashScreen from 'react-native-splash-screen';
import * as Keychain from 'react-native-keychain';
import {useTypedNavigation, SignInUpProps} from '../types/NavigationTypes';
import {Routes} from '../navigation/Routes';
import {profile, setProfile} from '../reducers/profileReducer';

const SignInUp: React.FC<SignInUpProps> = ({initialLoadingProp = true}) => {
  const navigation = useTypedNavigation();
  const dispatch = useDispatch();
  const userProfile = useSelector(profile);
  const [initialLoading, setInitialLoading] = useState(initialLoadingProp);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const clientId = process.env.OKTA_CLIENT_ID || '';
    const redirectUri = process.env.OKTA_REDIRECT_URI || '';
    const endSessionRedirectUri =
      process.env.OKTA_END_SESSION_REDIRECT_URI || '';
    const discoveryUri = process.env.OKTA_DISCOVERY_URI || '';
    const configureOkta = async () => {
      try {
        await createConfig({
          clientId: clientId,
          redirectUri: redirectUri,
          endSessionRedirectUri: endSessionRedirectUri,
          discoveryUri: discoveryUri,
          scopes: ['openid', 'profile', 'offline_access'],
          requireHardwareBackedKeyStore: true,
        });
      } catch (error) {
        console.error('Failed to configure Okta: ', error);
      }
    };
    configureOkta();

    const fetchToken = async () => {
      try {
        const credentials = await Keychain.getGenericPassword();
        if (credentials) {
          console.log('Token retrieved from secure storage');
          navigation.navigate(Routes.PetTypes);
        }
      } catch (error) {
        console.error('Failed to load token from secure storage', error);
      } finally {
        setTimeout(() => {
          setInitialLoading(false);
          SplashScreen.hide();
        }, 500);
      }
    };
    fetchToken();
  }, [navigation]);

  const decodeJWT = (token: string) => {
    const base64Url = token.split('.')[1];
    const decodedPayload = base64.decode(base64Url); // Use base64.decode to decode the base64Url
    return JSON.parse(decodedPayload);
  };

  const handleSignInPress = async () => {
    setLoading(true);
    try {
      const result = await signInWithBrowser();
      console.log(
        'handleSignInPress: result.accessToken: ',
        result.access_token,
      );
      const decodedToken = decodeJWT(result.access_token);
      const {sub} = decodedToken;
      console.log('decodedToken is: ', decodedToken);
      dispatch(
        setProfile({
          ...userProfile,
          isRehydrated: userProfile.isRehydrated,
          shouldOnboard: userProfile.shouldOnboard,
          userName: sub,
        }),
      );
      await Keychain.setGenericPassword('user', result.access_token);
      console.log('Token stored securely');
      navigation.navigate(Routes.PetTypes);
    } catch (error) {
      console.error('Sign in failed', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGuestPress = () => {
    navigation.navigate(Routes.PetTypes);
  };

  const renderLoadingIndicator = () => {
    return (
      <View style={styles.container}>
        <ActivityIndicator
          size={'large'}
          color={'#007AFF'}
          animating={loading}
        />
      </View>
    );
  };

  const renderSignInPage = () => {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>My PetFinder</Text>
        <Text style={styles.tagline}>Adopt, Don't Shop!</Text>
        <Image
          source={require('../resources/SignInLogo.png')}
          style={styles.logo}
        />
        <View style={styles.bottomContainer}>
          <Text style={styles.infoText}>
            Welcome! Please sign in to access your account. If you don't have an
            account, you can create one from the Sign In screen. Continue as
            Guest if you just want to poke around anyway.
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleSignInPress}>
              <Text style={styles.buttonText}>Sign In</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.guestButton}
              onPress={handleGuestPress}>
              <Text style={styles.guestButtonText}>Continue as Guest</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  if (!loading) {
    SplashScreen.hide();
  }

  return initialLoading || loading
    ? renderLoadingIndicator()
    : renderSignInPage();
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 20,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 10,
  },
  tagline: {
    fontSize: 16,
    color: '#007AFF',
    marginBottom: 30,
  },
  bottomContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
    alignSelf: 'flex-start',
    marginTop: 16,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 32,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginBottom: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  guestButton: {
    backgroundColor: '#ccc',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
  },
  guestButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default SignInUp;
