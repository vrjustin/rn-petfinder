import React from 'react';
import {Linking} from 'react-native';
import {Provider} from 'react-redux';
import store from '../stores/store';
import renderer, {act} from 'react-test-renderer';
import {fireEvent, render} from '@testing-library/react-native';
import Contact from '../Views/Contact';
import {
  selectedAnimalMock,
  selectedAnimalMockNoContact,
} from '../__mocks__/mocks';

jest.mock('react-native/Libraries/Linking/Linking', () => ({
  openURL: jest.fn(),
}));

let renderedContactTree: any;

describe('Contact', () => {
  it('renders correctly', async () => {
    await act(async () => {
      renderedContactTree = renderer.create(
        <Provider store={store}>
          <Contact
            route={{
              params: {
                selectedAnimal: selectedAnimalMock,
              },
            }}
          />
        </Provider>,
      );
    });
    expect(renderedContactTree.toJSON()).toMatchSnapshot();
  });

  it('renders null when no contact available', async () => {
    await act(async () => {
      renderedContactTree = renderer.create(
        <Provider store={store}>
          <Contact
            route={{
              params: {
                selectedAnimal: selectedAnimalMockNoContact,
              },
            }}
          />
        </Provider>,
      );
    });
    expect(renderedContactTree.toJSON()).toMatchSnapshot();
  });

  it('calls Linking.openURL with the proper maps address for get directions button', async () => {
    const {getByTestId} = render(
      <Provider store={store}>
        <Contact
          route={{
            params: {
              selectedAnimal: selectedAnimalMock,
            },
          }}
        />
      </Provider>,
    );
    const getDirectionButton = getByTestId('Contact-GetDirectionsButton');
    fireEvent.press(getDirectionButton);
    const expectedURL = `maps://?q=${encodeURIComponent(
      '123 Main St, Anytown, NY 12345',
    )}`;
    await Promise.resolve();
    expect(Linking.openURL).toHaveBeenCalledWith(expectedURL);
  });

  it('calls Linking.openURL with the proper phone number when call button pressed', async () => {
    const {getByTestId} = render(
      <Provider store={store}>
        <Contact
          route={{
            params: {
              selectedAnimal: selectedAnimalMock,
            },
          }}
        />
      </Provider>,
    );
    const callButton = getByTestId('Contact-CallPhoneButton');
    fireEvent.press(callButton);
    const expectedURL = `tel:${selectedAnimalMock.contact?.phone}`;
    await Promise.resolve();
    expect(Linking.openURL).toHaveBeenCalledWith(expectedURL);
  });

  it('calls Linking.openURL with the proper pre-populated email subject and body for email button', async () => {
    const {getByTestId} = render(
      <Provider store={store}>
        <Contact
          route={{
            params: {
              selectedAnimal: selectedAnimalMock,
            },
          }}
        />
      </Provider>,
    );
    const emailButton = getByTestId('Contact-EmailButton');
    fireEvent.press(emailButton);
    const expectedSubject = encodeURIComponent(
      'Regarding your animal adoption listing',
    );
    const body = `Hello,\n\nI am interested in adopting the following animal:\n\nName: ${selectedAnimalMock.name}\nID: ${selectedAnimalMock.id}\nURL: ${selectedAnimalMock.url}\n\nCould you please provide me with more information?`;
    const expectedBody = encodeURIComponent(body);
    const expectedURL = `mailto:${selectedAnimalMock.contact?.email}?subject=${expectedSubject}&body=${expectedBody}`;
    await Promise.resolve();
    expect(Linking.openURL).toHaveBeenCalledWith(expectedURL);
  });

  it('handles error when Linking.openURL fails', async () => {
    const errorMessage = 'Failed to open URL';
    (Linking.openURL as jest.Mock).mockImplementation(() => {
      throw new Error(errorMessage);
    });
    console.error = jest.fn();

    const {getByTestId} = render(
      <Provider store={store}>
        <Contact
          route={{
            params: {
              selectedAnimal: selectedAnimalMock,
            },
          }}
        />
      </Provider>,
    );

    const emailButton = getByTestId('Contact-EmailButton');
    fireEvent.press(emailButton);

    await Promise.resolve();

    expect(Linking.openURL).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith(
      'Failed to open email:',
      expect.any(Error),
    );
  });
});
