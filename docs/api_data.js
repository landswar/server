define({ "api": [
  {
    "type": "post",
    "url": "/checkToken",
    "title": "Check Token validity.",
    "name": "checkToken",
    "group": "Auth",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>The token to check.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>The nickname of the Player.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "nickname",
            "description": "<p>The nickname of the Player.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "400": [
          {
            "group": "400",
            "optional": false,
            "field": "TokenNotValid",
            "description": "<p>The token is not valid.</p>"
          }
        ],
        "404": [
          {
            "group": "404",
            "optional": false,
            "field": "UserNotFound",
            "description": "<p>The user corresponding to the given token cannot be found.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/routes/auth/handler.js",
    "groupTitle": "Auth"
  },
  {
    "type": "post",
    "url": "/login",
    "title": "Login user.",
    "name": "loginPlayer",
    "group": "Auth",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>The nickname or email of the player.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>The nickname of the Player.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "nickname",
            "description": "<p>The nickname of the Player.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>The jsonwebtoken of the Player.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "404": [
          {
            "group": "404",
            "optional": false,
            "field": "PlayerNotFound",
            "description": "<p>The id of the Player was not found.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/routes/auth/handler.js",
    "groupTitle": "Auth"
  },
  {
    "type": "get",
    "url": "/groundPenalties",
    "title": "Request every GroundPenalty.",
    "name": "getGroundPenalties",
    "group": "GroundPenalty",
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "Object[]",
            "optional": false,
            "field": "groundPenalties",
            "description": "<p>List of GroundPenalties.</p>"
          },
          {
            "group": "200",
            "type": "Number",
            "optional": false,
            "field": "groundPenalties.id",
            "description": "<p>GroundPenalties unique ID.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "groundPenalties.idGround",
            "description": "<p>Grounds unique ID.</p>"
          },
          {
            "group": "200",
            "type": "Number",
            "optional": false,
            "field": "groundPenalties.idUnit",
            "description": "<p>Units unique ID.</p>"
          },
          {
            "group": "200",
            "type": "Number",
            "optional": false,
            "field": "groundPenalties.penalty",
            "description": "<p>Penalty of Ground for the Unit.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/routes/ground_penalty/handler.js",
    "groupTitle": "GroundPenalty"
  },
  {
    "type": "get",
    "url": "/groundPenalty/:idUnit/:idGround",
    "title": "Request GroundPenalty information.",
    "name": "getGroundPenalty",
    "group": "GroundPenalty",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "idUnit",
            "description": "<p>Units unique ID.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "idGround",
            "description": "<p>Grounds unique ID.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>GroundPenalties unique ID.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "idGround",
            "description": "<p>Grounds unique ID.</p>"
          },
          {
            "group": "200",
            "type": "Number",
            "optional": false,
            "field": "idUnit",
            "description": "<p>Units unique ID.</p>"
          },
          {
            "group": "200",
            "type": "Number",
            "optional": false,
            "field": "penalty",
            "description": "<p>Penalty of Ground for the Unit.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "404": [
          {
            "group": "404",
            "optional": false,
            "field": "GroundPenaltyNotFound",
            "description": "<p>The id of the GroundPenalty was not found.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/routes/ground_penalty/handler.js",
    "groupTitle": "GroundPenalty"
  },
  {
    "type": "get",
    "url": "/grounds/:id",
    "title": "Request Ground information.",
    "name": "getGround",
    "group": "Ground",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>Grounds unique ID.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>Grounds unique ID.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Name of the ground.</p>"
          },
          {
            "group": "200",
            "type": "Number",
            "optional": false,
            "field": "defense",
            "description": "<p>Defense of the ground.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "404": [
          {
            "group": "404",
            "optional": false,
            "field": "GroundNotFound",
            "description": "<p>The id of the Ground was not found.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/routes/ground/handler.js",
    "groupTitle": "Ground"
  },
  {
    "type": "get",
    "url": "/grounds",
    "title": "Request every Ground.",
    "name": "getGrounds",
    "group": "Ground",
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "Object[]",
            "optional": false,
            "field": "grounds",
            "description": "<p>List of Grounds.</p>"
          },
          {
            "group": "200",
            "type": "Number",
            "optional": false,
            "field": "grounds.id",
            "description": "<p>Grounds unique ID.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "grounds.name",
            "description": "<p>Name of the ground.</p>"
          },
          {
            "group": "200",
            "type": "Number",
            "optional": false,
            "field": "grounds.defense",
            "description": "<p>Defense of the ground.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/routes/ground/handler.js",
    "groupTitle": "Ground"
  },
  {
    "type": "get",
    "url": "/maps/:id",
    "title": "Request a Map.",
    "name": "getMap",
    "group": "Map",
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "Number",
            "optional": false,
            "field": "map.id",
            "description": "<p>Maps unique ID.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "map.name",
            "description": "<p>The name of the map.</p>"
          },
          {
            "group": "200",
            "type": "Number",
            "optional": false,
            "field": "map.data",
            "description": "<p>A JSON which follow the JSON Map format.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/routes/map/handler.js",
    "groupTitle": "Map"
  },
  {
    "type": "get",
    "url": "/maps/:id/preview",
    "title": "Request the map preview.",
    "name": "getMapPreview",
    "group": "Map",
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "Image",
            "optional": false,
            "field": "The",
            "description": "<p>PNG preview of the map.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/routes/map/handler.js",
    "groupTitle": "Map"
  },
  {
    "type": "get",
    "url": "/maps",
    "title": "Request every Map.",
    "name": "getMaps",
    "group": "Map",
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "Object[]",
            "optional": false,
            "field": "maps",
            "description": "<p>List of Maps.</p>"
          },
          {
            "group": "200",
            "type": "Number",
            "optional": false,
            "field": "maps.id",
            "description": "<p>Maps unique ID.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "maps.name",
            "description": "<p>The name of the map.</p>"
          },
          {
            "group": "200",
            "type": "Number",
            "optional": false,
            "field": "maps.data",
            "description": "<p>A JSON which follow the JSON Map format.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/routes/map/handler.js",
    "groupTitle": "Map"
  },
  {
    "type": "delete",
    "url": "/player/:id",
    "title": "Delete a Player.",
    "name": "deletePlayer",
    "group": "Player",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>Player unique ID.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "optional": false,
            "field": "PlayerDeleted",
            "description": ""
          }
        ]
      }
    },
    "error": {
      "fields": {
        "404": [
          {
            "group": "404",
            "optional": false,
            "field": "PlayerNotFound",
            "description": "<p>The id of the player was not found.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/routes/player/handler.js",
    "groupTitle": "Player"
  },
  {
    "type": "get",
    "url": "/player/:id",
    "title": "Request Player informations.",
    "name": "getPlayer",
    "group": "Player",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>Player unique ID.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>Player unique ID.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Email of the player.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "nickname",
            "description": "<p>Nickname of the player.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "404": [
          {
            "group": "404",
            "optional": false,
            "field": "PlayerNotFound",
            "description": "<p>The id of the Player was not found.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/routes/player/handler.js",
    "groupTitle": "Player"
  },
  {
    "type": "get",
    "url": "/players",
    "title": "Request every Player.",
    "name": "getPlayers",
    "group": "Player",
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "Object[]",
            "optional": false,
            "field": "players",
            "description": "<p>List of Players.</p>"
          },
          {
            "group": "200",
            "type": "Number",
            "optional": false,
            "field": "players.id",
            "description": "<p>Player unique ID.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "players.email",
            "description": "<p>Email of the player.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "players.nickname",
            "description": "<p>Nickname of the player.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/routes/player/handler.js",
    "groupTitle": "Player"
  },
  {
    "type": "post",
    "url": "/player",
    "title": "Create a Player.",
    "name": "postPlayer",
    "group": "Player",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "nickname",
            "description": "<p>The nickname of the Player.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "nickname",
            "description": "<p>The nickname of the Player.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>The jsonwebtoken of the Player.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "400": [
          {
            "group": "400",
            "optional": false,
            "field": "PlayerBadRequest",
            "description": "<p>The nickname already exists.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/routes/player/handler.js",
    "groupTitle": "Player"
  },
  {
    "type": "put",
    "url": "/player/:id",
    "title": "Update a Player.",
    "name": "putPlayer",
    "group": "Player",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>Player unique ID.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "nickname",
            "description": "<p>The nickname of the Player.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>The email of the Player.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>Player unique ID.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "nickname",
            "description": "<p>The nickname of the Player.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>The email of the Player.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "404": [
          {
            "group": "404",
            "optional": false,
            "field": "PlayerNotFound",
            "description": "<p>The id of the Player was not found.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/routes/player/handler.js",
    "groupTitle": "Player"
  },
  {
    "type": "delete",
    "url": "/rooms/:id",
    "title": "Delete a Room.",
    "name": "deleteRoom",
    "group": "Room",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>Room unique ID.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "optional": false,
            "field": "RoomDeleted",
            "description": ""
          }
        ]
      }
    },
    "error": {
      "fields": {
        "404": [
          {
            "group": "404",
            "optional": false,
            "field": "RoomNotFound",
            "description": "<p>The id of the room was not found.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/routes/room/handler.js",
    "groupTitle": "Room"
  },
  {
    "type": "get",
    "url": "/rooms/:id",
    "title": "Request Room informations.",
    "name": "getRoom",
    "group": "Room",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>Rooms unique ID.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>Rooms unique ID.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Name of the room.</p>"
          },
          {
            "group": "200",
            "type": "Number",
            "optional": false,
            "field": "maxPlayer",
            "description": "<p>Number of players allowed to enter in the room.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "shortid",
            "description": "<p>ShortID of the room.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "404": [
          {
            "group": "404",
            "optional": false,
            "field": "RoomNotFound",
            "description": "<p>The id of the Room was not found.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/routes/room/handler.js",
    "groupTitle": "Room"
  },
  {
    "type": "get",
    "url": "/rooms",
    "title": "Request every Room.",
    "name": "getRooms",
    "group": "Room",
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "Object[]",
            "optional": false,
            "field": "rooms",
            "description": "<p>List of Rooms.</p>"
          },
          {
            "group": "200",
            "type": "Number",
            "optional": false,
            "field": "rooms.id",
            "description": "<p>Rooms unique ID.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "rooms.name",
            "description": "<p>Name of the room.</p>"
          },
          {
            "group": "200",
            "type": "Number",
            "optional": false,
            "field": "rooms.maxPlayer",
            "description": "<p>Number of players allowed to enter in the room.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "rooms.shortid",
            "description": "<p>ShortID of the room.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/routes/room/handler.js",
    "groupTitle": "Room"
  },
  {
    "type": "post",
    "url": "/rooms",
    "title": "Create a Room.",
    "name": "postRoom",
    "group": "Room",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>The name of the room.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Name of the room.</p>"
          },
          {
            "group": "200",
            "type": "Number",
            "optional": false,
            "field": "maxPlayer",
            "description": "<p>Number of players allowed to enter in the room.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "shortid",
            "description": "<p>ShortID of the room.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/routes/room/handler.js",
    "groupTitle": "Room"
  },
  {
    "type": "put",
    "url": "/rooms/:id",
    "title": "Update a Room.",
    "name": "putRoom",
    "group": "Room",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>Room unique ID.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>The name of the room.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Name of the room.</p>"
          },
          {
            "group": "200",
            "type": "Number",
            "optional": false,
            "field": "maxPlayer",
            "description": "<p>Number of players allowed to enter in the room.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "shortid",
            "description": "<p>ShortID of the room.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "404": [
          {
            "group": "404",
            "optional": false,
            "field": "PlayerNotFound",
            "description": "<p>The id of the Player was not found.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/routes/room/handler.js",
    "groupTitle": "Room"
  },
  {
    "type": "get",
    "url": "/unit/:id",
    "title": "Request Unit informations.",
    "name": "getUnit",
    "group": "Unit",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>Units unique ID.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>Units unique ID.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Name of the unit.</p>"
          },
          {
            "group": "200",
            "type": "Number",
            "optional": false,
            "field": "life",
            "description": "<p>The total life of the Unit.</p>"
          },
          {
            "group": "200",
            "type": "Number",
            "optional": false,
            "field": "ammo1",
            "description": "<p>The total of ammunition for the first weapon.</p>"
          },
          {
            "group": "200",
            "type": "Number",
            "optional": false,
            "field": "ammo2",
            "description": "<p>The total of ammunition for the second weapon or null.</p>"
          },
          {
            "group": "200",
            "type": "Number",
            "optional": false,
            "field": "fuel",
            "description": "<p>The total of fuel for the unit.</p>"
          },
          {
            "group": "200",
            "type": "Number",
            "optional": false,
            "field": "vision",
            "description": "<p>The vision of the unit. The unit can see N box(es).</p>"
          },
          {
            "group": "200",
            "type": "Number",
            "optional": false,
            "field": "move",
            "description": "<p>The move of the unit. The unit can move N box(es). Penalty will be added depending on the ground.</p>"
          },
          {
            "group": "200",
            "type": "Number",
            "optional": false,
            "field": "rangeMin",
            "description": "<p>The rangeMin of the unit. The minimum target can be at N box(es).</p>"
          },
          {
            "group": "200",
            "type": "Number",
            "optional": false,
            "field": "rangeMax",
            "description": "<p>The rangeMax of the unit. The maximum target can be at N box(es).</p>"
          },
          {
            "group": "200",
            "type": "Number",
            "optional": false,
            "field": "cost",
            "description": "<p>The cost of the unit.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "404": [
          {
            "group": "404",
            "optional": false,
            "field": "UnitNotFound",
            "description": "<p>The id of the Unit was not found.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/routes/unit/handler.js",
    "groupTitle": "Unit"
  },
  {
    "type": "get",
    "url": "/units",
    "title": "Request every Unit.",
    "name": "getUnits",
    "group": "Unit",
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "Object[]",
            "optional": false,
            "field": "units",
            "description": "<p>List of Units.</p>"
          },
          {
            "group": "200",
            "type": "Number",
            "optional": false,
            "field": "units.id",
            "description": "<p>Units unique ID.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "units.name",
            "description": "<p>Name of the unit.</p>"
          },
          {
            "group": "200",
            "type": "Number",
            "optional": false,
            "field": "units.life",
            "description": "<p>The total life of the Unit.</p>"
          },
          {
            "group": "200",
            "type": "Number",
            "optional": false,
            "field": "units.ammo1",
            "description": "<p>The total of ammunition for the first weapon.</p>"
          },
          {
            "group": "200",
            "type": "Number",
            "optional": false,
            "field": "units.ammo2",
            "description": "<p>The total of ammunition for the second weapon or null.</p>"
          },
          {
            "group": "200",
            "type": "Number",
            "optional": false,
            "field": "units.fuel",
            "description": "<p>The total of fuel for the unit.</p>"
          },
          {
            "group": "200",
            "type": "Number",
            "optional": false,
            "field": "units.vision",
            "description": "<p>The vision of the unit. The unit can see N box(es).</p>"
          },
          {
            "group": "200",
            "type": "Number",
            "optional": false,
            "field": "units.move",
            "description": "<p>The move of the unit. The unit can move N box(es). Penalty will be added depending on the ground.</p>"
          },
          {
            "group": "200",
            "type": "Number",
            "optional": false,
            "field": "units.rangeMin",
            "description": "<p>The rangeMin of the unit. The minimum target can be at N box(es).</p>"
          },
          {
            "group": "200",
            "type": "Number",
            "optional": false,
            "field": "units.rangeMax",
            "description": "<p>The rangeMax of the unit. The maximum target can be at N box(es).</p>"
          },
          {
            "group": "200",
            "type": "Number",
            "optional": false,
            "field": "units.cost",
            "description": "<p>The cost of the unit.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/routes/unit/handler.js",
    "groupTitle": "Unit"
  }
] });
