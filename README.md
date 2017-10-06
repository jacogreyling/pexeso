[![Waffle.io](https://badge.waffle.io/jacogreyling/pexeso.svg?columns=all)](http://waffle.io/jacogreyling/pexeso)

# pexeso

A memory card game that will test your wits! Three rounds, each one becoming progressively more difficult than the previous round. It also includes user registration, game statistics and a leaderboard (admin users) for those who dare to compete!


## Features

 - Interactive memory card game with multiple levels
 - Account sign-up page
 - Login system with forgot password and reset password
 - Real-time leaderboard, with the ability to search for player scores
 - Game statistics / telemetry to keep track of participation
 - Showcasing various **Continuous Delivery** solutions from CA Technologies:
   - [Waffle](https://waffle.io) (CA Accelerator)
   - [Continuous Delivery Director](https://cddirector.io/#/home)
   - [BlazeMeter](https://www.blazemeter.com)
   - [Live API Creator](https://www.ca.com/us/products/ca-live-api-creator.html)
   - [Flow Dock](https://www.ca.com/us/products/ca-flowdock.html)
   - [Service Virtualization](https://www.ca.com/us/products/ca-service-virtualization.html) Coming Soon!
   - [Application Performance Management](https://www.ca.com/us/products/ca-application-performance-management.html) Coming Soon!


## Technology

This project is forked from [Aqua](https://github.com/jedireza/aqua) which is built with the [hapi](https://hapijs.com/) framework. Hapi is a [Node.js](https://nodejs.org/en/) project used by Walmart to handle all (millions) mobile transactions. We're also using [MongoDB](http://www.mongodb.org/) as a data store for user registration and game scores.


Game cards are retrieved from various data sources via the [CA Live API Creator](https://www.ca.com/us/products/ca-live-api-creator.html) using RESTful API's.
Statistics are provided through a custom build telemetry plug-in. It uses [Redis](https://redis.io) as a global state store and Hapi's multi-strategy object caching service called [catbox](https://github.com/hapijs/catbox). This allows for scaleability in a multi server environment.


The front-end is built with [React](https://github.com/facebook/react) developed by Facebook. We use [Redux](https://github.com/reactjs/redux) as our state container. Client side routing is done with [React Router](https://github.com/reactjs/react-router). Time keeping and formatting is done by the excellent library [Moment.js](https://momentjs.com). Graphs are built using [Chart.js](http://www.chartjs.org), a phenomenal open source HTML5 charting project.
Unit testing is done via [Lab](https://github.com/hapijs/lab) and API / Performance testing with [CA BlazeMeter](https://www.blazemeter.com) and JMeter.


Lastly, we're using [Gulp](http://gulpjs.com/) and [webpack](https://webpack.js.org) for our build and packaging system and [CA CD Director](https://cddirector.io/#/home) for continuous delivery orchestration, deploying to Amazon AWS on-demand.


## Requirements

You need [Node.js](http://nodejs.org/download/) v8.1.x or above installed. You will also need [MongoDB](http://www.mongodb.org/downloads) and [Redis](https://redis.io) installed and running on localhost. You can optionally download and install the [CA Live API Creator](https://www.ca.com/us/products/ca-live-api-creator.html) to create / secure your public facing API's.

We use [`bcrypt`](https://github.com/ncb000gt/node.bcrypt.js) for hashing secrets.


## Installation

```bash
$ git clone git@github.com/jacogreyling/pexeso.git
$ cd pexeso
$ npm install
```


## Configuration

Simply edit `config/config.js`. The configuration uses [`confidence`](https://github.com/hapijs/confidence) which makes it easy to manage configuration settings across environments. __Don't store secrets in this file or commit them to your repository.__

__Instead, access secrets via environment variables.__ We use [`dotenv`](https://github.com/motdotla/dotenv) to help make setting local environment variables easy (not to be used in production).

Simply copy `.env-sample` to `.env` and edit as needed. __Don't commit `.env` to your repository.__


## First time setup

__WARNING__: This will clear all data in the following MongoDB collections if they exist: `accounts`, `adminGroups`, `admins`, `authAttempts`, `sessions`, `users`, `scores` and `statistics`.

```bash
$ npm run first-time-setup

# > pexeso@0.0.0 first-time-setup /home/jgreyling/projects/pexeso
# > node first-time-setup.js

# MongoDB URL: (mongodb://localhost:27017/pexeso)
# Root user email: jgreyling@gmail.com
# Root user password:
# Setup complete.
```


## Running the app

```bash
$ npm start

# > pexeso@0.0.0 start /home/jgreyling/projects/pexeso
# > gulp react && gulp

# [23:41:44] Using gulpfile ~/projects/pexeso/gulpfile.js
# ...
```

Now you should be able to point your browser to http://127.0.0.1:8000/ and see the welcome page.

[`nodemon`](https://github.com/remy/nodemon) watches for changes in server code and restarts the app automatically. [`gulp`](https://github.com/gulpjs/gulp) and [`webpack`](https://github.com/webpack/webpack) watch the front-end files and re-build those automatically too.



## Running in production

```bash
$ node server.js
```

Unlike `$ npm start` this doesn't watch for file changes. Also be sure to set these environment variables in your production environment:

 - `NODE_ENV=production` - This is important for many different optimizations,  both server-side and with the front-end build files.
 - `NPM_CONFIG_PRODUCTION=false` - This tells `$ npm install` to not skip installing `devDependencies`, which we need to build the front-end files.



## Want to contribute?

Contributions are welcome. If you're changing something non-trivial, you may want to submit an issue before creating a large pull request.



## License

MIT


## Special Thanks

A special thanks goes out to Reza Akhavan from [Aqua](https://github.com/jedireza/aqua) who created the boilerplate project with built-in registration, user management and more!

The game is based on the excellent work done by [ZeroSpree](https://codepen.io/zerospree/pen/bNWbvW) and ported to React by the pexeso development team.

The server side start-up script for Linux-based systems running Node.js from [chovy](https://github.com/chovy/node-startup), Modified for Amazon environments.
