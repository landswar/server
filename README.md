# LandsWar - Server

[![LandsWar Blog](https://img.shields.io/website-up-down-green-red/https/landswar.com.svg?label=landswar.com)](https://www.landswar.com)
[![dependency status](https://david-dm.org/landswar/server.svg)](https://david-dm.org/landswar/server)
[![dev-dependencies status](https://david-dm.org/landswar/server/dev-status.svg)](https://david-dm.org/landswar/server#info=devDependencies)
[![Build Status](https://travis-ci.org/landswar/server.svg?branch=master)](https://travis-ci.org/landswar/server)
[![Code Climate](https://codeclimate.com/github/landswar/server/badges/gpa.svg)](https://codeclimate.com/github/landswar/server)
[![codecov](https://codecov.io/gh/landswar/server/branch/master/graph/badge.svg)](https://codecov.io/gh/landswar/server)

[![Twitter URL](http://i.imgur.com/tXSoThF.png)](https://twitter.com/landswarcom)
[![Facebook URL](http://i.imgur.com/P3YfQoD.png)](https://www.facebook.com/landswarcom/)

The LandsWar server which contains the API and the WebSocket server.

## What is LandsWar?

LandsWar is a turn-based tactics online video game inspired by Advance Wars.

There are 3 types of units in the game (we don't have define the number of units in each category):

- ground units
- air units
- naval units

Also, there are a lot of different type of ground with bonus or malus for units.

With LandsWar, you will be able to play against your friend and people from all around the world.

## How to play?

Coming soon...

## How to run locally?

I use async/await so you need node.js v7 minimum to run it with the harmony flag: ```--harmony-async-await```.
Since the v7.6.0, async/await have been ported so you don't need to use the flag.

You need first to install ```docker-compose``` to start databases (Percona and Redis).

Then, you can run these commands:
```
yarn
yarn run start-docker
yarn start
```

If you have Postman installed, you can get and test all available routes with Postman:

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/cb70cbff411577e38581)

### NPM commands

- ```yarn run stop-docker``` To stop docker instances.
- ```yarn run debug``` To start the app with the debugger on port 5858.
- ```yarn run lint``` To run the ESLint code check.
- ```yarn run fix-code``` To fix simple norm errors with ESLint.

### Documentation

The API documentation is available here: [https://landswar.github.io/server/](https://landswar.github.io/server/)

## Questions / Bugs

If you find a bug or want a new feature, don't hesitate to [create an issue](https://github.com/landswar/server/issues).

## License

[GNU AFFERO GENERAL PUBLIC LICENSE](LICENSE)