import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  ScrollView,
} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import {useTypedNavigation, SignInUpProps} from '../types/NavigationTypes';
import {Routes} from '../navigation/Routes';
import {profile} from '../reducers/profileReducer';
import {
  configureOkta,
  fetchToken,
  handleSignIn,
  configureGoogleSignin,
  handleSignInViaGoogle,
  handleSignInViaGuest,
} from '../services/authenticationServices';

const SignInUp: React.FC<SignInUpProps> = ({initialLoadingProp = true}) => {
  const navigation = useTypedNavigation();
  const dispatch = useDispatch();
  const userProfile = useSelector(profile);
  const [initialLoading, setInitialLoading] = useState(initialLoadingProp);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchToken().then(credentials => {
      if (credentials) {
        navigation.navigate(Routes.PetTypes);
      }
      setTimeout(() => {
        setInitialLoading(false);
        SplashScreen.hide();
      }, 500);
    });
  }, [navigation]);

  useEffect(() => {
    configureOkta();
    configureGoogleSignin();
  }, []);

  const handleSignInOktaPress = async () => {
    setLoading(true);
    handleSignIn(dispatch, userProfile).then(success => {
      if (success) {
        navigation.navigate(Routes.PetTypes);
      }
      setLoading(false);
    });
  };

  const handleSignInGooglePress = async () => {
    setLoading(true);
    handleSignInViaGoogle(dispatch, userProfile).then(success => {
      if (success) {
        navigation.navigate(Routes.PetTypes);
      }
      setLoading(false);
    });
  };

  const handleGuestPress = () => {
    handleSignInViaGuest(dispatch, userProfile).then(success => {
      if (success) {
        navigation.navigate(Routes.PetTypes);
      }
    });
  };

  const renderLoadingIndicator = () => {
    return (
      <View testID="SignInUp-LoadingIndicator" style={styles.container}>
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
      <View testID="SignInUp-Container" style={styles.container}>
        <Text style={styles.title}>My PetFinder</Text>
        <Text style={styles.tagline}>Adopt, Don't Shop!</Text>
        <Image
          source={require('../resources/SignInLogo.png')}
          style={styles.logo}
        />
        <View style={styles.bottomContainer}>
          <ScrollView>
            <Text style={styles.infoText}>
              Welcome! Please sign in to access your account. If you don't have
              an account, you can create one from the Sign In screen. Continue
              as Guest if you just want to poke around anyway.
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                testID="SignInUp-Button-GoogleSignIn"
                style={styles.button}
                onPress={handleSignInGooglePress}>
                <View style={styles.iconTextContainer}>
                  <FontAwesomeIcon
                    name={'google'}
                    size={20}
                    color={'white'}
                    style={styles.iconWhite}
                  />
                  <Text style={styles.buttonText}>Sign In via Google</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                testID="SignInUp-Button-OktaSignIn"
                style={styles.button}
                onPress={handleSignInOktaPress}>
                <View style={styles.iconTextContainer}>
                  <FontAwesomeIcon
                    name={'safari'}
                    size={20}
                    color={'white'}
                    style={styles.iconWhite}
                  />
                  <Text style={styles.buttonText}>Sign In via Okta</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                testID="SignInUp-Button-Guest"
                style={styles.guestButton}
                onPress={handleGuestPress}>
                <View style={styles.iconTextContainer}>
                  <FontAwesomeIcon
                    name={'sign-in'}
                    size={20}
                    color={'black'}
                    style={styles.iconBlack}
                  />
                  <Text style={styles.guestButtonText}>Continue as Guest</Text>
                </View>
              </TouchableOpacity>
            </View>
          </ScrollView>
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
  iconWhite: {
    fontSize: 20,
    color: 'white',
    paddingRight: 8,
  },
  iconBlack: {
    fontSize: 20,
    color: 'black',
    paddingRight: 8,
  },
  iconTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
