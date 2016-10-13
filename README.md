

## About

Real time Visualization sound cloud audio files using WebAudioApi

## Install

npm i

## Run

npm run


## Deployment

Login to Firebase (or Signup if you don't have an account) and create a new project
Install cli: npm i -g firebase-tools
Login: firebase login

Initialize project with firebase init then answer:
-What file should be used for Database Rules? -> database.rules.json
-What do you want to use as your public directory? -> build
-Configure as a single-page app (rewrite all urls to /index.html)? -> Yes
-What Firebase project do you want to associate as default? -> your Firebase project name

Build Project: npm run build
Confirm Firebase config by running locally: firebase serve
Deploy to firebase: firebase deploy
