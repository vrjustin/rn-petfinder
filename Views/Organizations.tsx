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
import {OrganizationsProps} from '../types/NavigationTypes';
import {
  setOrganizations,
  selectOrganizations,
} from '../reducers/organizationsReducer';
import {
  selectSearchParameters,
  setSearchParameters,
} from '../reducers/searchParamsReducer';
import apiService from '../services/apiService';
import Organization from '../models/Organization';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

const Organizations: React.FC<OrganizationsProps> = ({
  initialLoadingProp = false,
}) => {
  const dispatch = useDispatch();
  const orgs = useSelector(selectOrganizations);
  const globalStyles = GlobalStyles();
  const searchParameters = useSelector(selectSearchParameters);
  const {location, distance, orgsPagination} = searchParameters;
  const {currentPage, totalPages} = orgsPagination;
  const [isLoading, setIsLoading] = useState(initialLoadingProp);

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
        dispatch(
          setSearchParameters({
            ...searchParameters,
            orgsPagination: {
              currentPage: pagination.current_page,
              totalPages: pagination.total_pages,
            },
          }),
        );
      } catch (error) {
        console.error('Failed to fetch organizations: ', error);
      } finally {
        setIsLoading(initialLoadingProp ? true : false);
      }
    };
    fetchOrganizations();
  }, [dispatch, distance, location, currentPage]);

  const renderOrg = ({item}: {item: Organization}) => (
    <TouchableOpacity
      testID={`Organizations-Org-${item.id}`}
      style={styles.orgContainer}
      onPress={() => Linking.openURL(item.url)}>
      <View style={styles.iconContainer}>
        <FontAwesomeIcon
          name={'building'}
          size={20}
          color={'white'}
          style={styles.icon}
        />
      </View>
      <View style={styles.textContainer}>
        <View>
          <Text style={styles.orgName}>{item.name}</Text>
          <Text
            style={
              styles.orgLocation
            }>{`${item.address.city}, ${item.address.state}`}</Text>
        </View>
        <Text style={styles.orgHours}>{renderHours(item.hours)}</Text>
      </View>
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
    const previous = Math.max(currentPage - 1, 1);
    dispatch(
      setSearchParameters({
        ...searchParameters,
        orgsPagination: {
          currentPage: previous,
          totalPages: totalPages,
        },
      }),
    );
  };

  const nextPage = () => {
    if (isLoading) {
      return;
    }
    const next = Math.min(currentPage + 1, totalPages);
    dispatch(
      setSearchParameters({
        ...searchParameters,
        orgsPagination: {
          currentPage: next,
          totalPages: totalPages,
        },
      }),
    );
  };

  const paginationHeader = () => {
    return (
      <View style={styles.paginationHeaderContainer}>
        <TouchableOpacity
          testID="Organizations-PrevPage-Button"
          onPress={prevPage}>
          <FontAwesomeIcon
            name="caret-left"
            size={30}
            style={styles.paginationIcon}
          />
        </TouchableOpacity>
        <Text style={styles.paginationText}>
          {currentPage} / {totalPages}
        </Text>
        <TouchableOpacity
          testID="Organizations-NextPage-Button"
          onPress={nextPage}>
          <FontAwesomeIcon
            name="caret-right"
            size={30}
            style={styles.paginationIcon}
          />
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
  paginationHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 32,
  },
  paginationText: {
    marginHorizontal: 16,
  },
  orgContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'gray',
    borderRadius: 5,
    marginBottom: 10,
    marginHorizontal: 16,
  },
  iconContainer: {
    marginRight: 10,
  },
  icon: {
    fontSize: 20,
    color: 'white',
  },
  paginationIcon: {
    marginRight: 8,
  },
  textContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orgName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  orgLocation: {
    color: 'white',
    fontSize: 14,
  },
  orgHours: {
    color: 'white',
    fontSize: 12,
    marginLeft: 'auto', // Push to the far right
  },
});

export default Organizations;
