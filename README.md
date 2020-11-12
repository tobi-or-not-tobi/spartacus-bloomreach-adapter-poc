# Spartacus Bloomreach adapter

POC codebase to evaluate / demonstrate Spartacus adapter patters in the context of Bloomreach CMS.

## Setup

Run `npm install` to install the dependencies.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Known issues

- The Bloomreach spa-sdk throws an error at startup which prevents the first run. You need to make a change in the code base to successfully open the page
- A warning is thrown regarding the Bloomreach spa-sdk lib is shipped with depenendencies that cannot be fully optimized.
- The Commerce API doesn't have a ssl certificate, so you need to accept the website to not being secure.
