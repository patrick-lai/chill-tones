## About

Real time Visualization sound cloud audio files using WebAudioApi. Regretably this was made with some sort of scaffold so there is so much fat in the repo.

## Install

npm i

Create a file in the "core" folder called config.js and structure it like this:

```
export default {
 client_id: '%PUT_YOUR_SOUNDCLOUD_CLIENT_ID_HERE%'
}
```

## Run

npm run %script%

Scripts included in app:  
-test  
-publish  
-start

## Deployment

node run publish
