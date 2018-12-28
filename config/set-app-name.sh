set -e
set -x

# Change name in line 22 of frontend/public/index.html

sed -i "22s/.*/    <title>${APP_APP_NAME}<\/title>/" ../frontend/public/index.html

# Change name in line 2 of frontend/package.json

packageJsonAppName=`echo $APP_APP_NAME | sed -e 's/ /_/g'`

sed -i "2s/.*/  \"name\": \"${packageJsonAppName}\",/" ../frontend/package.json

# Change name in lines 2 and 3 in frontend/public/manifest.json

sed -i "2s/.*/  \"short_name\": \"${APP_APP_NAME}\",/" ../frontend/public/manifest.json
sed -i "3s/.*/  \"name\": \"${APP_APP_NAME}\",/" ../frontend/public/manifest.json
