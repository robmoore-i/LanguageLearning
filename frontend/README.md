# Frontend

# Setting up and running a production build

Make sure you've configured a `melangerc` in `/config` and it is loaded.

Install a server of static content. My example is using: `yarn global add serve`.

```
$ yarn build
$ $(yarn global bin)/serve -s -l $MELANGE_FRONTEND_PORT build/
```

I have a script for the running of the built server, called `run-build.sh`.

# Lighthouse audits

The frontend can be audited by google's lighthouse tool.

To install lighthouse, do

`npm install -g lighthouse`

To run the audits for melange, do, from the `frontend/` dir:

`./lighthouse-audit.sh <app-path>`

Where <app-path> is some path for the app, examples include:

`./lighthouse-audit.sh /`

`./lighthouse-audit.sh /courses`

`./lighthouse-audit.sh /courses/Georgian/Colours`

Generated reports are put in the `lighthouse-audits/` directory.
