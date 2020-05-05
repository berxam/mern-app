# Projekti 2 - vaihtokauppa



## Install

Start by cloning the repo and installing the dependencies.

```sh
# Download the repository
git clone https://github.com/berxam/mern-app.git

# Install dependencies
cd mern-app
npm install
cd client
npm install
```

Then you have to set some environment variables before running the app. In order to do so, create a file called ```.env``` in the root of the project. It's a hidden file and is not committed to Github as it contains sensitive information. Here's an example of the contents:
```sh
# Database URL, either local or cloud
MONGODB_URL=mongodb://127.0.0.1:27017/projekti-2

# Secrets for generating JWTs
REFRESH_SECRET=c743100401975f217e91ca66bf8fd4223c5df9c9d601ae0f66d970e
ACCESS_SECRET=7ee456641945be2d18074c84f475b497a5ff1a4c575f2920925c044

# Optionally set host and port (if none set app defaults to localhost:5000)
PORT=5000
HOST=127.0.0.1
```

**TIP:** You can generate the secrets for the JWTs by running this in console:
```sh
node -e "console.log( require('crypto').randomBytes(64).toString('hex') )"
```

## MongoDB

One of the necessary environment variables is your MongoDB URL (aka *"connection string"*). For that you need a MongoDB database. If you don't have a MongoDB account, you can either download a [local MongoDB server](https://www.mongodb.com/download-center/community) or sign up for a [cloud account](https://www.mongodb.com/cloud/atlas/register) and you'll get the URL there.

- local URL looks like ```mongodb://127.0.0.1:port/database```
- Atlas URL looks like ```mongodb+srv://user:pass@host/database```

Note that the database is specified in the end of the URL. If you don't have any databases, create one for this project and add its name to the end of your URL.



## npm

There are two separate packages in this repository, one is the main package with all its source code in the folder ```src```, and the other one is the ```client```.

When using ```npm i <pkg>``` to install new dependencies, **make sure you're inside the right folder**. For server dependencies you must be inside the root of the project and for client dependencies you must be inside ```client```.

```
app
├── client
│   ├── src
│   │   └── index.js
│   └── package.json  // client package
├── src
│   └── server.js
└── package.json      // main package
```

### Scripts

#### Developing
Both packages have some [npm scripts](https://docs.npmjs.com/misc/scripts) set up for developing. Client has scripts set up by [create-react-app](https://create-react-app.dev/docs/available-scripts) and server has scripts set up by yours truly. Here are the server scripts:
```sh
# Server or client individually
npm run server
npm run client # same as cd client && npm start

# Server and client concurrently
npm run dev
```
Note that while you *can* launch development server for both packages concurrently in one terminal, splitting the VS Code terminal in two and running them separately gives you a far better developing experience.

#### Deploying

***Under construction***

You have to build the React application into an optimized bundle before deploying it.
```sh
cd client
npm run build
```
Then go back to project root and run
```sh
npm run deploy
```
