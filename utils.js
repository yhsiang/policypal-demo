import {
  maxUserLv,
  minUserLv,
  jobList,
  userNameList,
  maxItemLv,
  minItemLv,
  minItemAttrs,
  itemAttrs,
  itemNameList,
  itemAttrLimit,
} from './constants';

export function createUser() {
  const level = Math.floor(Math.random() * maxUserLv) + minUserLv;
  const job = jobList[Math.floor(Math.random() * jobList.length)];
  const name = userNameList[Math.floor(Math.random() * userNameList.length)];

  return {
    level,
    job,
    name,
  };
}

export function createItem(itemLv) {
  const level = itemLv? itemLv : random(maxItemLv)(minItemLv);
  const name = itemNameList[random(itemNameList.length)()];
  // FIXME: always strength > dexterity > intelligence > vitality
  const [strength, dexterity, intelligence, vitality] = generateItemAttributes(level);

  return {
    level,
    strength,
    dexterity,
    intelligence,
    vitality,
    name,
  };
}

export function random(max) {
  return (min = 0) => {
    return Math.floor(Math.random() * max) + min;
  };
}

function generateItemAttributes(itemLevel) {
  const max = itemAttrLimit * itemLevel;
  let nextLimit = max;
  // Str, Dex, Int, Vit -> 4 (lazy for definition)
  return itemAttrs.map(() => {
    const n = Math.floor(Math.random() * nextLimit) + minItemAttrs;
    nextLimit -= n;
    if (nextLimit < 0 ) nextLimit = 0;
    return n;
  });
}

function compareAttrs(prev) {
  return (next) => {
    return (
      prev.level !== next.level ||
      prev.strength !== next.strength ||
      prev.dexterity !== next.dexterity ||
      prev.intelligence !== next.intelligence ||
      prev.vitality !== next.vitality
    );
  };
}

export function filterItems(items) {
  const [head, ...rest] = items;
  const result = [head];
  for (let i = 0; i < rest.length; i++) {
    const compared = result.map( r => compareAttrs(r)(rest[i]));
    if (compared.indexOf(false) !== -1) continue;
    result.push(rest[i]);
  }
  return result;
}

export function firstCapital(string) {
  const [head, ...rest] = string.split('');
  return [head.toUpperCase(), ...rest].join('');
}

/*
Barbarian's attributes
  strength: level*3
  dexterity: level*2
  intelligence: level*1
  vitality: level*3

Mage's attributes
  strength: level*1
  dexterity: level*2
  intelligence: level*3
  vitality: level*3

Hunter's attributes
  strength: level*2
  dexterity: level*3
  intelligence: level*1
  vitality: level*3
*/
function getUserAttributes(user) {
  switch (user.job) {
    case 'Barbarian':
      return {
        strength: user.level * 3,
        dexterity: user.level * 2,
        intelligence: user.level * 1,
        vitality: user.level * 3,
      };
    case 'Mage':
      return {
        strength: user.level * 1,
        dexterity: user.level * 2,
        intelligence: user.level * 3,
        vitality: user.level * 3,
      };
    case 'Hunter':
      return {
        strength: user.level * 2,
        dexterity: user.level * 3,
        intelligence: user.level * 1,
        vitality: user.level * 3,
      };
    default:
      return {
        strength: 0,
        dexterity: 0,
        intelligence: 0,
        vitality: 0,
      }
  }
}

export function getUserPoint(user) {
  switch (user.job) {
    case 'Barbarian': {
      const { strength, vitality } = getUserAttributes(user);
      return user.items.reduce((acc, cur) => {
        acc += cur.strength;
        acc += cur.vitality;
        return acc;
      }, strength + vitality);
    }
    case 'Mage': {
      const { intelligence, vitality } = getUserAttributes(user);
      return user.items.reduce((acc, cur) => {
        acc += cur.intelligence;
        acc += cur.vitality;
        return acc;
      }, intelligence + vitality);
    }
    case 'Hunter':  {
      const { dexterity, vitality } = getUserAttributes(user);
      return user.items.reduce((acc, cur) => {
        acc += cur.dexterity;
        acc += cur.vitality;
        return acc;
      }, dexterity + vitality);
    }
    default:
      return -1;
  }
}
