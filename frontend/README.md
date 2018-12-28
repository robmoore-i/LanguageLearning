# Frontend

# Setting up and running a production build

1. Make sure you've configured a `apprc` in `/config` and it is loaded.

2. Serve the build/ directory as static content.

I have a script for running the production frontend, called `run-build.sh`.

# Lighthouse audits

The frontend can be audited by google's lighthouse tool.

To install lighthouse, do

`yarn global add lighthouse` (or `npm install -g lighthouse`)

To run the PWA audits for the app, make sure you're in the `frontend/` dir,
and use the `./lighthouse-audit.sh` script.

Generated reports are put in the `lighthouse-audits/` directory.

# Cypress

Long story short: This currently only works when run against the non-optimised
frontend (run this with `yarn start`).

Cypress is a newish end to end testing framework. It's really good, but I've
experienced some hicups with the cross-origin. The single journey test that I
currently have works when you run the non-optimised build (`yarn start`), but not
for the optimised one (`run-build.sh`) because it seems to think that a change in
origin is occuring when moving into a lesson. I suspect that the culript is
some kind of caching by the optimised build that is erroneously picked up as a
CORS violation by the Cypress-ized browser.

# Running the tests

Run `yarn test`
