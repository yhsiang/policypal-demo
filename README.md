# Programming Assignment for PolicyPal

# Development
(node required)

1. npm install
2. npm start

# Docker
(docker required)

1. docker-compose up
2. docker ps (find demo_web)
3. docker exec -it $(demo_web) npm run init


## Schema

User {
  level: Number,
  job: Enum( 'Barbarian', 'Mage', 'Hunter' ),
  name: String,
}

Item {
  name: String,
  level: Number,
  strength: Number,
  dexterity: Number,
  intelligence: Number,
  vitality: Number,
}

UserItems {
  uid: ObjectId,
  list: Array(5),
}
