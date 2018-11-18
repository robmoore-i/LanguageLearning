# Frontend

# Setting up and running a production build

1. Make sure you've configured a `melangerc` in `/config` and it is loaded.

2. Serve the build/ directory as static content.

I have a script for running the production frontend, called `run-build.sh`.

# Lighthouse audits

The frontend can be audited by google's lighthouse tool.

To install lighthouse, do

`npm install -g lighthouse`

To run the PWA audits for melange, make sure youre in the `frontend/` dir,
and use the `./lighthouse-audit.sh` script.

Generated reports are put in the `lighthouse-audits/` directory.
