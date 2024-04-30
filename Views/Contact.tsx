import React from 'react';
import {View, Text, StyleSheet, Linking} from 'react-native';

const Contact = ({route}) => {
  const {selectedAnimal} = route.params;
  const renderContactInfo = () => {
    const {contact} = selectedAnimal;
    if (!contact) return null;

    const {address, email, phone} = contact;

    return (
      <View style={styles.contactContainer}>
        {address && (
          <Text style={styles.contactText}>
            {[
              address.address1,
              address.address2,
              address.city,
              address.state,
              address.postcode,
            ]
              .filter(Boolean)
              .join(', ')}
          </Text>
        )}
        {email && (
          <Text
            style={styles.contactText}
            onPress={() => Linking.openURL(`mailto:${email}`)}>
            {email}
          </Text>
        )}
        {phone && (
          <Text
            style={styles.contactText}
            onPress={() => Linking.openURL(`tel:${phone}`)}>
            {phone}
          </Text>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Contact Information</Text>
      {renderContactInfo()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  contactContainer: {
    marginVertical: 8,
  },
  contactText: {
    fontSize: 16,
    marginBottom: 4,
    color: 'blue',
  },
});

export default Contact;
