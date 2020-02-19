# Projekti 2 - vaihtokauppa

## Get started

```sh
# Download the repository & cd into it
git clone https://github.com/berxam/mern-app.git
cd mern-app

# Install dependencies for server AND client
npm install

# Start development servers for both
npm start
```

### MongoDB setup

You have to declare your MongoDB credentials as environment variables in ```./src/.env``` like this:
```
MONGODB_URL=YOURURLHERE
```

If you don't have MongoDB account, you can either download a [local MongoDB](https://www.mongodb.com/download-center/community) or sign up for a [cloud account](https://www.mongodb.com/cloud/atlas/register). You'll get the URL there.

Note that there are two separate npm packages in this repository, so know **where** you're installing dependencies

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
