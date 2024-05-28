import React from 'react';
import renderer from 'react-test-renderer';
import {fireEvent, render, waitFor} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import * as reactRedux from 'react-redux';
import store from '../stores/store';
import * as searchParamsReducer from '../reducers/searchParamsReducer';
import * as profileReducer from '../reducers/profileReducer';
import Options from '../Views/Options';
import {Routes} from '../navigation/Routes';
import {
  googleSignedInProfile,
  oktaSignedInProfile,
  appleSignedInProfile,
  guestSignedInProfile,
  signedOutProfile,
  mockSearchParams,
  mockSearchParamsWithBreeds,
  mockSearchParamsSingleBreed,
} from '../__mocks__/mocks';

const mockNavigate = jest.fn();
const mockSetOptions = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
    setOptions: mockSetOptions,
  }),
}));

jest.mock('../services/authenticationServices.ts', () => ({
  signOutGoogle: jest.fn().mockResolvedValue(undefined),
  signOutOkta: jest.fn().mockResolvedValue(undefined),
  signOutGuest: jest.fn().mockResolvedValue(undefined),
}));

const mockRouteParams: any = {
  key: 'mockKey',
  name: 'Options',
  params: {
    from: 'hello',
  },
};

let renderedOptionsTree: any;

describe('Options', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    renderedOptionsTree = renderer.create(
      <Provider store={store}>
        <Options route={mockRouteParams} />
      </Provider>,
    );
    expect(renderedOptionsTree.toJSON()).toMatchSnapshot();
  });

  it('renders correctly when preferredTags and breeds are present', () => {
    jest
      .spyOn(searchParamsReducer, 'selectSearchParameters')
      .mockReturnValue(mockSearchParams);
    renderedOptionsTree = renderer.create(
      <Provider store={store}>
        <Options route={mockRouteParams} />
      </Provider>,
    );
    expect(renderedOptionsTree.toJSON()).toMatchSnapshot();
  });

  it('updates displayZip state correctly on zip code change & does not dispatch if zip is less than 5 chars.', () => {
    const mockDispatch = jest.fn();
    jest.spyOn(reactRedux, 'useDispatch').mockReturnValue(mockDispatch);

    renderedOptionsTree = renderer.create(
      <Provider store={store}>
        <Options route={mockRouteParams} />
      </Provider>,
    );
    const textInput = renderedOptionsTree.root.findByProps({
      testID: 'zipCodeInput',
    });
    textInput.props.onChangeText('12345');

    const postChangeText = textInput.props.value;
    expect(postChangeText).toEqual('12345');

    textInput.props.onChangeText('1234');
    textInput.props.onBlur();

    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('updates location zipCode state correctly on zip code blur', () => {
    const mockDispatch = jest.fn();
    jest.spyOn(reactRedux, 'useDispatch').mockReturnValue(mockDispatch);

    renderedOptionsTree = renderer.create(
      <Provider store={store}>
        <Options route={mockRouteParams} />
      </Provider>,
    );
    const textInput = renderedOptionsTree.root.findByProps({
      testID: 'zipCodeInput',
    });
    textInput.props.onChangeText('54321');
    textInput.props.onBlur();

    const dispatchedAction = mockDispatch.mock.calls[0][0];

    expect(dispatchedAction.type).toBe('searchParameters/setSearchParameters');
    expect(dispatchedAction.payload.location.zipCode).toEqual('54321');
  });

  it('updates distance state correctly on distance blur', () => {
    const mockDispatch = jest.fn();
    jest.spyOn(reactRedux, 'useDispatch').mockReturnValue(mockDispatch);

    renderedOptionsTree = renderer.create(
      <Provider store={store}>
        <Options route={mockRouteParams} />
      </Provider>,
    );
    const textInput = renderedOptionsTree.root.findByProps({
      testID: 'distanceInput',
    });
    textInput.props.onChangeText('55');
    textInput.props.onBlur();

    const dispatchedAction = mockDispatch.mock.calls[0][0];

    expect(dispatchedAction.type).toBe('searchParameters/setSearchParameters');
    expect(dispatchedAction.payload.distance).toEqual(55);
  });

  it('updates displayDistance state correctly on zip code change', () => {
    renderedOptionsTree = renderer.create(
      <Provider store={store}>
        <Options route={mockRouteParams} />
      </Provider>,
    );
    const textInput = renderedOptionsTree.root.findByProps({
      testID: 'distanceInput',
    });
    textInput.props.onChangeText('2');

    const postChangeText = textInput.props.value;
    expect(postChangeText).toEqual('2');
  });

  it('handles the preferred breeds tag press properly and removes that tag', async () => {
    jest
      .spyOn(searchParamsReducer, 'selectSearchParameters')
      .mockReturnValue(mockSearchParamsWithBreeds);

    const mockDispatch = jest.fn();
    jest.spyOn(reactRedux, 'useDispatch').mockReturnValue(mockDispatch);

    renderedOptionsTree = renderer.create(
      <Provider store={store}>
        <Options route={mockRouteParams} />
      </Provider>,
    );

    const preferredBreedButtons = renderedOptionsTree.root.findAllByProps({
      testID: 'breedsTagButton',
    });
    const preferredBreedButton = preferredBreedButtons[0];
    preferredBreedButton.props.onPress();

    const dispatchedAction = mockDispatch.mock.calls[0][0];

    expect(dispatchedAction.type).toBe('searchParameters/setSearchParameters');
    expect(dispatchedAction.payload.breedsPreferred.length).toEqual(1);
  });

  it('handles the preferred breeds tag press properly and does not dispatch if last breed in breedsPreferred', async () => {
    jest
      .spyOn(searchParamsReducer, 'selectSearchParameters')
      .mockReturnValue(mockSearchParamsSingleBreed);

    const mockDispatch = jest.fn();
    jest.spyOn(reactRedux, 'useDispatch').mockReturnValue(mockDispatch);

    renderedOptionsTree = renderer.create(
      <Provider store={store}>
        <Options route={mockRouteParams} />
      </Provider>,
    );

    const preferredBreedButtons = renderedOptionsTree.root.findAllByProps({
      testID: 'breedsTagButton',
    });
    const preferredBreedButton = preferredBreedButtons[0];
    preferredBreedButton.props.onPress();

    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('handles the tags tag press properly and removes that tag', () => {
    jest
      .spyOn(searchParamsReducer, 'selectSearchParameters')
      .mockReturnValue(mockSearchParams);

    const mockDispatch = jest.fn();
    jest.spyOn(reactRedux, 'useDispatch').mockReturnValue(mockDispatch);

    renderedOptionsTree = renderer.create(
      <Provider store={store}>
        <Options route={mockRouteParams} />
      </Provider>,
    );

    const tagButtons = renderedOptionsTree.root.findAllByProps({
      testID: 'tagsTagButton',
    });
    const firstTag = tagButtons[0];
    firstTag.props.onPress();

    const dispatchedAction = mockDispatch.mock.calls[0][0];

    expect(dispatchedAction.type).toBe('searchParameters/setSearchParameters');
    expect(dispatchedAction.payload.tagsPreferred).toEqual([
      'Happy',
      'Go Lucky',
    ]);
  });

  it('handles the Google signout properly', async () => {
    jest
      .spyOn(profileReducer, 'profile')
      .mockReturnValue(googleSignedInProfile);
    const mockDispatch = jest.fn();
    jest.spyOn(reactRedux, 'useDispatch').mockReturnValue(mockDispatch);

    const {getByTestId} = render(
      <Provider store={store}>
        <Options route={mockRouteParams} />
      </Provider>,
    );

    const signOutButton = getByTestId(`Options-SignOut-Button`);
    fireEvent.press(signOutButton);

    await waitFor(() => {});

    const dispatchedAction = mockDispatch.mock.calls[0][0];
    expect(dispatchedAction.type).toBe('profile/setProfile');
    expect(dispatchedAction.payload).toEqual(signedOutProfile);
    expect(mockNavigate).toHaveBeenCalledWith(Routes.SignInUp);
  });

  it('handles the okta signout properly', async () => {
    jest.spyOn(profileReducer, 'profile').mockReturnValue(oktaSignedInProfile);
    const mockDispatch = jest.fn();
    jest.spyOn(reactRedux, 'useDispatch').mockReturnValue(mockDispatch);

    const {getByTestId} = render(
      <Provider store={store}>
        <Options route={mockRouteParams} />
      </Provider>,
    );

    const signOutButton = getByTestId(`Options-SignOut-Button`);
    fireEvent.press(signOutButton);

    await waitFor(() => {});

    const dispatchedAction = mockDispatch.mock.calls[0][0];
    expect(dispatchedAction.type).toBe('profile/setProfile');
    expect(dispatchedAction.payload).toEqual(signedOutProfile);
    expect(mockNavigate).toHaveBeenCalledWith(Routes.SignInUp);
  });

  it('handles the apple signout properly', async () => {
    jest.spyOn(profileReducer, 'profile').mockReturnValue(appleSignedInProfile);
    const mockDispatch = jest.fn();
    jest.spyOn(reactRedux, 'useDispatch').mockReturnValue(mockDispatch);
    console.error = jest.fn();

    const {getByTestId} = render(
      <Provider store={store}>
        <Options route={mockRouteParams} />
      </Provider>,
    );

    const signOutButton = getByTestId(`Options-SignOut-Button`);
    fireEvent.press(signOutButton);

    await waitFor(() => {});

    expect(mockDispatch).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith(
      'SignOutViaApple Not Implemented Yet',
    );
  });

  it('handles the guest signout properly', async () => {
    jest.spyOn(profileReducer, 'profile').mockReturnValue(guestSignedInProfile);
    const mockDispatch = jest.fn();
    jest.spyOn(reactRedux, 'useDispatch').mockReturnValue(mockDispatch);

    const {getByTestId} = render(
      <Provider store={store}>
        <Options route={mockRouteParams} />
      </Provider>,
    );

    const signOutButton = getByTestId(`Options-SignOut-Button`);
    fireEvent.press(signOutButton);

    await waitFor(() => {});

    const dispatchedAction = mockDispatch.mock.calls[0][0];
    expect(dispatchedAction.type).toBe('profile/setProfile');
    expect(dispatchedAction.payload).toEqual(signedOutProfile);
    expect(mockNavigate).toHaveBeenCalledWith(Routes.SignInUp);
  });
});
