import React from 'react';
import {StyleSheet} from 'react-native';
import PagerView from 'react-native-pager-view';
import Page from './Page';

const Onboarding = ({onFinishOnboarding}) => {
  return (
    <PagerView style={styles.pagerView} initialPage={0} useNext={false}>
      <Page
        idx={1}
        pageTitle={'Welcome to PetFinder'}
        subTitle="Swipe to Continue..."
      />
      <Page
        idx={2}
        pageTitle={'Where all the Pets are Found!'}
        subTitle="Adopt, don't Shop!"
      />
      <Page
        idx={3}
        pageTitle={'Ready to Find your Pet?'}
        lastPageHandler={onFinishOnboarding}
      />
    </PagerView>
  );
};

const styles = StyleSheet.create({
  pagerView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  childView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Onboarding;
