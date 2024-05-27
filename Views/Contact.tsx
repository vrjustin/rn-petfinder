import React from 'react';
import {View, Text, StyleSheet, Linking, TouchableOpacity} from 'react-native';
import en from '../strings/en.json';

const Contact = ({route}) => {
  const {selectedAnimal} = route.params;
  const renderContactInfo = () => {
    const {contact} = selectedAnimal;
    if (!contact) {
      return null;
    }

    const {address, email, phone} = contact;

    // Check if address details are sufficient and not a PO Box
    const hasValidAddress =
      address &&
      address.address1 &&
      address.city &&
      address.state &&
      address.postcode &&
      !/^(P(\.|ost)?\s?O(\.|ffice)?\s?Box|POB?)\s*\d+/i.test(address.address1);

    return (
      <View style={styles.contactContainer}>
        {hasValidAddress && (
          <TouchableOpacity
            testID="Contact-GetDirectionsButton"
            style={styles.actionButton}
            onPress={() =>
              Linking.openURL(
                `maps://?q=${encodeURIComponent(
                  address.address1 +
                    ', ' +
                    address.city +
                    ', ' +
                    address.state +
                    ' ' +
                    address.postcode,
                )}`,
              )
            }>
            <Text style={styles.actionButtonText}>{en.GetDirections}</Text>
          </TouchableOpacity>
        )}
        {email && (
          <TouchableOpacity
            testID="Contact-EmailButton"
            style={styles.actionButton}
            onPress={() => {
              try {
                const subject = 'Regarding your animal adoption listing';
                const body = `Hello,\n\nI am interested in adopting the following animal:\n\nName: ${selectedAnimal.name}\nID: ${selectedAnimal.id}\nURL: ${selectedAnimal.url}\n\nCould you please provide me with more information?`;
                Linking.openURL(
                  `mailto:${email}?subject=${encodeURIComponent(
                    subject,
                  )}&body=${encodeURIComponent(body)}`,
                );
              } catch (error) {
                console.error('Failed to open email:', error);
              }
            }}>
            <Text style={styles.actionButtonText}>{en.Email}</Text>
          </TouchableOpacity>
        )}
        {phone && (
          <TouchableOpacity
            testID="Contact-CallPhoneButton"
            style={styles.actionButton}
            onPress={() => Linking.openURL(`tel:${phone}`)}>
            <Text style={styles.actionButtonText}>{en.Call}</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{en.ContactHeader}</Text>
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
  actionButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    marginTop: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Contact;
