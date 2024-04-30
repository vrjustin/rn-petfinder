import React, {useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from 'react-native';
import GlobalStyles from './Styles/GlobalStyles';
import {useSelector, useDispatch} from 'react-redux';
import {
  setOrganizations,
  selectOrganizations,
} from '../reducers/organizationsReducer';
import {selectSearchParameters} from '../reducers/searchParamsReducer';
import apiService from '../services/apiService';
import Organization from '../models/Organization';

const Organizations = () => {
  const dispatch = useDispatch();
  const orgs = useSelector(selectOrganizations);
  const globalStyles = GlobalStyles();
  const searchParameters = useSelector(selectSearchParameters);
  const {location, distance} = searchParameters;

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const orgsData = await apiService.getOrganizations(
          location.zipCode,
          distance,
        );
        dispatch(setOrganizations(orgsData.organizations));
      } catch (error) {
        console.error('Failed to fetch organizations: ', error);
      }
    };
    fetchOrganizations();
  }, [dispatch, distance, location]);

  const renderOrg = ({item}: {item: Organization}) => (
    <TouchableOpacity
      style={styles.orgContainer}
      onPress={() => Linking.openURL(item.url)}>
      <Text style={styles.orgName}>{item.name}</Text>
      <Text
        style={
          styles.orgLocation
        }>{`${item.address.city}, ${item.address.state}`}</Text>
      <Text style={styles.orgHours}>{renderHours(item.hours)}</Text>
    </TouchableOpacity>
  );

  const renderHours = (hours: Organization['hours']) => {
    const days = [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ];
    return days
      .map(day => {
        const hour = hours[day.toLowerCase()];
        return hour ? `${day}: ${hour}` : null;
      })
      .filter(Boolean)
      .join('\n');
  };

  return (
    <View style={globalStyles.container}>
      <FlatList
        data={orgs}
        renderItem={renderOrg}
        keyExtractor={org => org.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  orgContainer: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  orgName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  orgLocation: {
    fontSize: 16,
  },
  orgHours: {
    fontSize: 14,
    color: 'gray',
  },
});

export default Organizations;
