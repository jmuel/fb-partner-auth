# fb-partner-auth

This is a demo app for partner setup through OBO. It just uses business login and OBO to set up an SSAPI capable access token and displays it to the user.

If you want to run this locally you'll need to ad a .env file to the root directory that fills in the following fields.

```BUSINESS_ADMIN_ACCESS_TOKEN=
BUSINESS_ID=
APP_ID=
DEV=
APP_SECRET=```

Otherwise you should be able to yarn install, yarn start and go to https://localhost:3000
