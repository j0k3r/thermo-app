# Thermo APP

[![Node CI](https://github.com/j0k3r/thermo-app/actions/workflows/ci.yml/badge.svg)](https://github.com/j0k3r/thermo-app/actions/workflows/ci.yml)

That iOS app runs using Expo.  
It is intended to work only with the API from https://github.com/j0k3r/thermo-proxy-aws

Here are some screenshots:

![home_light](https://github.com/j0k3r/thermo-app/assets/62333/91d34201-27d0-4ce5-b35d-854538b86c9e)
![view_dark](https://github.com/j0k3r/thermo-app/assets/62333/ab2c8343-dd23-49fe-ab82-5619fc6fd89f)
![view_light](https://github.com/j0k3r/thermo-app/assets/62333/7179d5fa-2eaa-474c-a0c4-46b9e6eced5b)


To setup the app:
```bash
# update the API url in it
cp config.js.dist config.js
# install the required node version
nvm install
# install deps
yarn install
# run the simulator
yarn start
```


Icon made by photo3idea-studio from www.flaticon.com
