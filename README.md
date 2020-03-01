# Projekti 2 - vaihtokauppa



## Install

Ain't much to it.

```sh
# Download the repository
git clone https://github.com/berxam/mern-app.git

# Install dependencies
cd mern-app
npm install
```



## MongoDB

You have to declare your MongoDB URL (or *"connection string"*) as an environment variable. In order to do so, you have to create a file called ```.env``` and place it in the root of the project. This is a hidden file that is not committed to Github as it contains sensitive information. Now inside that file you can declare variables like this:
```
MONGODB_URL=YOURURLHERE
```

Note that if you have **spaces and/or quotes** in the value, they **will be included in the value**.

If you don't have a MongoDB account, you can either download a [local MongoDB server](https://www.mongodb.com/download-center/community) or sign up for a [cloud account](https://www.mongodb.com/cloud/atlas/register) and you'll get the URL there.

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

Both packages have some [npm scripts](https://docs.npmjs.com/misc/scripts) set up for developing. Client has scripts set up by [create-react-app](https://create-react-app.dev/) and server has scripts set up by yours truly. Here are the server scripts:

#### ```install```

If you run ```npm install``` in the main package, which is the server, it will first install the main package dependencies and when it's finished, it automatically runs ```npm install --prefix client``` to install the clients dependencies aswell. This only applies when you install the dependencies of this project, not when you install new dependencies with ```npm i <pkg>```.

#### ```dev```, ```server``` & ```client```

While you *can* launch development server for both packages concurrently in one terminal, splitting the VS Code terminal in two and running them separately gives you a far better developing experience.
```sh
# Server and client concurrently
npm run dev

# Server or client individually
npm run server
npm run client # same as cd client && npm start
```
