# Note: Serves whatever is in build/. This does not rebuild. To rebuild, run `yarn build`.
$(yarn global bin)/serve -s -l $MELANGE_FRONTEND_PORT build/
