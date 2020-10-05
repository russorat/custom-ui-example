to start this app, run the following:

Start the backend server
```
cd react-app/server
yarn install
INFLUX_ORG=<your org> INFLUX_TOKEN=<your token> INFLUX_URL=<your url> yarn start
```

in a new window, start the react app
```
cd react-app
npm run start-client
```

