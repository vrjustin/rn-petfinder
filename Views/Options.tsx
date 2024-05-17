import React, {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import {signOut} from '@okta/okta-react-native';
import {
  selectSearchParameters,
  setSearchParameters,
} from '../reducers/searchParamsReducer';
import {useTypedNavigation, OptionsProps} from '../types/NavigationTypes';
import Breed from '../models/Breed';
import en from '../strings/en.json';
import {Routes} from '../navigation/Routes';
import {profile, setProfile} from '../reducers/profileReducer';

const Options: React.FC<OptionsProps> = ({route}) => {
  const dispatch = useDispatch();
  const navigation = useTypedNavigation();
  const {from} = route.params;
  const searchParameters = useSelector(selectSearchParameters);
  const userProfile = useSelector(profile);
  const {distance, location, tagsPreferred, breedsPreferred} = searchParameters;
  const [displayZip, setDisplayZip] = useState(location.zipCode);
  const [displayDistance, setDisplayDistance] = useState(distance.toString());

  const isGuest = () => {
    const {userName} = userProfile;
    return userName === '' || userName === undefined || userName === null
      ? true
      : false;
  };

  console.log('Options :: Guest Mode? : ', isGuest());

  const handleZipCodeChange = (newZip: string) => {
    setDisplayZip(newZip);
  };

  const handleZipOnBlur = () => {
    if (displayZip.length < 5) {
      return;
    }
    dispatch(
      setSearchParameters({
        ...searchParameters,
        location: {zipCode: displayZip},
      }),
    );
  };

  const handleDistanceChange = (newDistance: string) => {
    setDisplayDistance(newDistance);
  };

  const handleDistanceOnBlur = () => {
    let distanceValue =
      displayDistance.trim() !== '' ? parseInt(displayDistance, 10) : 1;
    distanceValue = Math.max(1, Math.min(500, distanceValue));
    dispatch(
      setSearchParameters({
        ...searchParameters,
        distance: distanceValue,
      }),
    );
  };

  const handleTagPress = (tag: string) => {
    dispatch(
      setSearchParameters({
        ...searchParameters,
        tagsPreferred: tagsPreferred.filter(t => t !== tag),
      }),
    );
  };

  const handleBreedPress = (breed: Breed) => {
    if (breedsPreferred.length <= 1 && from !== 'petTypes') {
      return;
    }
    const index = breedsPreferred.findIndex(b => b.name === breed.name);
    if (index !== -1) {
      const updatedBreeds = [...breedsPreferred];
      updatedBreeds.splice(index, 1);
      dispatch(
        setSearchParameters({
          ...searchParameters,
          breedsPreferred: updatedBreeds,
        }),
      );
    }
  };

  const handleSignOut = () => {
    if (!isGuest()) {
      signOut()
        .then(() => {
          dispatch(
            setProfile({
              ...userProfile,
              shouldOnboard: userProfile.shouldOnboard,
              isRehydrated: false,
              userName: '',
            }),
          );
          navigation.navigate(Routes.SignInUp);
        })
        .catch(error => {
          console.error(error);
        });
    } else {
      navigation.navigate(Routes.SignInUp);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <Text style={styles.label}>{en.EnterZip}</Text>
          <TextInput
            testID="zipCodeInput"
            style={styles.input}
            value={displayZip}
            onChangeText={handleZipCodeChange}
            onBlur={handleZipOnBlur}
            keyboardType="numeric"
          />
          <Text style={styles.label}>{en.SearchDistance}</Text>
          <TextInput
            testID="distanceInput"
            style={styles.input}
            value={displayDistance}
            onChangeText={handleDistanceChange}
            onBlur={handleDistanceOnBlur}
            keyboardType="numeric"
          />
          {breedsPreferred.length > 0 && (
            <>
              <Text style={styles.label}>{en.PreferredBreeds}</Text>
              <View style={styles.collection}>
                {breedsPreferred.map((breed, index) => (
                  <TouchableOpacity
                    testID="breedsTagButton"
                    key={index}
                    onPress={() => handleBreedPress(breed)}>
                    <View
                      key={index}
                      style={
                        !breedsPreferred.includes(breed)
                          ? styles.tag
                          : styles.activeTag
                      }>
                      <Text style={styles.collectionItemText}>
                        {breed.name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}
          {tagsPreferred.length > 0 && (
            <>
              <Text style={styles.label}>{en.PreferredTags}</Text>
              <View style={styles.collection}>
                {tagsPreferred.map((tag, index) => (
                  <TouchableOpacity
                    testID="tagsTagButton"
                    key={index}
                    onPress={() => handleTagPress(tag)}>
                    <View
                      key={index}
                      style={
                        !tagsPreferred.includes(tag)
                          ? styles.tag
                          : styles.activeTag
                      }>
                      <Text style={styles.collectionItemText}>{tag}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}
        </ScrollView>
        {!isGuest() && (
          <View style={styles.accountName}>
            <Text>Account: {userProfile.userName}</Text>
          </View>
        )}
        <TouchableOpacity style={styles.button} onPress={handleSignOut}>
          <Text style={styles.buttonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
  },
  scrollViewContent: {
    paddingBottom: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 8,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  collection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
  },
  collectionItemText: {
    color: 'white',
  },
  tag: {
    backgroundColor: 'gray',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  activeTag: {
    backgroundColor: 'red',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  accountName: {
    paddingVertical: 8,
  },
});

export default Options;
