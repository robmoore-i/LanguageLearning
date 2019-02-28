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
and use the `./lighthouse-audit.sh` script. You should only do this agaist the production build of the frontend.

Generated reports are put in the `lighthouse-audits/` directory.

# Cypress

Run `./cypress-run.sh`

# Running the unit tests

Run `yarn test`

# Stryker mutation testing

For installation I follwed the guide at https://stryker-mutator.io/stryker/quickstart.

Install stryker with `yarn global add stryker-cli`. You might then need to add `~/.yarn/bin` to your PATH. Then run `stryker init` inside `frontend/` to configure stryker.

To make it work I also needed to do `yarn add --dev stryker-javascript-mutator`.

And to run the mutation tester, use `yarn run stryker run`. This will take a while and is also quite resource intensive.