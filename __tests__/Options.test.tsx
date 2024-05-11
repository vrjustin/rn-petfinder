import React from 'react';
import renderer from 'react-test-renderer';
import {Provider} from 'react-redux';
import * as reactRedux from 'react-redux';
import store from '../stores/store';
import SearchParameters from '../models/SearchParameters';
import * as searchParamsReducer from '../reducers/searchParamsReducer';
import Breed from '../models/Breed';
import Options from '../Views/Options';

const mockBreed: Breed = {
  name: 'MockBreed',
  _links: {
    type: {
      href: 'href',
    },
  },
};
const mockSearchParameters: SearchParameters = {
  location: {
    zipCode: '90210',
  },
  distance: 5,
  tagsPreferred: ['Tag1', 'Tag2', 'Tag3'],
  breedsPreferred: [mockBreed],
};

let renderedOptionsTree: any;

describe('Options', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    renderedOptionsTree = renderer.create(
      <Provider store={store}>
        <Options route={{params: {from: 'hello'}}} />
      </Provider>,
    );
    expect(renderedOptionsTree.toJSON()).toMatchSnapshot();
  });

  it('renders correctly when preferredTags and breeds are present', () => {
    jest
      .spyOn(searchParamsReducer, 'selectSearchParameters')
      .mockReturnValue(mockSearchParameters);
    renderedOptionsTree = renderer.create(
      <Provider store={store}>
        <Options route={{params: {from: 'hello'}}} />
      </Provider>,
    );
    expect(renderedOptionsTree.toJSON()).toMatchSnapshot();
  });

  it('updates displayZip state correctly on zip code change', () => {
    renderedOptionsTree = renderer.create(
      <Provider store={store}>
        <Options route={{params: {from: 'hello'}}} />
      </Provider>,
    );
    const textInput = renderedOptionsTree.root.findByProps({
      testID: 'zipCodeInput',
    });
    textInput.props.onChangeText('12345');

    const postChangeText = textInput.props.value;
    expect(postChangeText).toEqual('12345');
  });

  it('updates location zipCode state correctly on zip code blur', () => {
    const mockDispatch = jest.fn();
    jest.spyOn(reactRedux, 'useDispatch').mockReturnValue(mockDispatch);

    renderedOptionsTree = renderer.create(
      <Provider store={store}>
        <Options route={{params: {from: 'hello'}}} />
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
        <Options route={{params: {from: 'hello'}}} />
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
        <Options route={{params: {from: 'hello'}}} />
      </Provider>,
    );
    const textInput = renderedOptionsTree.root.findByProps({
      testID: 'distanceInput',
    });
    textInput.props.onChangeText('2');

    const postChangeText = textInput.props.value;
    expect(postChangeText).toEqual('2');
  });

  it('handles the preferred breeds tag press properly and removes that tag', () => {
    jest
      .spyOn(searchParamsReducer, 'selectSearchParameters')
      .mockReturnValue(mockSearchParameters);

    const mockDispatch = jest.fn();
    jest.spyOn(reactRedux, 'useDispatch').mockReturnValue(mockDispatch);

    renderedOptionsTree = renderer.create(
      <Provider store={store}>
        <Options route={{params: {from: 'petTypes'}}} />
      </Provider>,
    );

    const preferredBreedButton = renderedOptionsTree.root.findByProps({
      testID: 'breedsTagButton',
    });
    preferredBreedButton.props.onPress();

    // Get the latest dispatched action
    const dispatchedAction = mockDispatch.mock.calls[0][0];

    expect(dispatchedAction.type).toBe('searchParameters/setSearchParameters');
    expect(dispatchedAction.payload.breedsPreferred).toEqual([]);
  });

  it('handles the tags tag press properly and removes that tag', () => {
    jest
      .spyOn(searchParamsReducer, 'selectSearchParameters')
      .mockReturnValue(mockSearchParameters);

    const mockDispatch = jest.fn();
    jest.spyOn(reactRedux, 'useDispatch').mockReturnValue(mockDispatch);

    renderedOptionsTree = renderer.create(
      <Provider store={store}>
        <Options route={{params: {from: 'petTypes'}}} />
      </Provider>,
    );

    const tagButtons = renderedOptionsTree.root.findAllByProps({
      testID: 'tagsTagButton',
    });
    const firstTag = tagButtons[0];
    firstTag.props.onPress();

    // Get the latest dispatched action
    const dispatchedAction = mockDispatch.mock.calls[0][0];

    expect(dispatchedAction.type).toBe('searchParameters/setSearchParameters');
    expect(dispatchedAction.payload.tagsPreferred).toEqual(['Tag2', 'Tag3']);
  });
});
