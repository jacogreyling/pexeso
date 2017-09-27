[![Stories in Ready](https://badge.waffle.io/jacogreyling/pexeso.png?label=ready&title=Ready)](https://waffle.io/jacogreyling/pexeso?utm_source=badge)

# pexeso

A memory card game that will test your wits! How many rounds can you complete in 90 seconds?! Remember each round is harder than the previous. It also includes user registration and a leaderboard for those who dare to compete!


## Features

 - Interactive memory card game with multiple levels
 - Real-time leaderboard
 - Account sign-up page
 - Login system with forgot password and reset password
 - Showcasing various **Continuous Delivery** solutions from CA Technologies:
   - [Waffle](https://waffle.io)
   - [Continuous Delivery Director](https://cddirector.io/#/home)
   - [BlazeMeter](https://www.blazemeter.com)
   - [Live API Creator](https://www.ca.com/us/products/ca-live-api-creator.html)
   - [Service Virtualization](https://www.ca.com/us/products/ca-service-virtualization.html)


## Technology

This project is forked from [Aqua](https://github.com/jedireza/aqua) which is built with the [hapi](https://hapijs.com/) framework. Hapi is a [Node.js](https://nodejs.org/en/) project used by Walmart to handle all mobile transactions.
We're also using [MongoDB](http://www.mongodb.org/) as a data store for user registration and game statistics. Tiles are retrieved from various data sources via the [CA Live API Creator](https://www.ca.com/us/products/ca-live-api-creator.html) using RESTful API's.
The front-end is built with [React](https://github.com/facebook/react) developed by Facebook. We use [Redux](https://github.com/reactjs/redux) as our state container. Client side routing is done with [React Router](https://github.com/reactjs/react-router). Time keeping and formatting is done by the excellent library [Moment.js](https://momentjs.com)
Unit testing is done via [Lab](https://github.com/hapijs/lab) and API / Performance testing with [CA BlazeMeter](https://www.blazemeter.com) and JMeter.
We're using [Gulp](http://gulpjs.com/) for the build system and [CA CD Director](https://cddirector.io/#/home) for continuous delivery orchestration deploying to Amazon AWS Elastic Beanstalk.


## Requirements

You need [Node.js](http://nodejs.org/download/) v8.1.x or above installed and you'll need [MongoDB](http://www.mongodb.org/downloads) installed and running. You will also need to download and install the [CA Live API Creator](https://www.ca.com/us/products/ca-live-api-creator.html).

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


## Running tests

[Lab](https://github.com/hapijs/lab) is part of the hapi ecosystem and what we use to write all of our tests.

```bash
$ npm test

# > pexeso@0.0.0 test /home/jgreyling/projects/pexeso
# > lab -t 100 -S -T ./test/lab/transform -L --lint-options '{"extensions":[".js",".jsx"]}' ./test/lab/client-before.js ./test/client/ ./test/lab/client-after.js ./test/server/ ./test/lab/server-after.js ./test/misc/

#  ..................................................
#  ..................................................
#  ..................................................
#  ..................................................
#  ..................................................
#  ..................................................
#  ..................................................
#  ..................................................
#  ..................................................
#  ..................................................
#  ..................................................
#  ..................................................
#  ..................................................
#  ..................................................
#  ..................................................
#  ..................................................
#  ..................................................
#  ...............

# 865 tests complete
# Test duration: 6382 ms
# No global variable leaks detected
# Coverage: 100.00%
# Linting results: No issues
```


## License

MIT


## Special Thanks

A special thanks goes out to Reza Akhavan from [Aqua](https://github.com/jedireza/aqua) who created the boilerplate project with built-in registration, user management and more!

The game is based on the excellent work done by [ZeroSpree](https://codepen.io/zerospree/pen/bNWbvW) and ported to React by the pexeso development team.

The Server side start-up script for Linux-based systems running Node.js from [chovy](https://github.com/chovy/node-startup), Modified for AWS environments.
