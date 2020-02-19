# Projekti 2 - vaihtokauppa

- [Install](#install)
- [npm](#npm)
- [MongoDB](#mongodb)

## Install

Ain't much to it.

```sh
# Download the repository
git clone https://github.com/berxam/mern-app.git

# Install dependencies for server AND client
cd mern-app
npm install
```

## npm

There are two separate packages in this repository, one is the main package with all its source code in the folder ```src```, and the other one is the ```client```.

When installing new dependencies with ```npm i <pkg>```, **make sure you're inside the right folder**.

```
app
├── client
│   ├── src
│   │   └── index.js // client package
│   └── package.json // client package
├── src
│   └── server.js // main package
└── package.json  // main package
```

### Scripts

Since the client is made with [create-react-app](https://create-react-app.dev/) it has some [npm scripts](https://docs.npmjs.com/misc/scripts) set up for developing etc. but the main package has a few too:

#### ```install```

If you run ```npm install``` in the main package, which is the server, it will first install the main package dependencies and when it's finished, it runs ```npm install --prefix client``` to install the clients dependencies aswell. This only applies when you install the dependencies of this project, not when you run ```npm i <pkg>```.

#### ```dev``` & ```server```

While you *can* launch development server for both packages concurrently in one terminal, splitting the VS Code terminal into two and running them separately gives you a better developing experience.
```sh
# Server and client concurrently
npm run dev

# Server or client individually
npm run server
npm run client # same as cd client && npm start
```

## MongoDB

You have to declare your MongoDB URL as an environment variable in ```root/.env``` like this:
```
MONGODB_URL=YOURURLHERE
```

If you don't have a MongoDB account, you can either download a [local MongoDB](https://www.mongodb.com/download-center/community) or sign up for a [cloud account](https://www.mongodb.com/cloud/atlas/register). You'll get the URL there.
