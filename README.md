# RN-Petfinder

1: First obtain an api CLIENT_ID & CLIENT_SECRET from the Petfinder Api service by signing up as a developer: https://www.petfinder.com/developers/

2: The App currently uses Okta for authentication. You must sign up as a developer: https://developer.okta.com and obtain the following details:

* Client ID
* Redirect URI
* End Session Redirect URI
* Discovery URI

3: create an .env file in the root of the project and store the values from petfinder there.

Example .env

```
CLIENT_ID={REPLACE-WITH-YOUR-CLIENT-ID-FROM-PETFINDER-API}
CLIENT_SECRET={REPLACE-WITH-YOUR-CLIENT-SECRET-FROM-PETFINDER-API}
OKTA_CLIENT_ID={REPLACE-WITH-YOUR-CLIENT-ID-FROM-OKTA}
OKTA_REDIRECT_URI={REPLACE-WITH-YOUR-REDIRECT-URI-FROM-OKTA}
OKTA_END_SESSION_REDIRECT_URI={REPLACE-WITH-YOUR-OKTA-END-SESSION-REDIRECT-URI}
OKTA_DISCOVERY_URI={REPLACE-WITH-YOUR-OKTA-DISCOVERY-URI}
```

4: npm install

5: cd ios && pod install

6: npm run start
