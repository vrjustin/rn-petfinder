import React, {useEffect} from 'react';
import {View, Text, FlatList} from 'react-native';
import GlobalStyles from './Styles/GlobalStyles';
import {useSelector, useDispatch} from 'react-redux';
import {
  setOrganizations,
  selectOrganizations,
} from '../reducers/organizationsReducer';
import apiService from '../services/apiService';
import Organization from '../models/Organization';

const Organizations = () => {
  const dispatch = useDispatch();
  const orgs = useSelector(selectOrganizations);
  const globalStyles = GlobalStyles();

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const orgsData = await apiService.getOrganizations();
        dispatch(setOrganizations(orgsData.organizations));
      } catch (error) {
        console.error('Failed to fetch organizations: ', error);
      }
    };
    fetchOrganizations();
  }, [dispatch]);

  const renderOrg = ({item}: {item: Organization}) => (
    <View>
      <Text>{item.name}</Text>
    </View>
  );

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

export default Organizations;
