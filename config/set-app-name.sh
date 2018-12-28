set -e
set -x

# Change name in line 22 of frontend/public/index.html

sed -i "22s/.*/    <title>${APP_APP_NAME}<\/title>/" ../frontend/public/index.html

# Change name in line 2 of frontend/package.json

sed -i "2s/.*/  \"name\": \"${APP_APP_NAME}\",/" ../frontend/package.json

set +e
set +x
