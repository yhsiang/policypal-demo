# Programming Assignment for PolicyPal

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
  dexerity: Number,
  intelligence: Number,
  vitality: Number,
}
