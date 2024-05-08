import React from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
  View,
} from 'react-native';

const imageMap = {
  page1: require('../../resources/onboarding-page1-graphic.png'),
  page2: require('../../resources/onboarding-page2-graphic.jpg'),
  page3: require('../../resources/onboarding-page3-graphic.jpg'),
};

const Page = ({idx, pageTitle, subTitle = '', lastPageHandler = () => {}}) => {
  const isLastPage = idx === 3;

  const renderFinishedButton = () => {
    if (isLastPage && lastPageHandler) {
      return (
        <TouchableOpacity onPress={lastPageHandler} style={styles.button}>
          <Text>Continue to App</Text>
        </TouchableOpacity>
      );
    }
    return null;
  };

  const imageName = 'page' + idx.toString();
  const imageSource = imageMap[imageName];

  const dynamicColor = () => {
    switch (idx) {
      case 1:
        return '#C5C5C5';
      case 2:
        return '#B75D39';
      case 3:
        return '#28AEC7';
    }
    return 'red';
  };

  return (
    <ImageBackground
      source={imageSource}
      style={[styles.imageBackground, {backgroundColor: dynamicColor()}]}
      imageStyle={styles.image}>
      <SafeAreaView style={styles.container}>
        <View style={styles.titleContent}>
          <Text style={styles.text}>{pageTitle}</Text>
        </View>
        <View style={styles.subTitleContent}>
          <Text style={styles.subText}>{subTitle}</Text>
          {renderFinishedButton()}
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageBackground: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  image: {
    resizeMode: 'contain',
  },
  titleContent: {
    flex: 1,
    paddingTop: '20%',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  subTitleContent: {
    flex: 1,
    paddingTop: '20%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    color: 'white',
    marginBottom: 20,
  },
  subText: {
    fontSize: 24,
    color: 'white',
    marginBottom: 20,
  },
  button: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    padding: 10,
    borderRadius: 5,
  },
});

export default Page;
