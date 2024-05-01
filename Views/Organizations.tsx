import React, {useEffect, useState} from 'react';
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
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

const Organizations = () => {
  const dispatch = useDispatch();
  const orgs = useSelector(selectOrganizations);
  const globalStyles = GlobalStyles();
  const searchParameters = useSelector(selectSearchParameters);
  const {location, distance} = searchParameters;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        setIsLoading(true);
        const orgsResponse = await apiService.getOrganizations(
          location.zipCode,
          distance,
          currentPage,
        );
        const {organizations, pagination} = orgsResponse;
        dispatch(setOrganizations(organizations));
        setCurrentPage(pagination.current_page);
        setTotalPages(pagination.total_pages);
      } catch (error) {
        console.error('Failed to fetch organizations: ', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrganizations();
  }, [dispatch, distance, location, currentPage]);

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

  const prevPage = () => {
    if (isLoading) {
      return;
    }
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const nextPage = () => {
    if (isLoading) {
      return;
    }
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const paginationHeader = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          height: 32,
        }}>
        <TouchableOpacity onPress={prevPage}>
          <FontAwesomeIcon name="caret-left" size={30} style={styles.icon} />
        </TouchableOpacity>
        <Text style={{marginHorizontal: 16}}>
          {currentPage} / {totalPages}
        </Text>
        <TouchableOpacity onPress={nextPage}>
          <FontAwesomeIcon name="caret-right" size={30} style={styles.icon} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={globalStyles.container}>
      {totalPages > 1 ? paginationHeader() : <></>}
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
  icon: {
    marginRight: 8,
  },
});

export default Organizations;
