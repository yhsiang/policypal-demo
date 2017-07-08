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
  // FIXME: always strength > dexerity > intelligence > vitality
  const [strength, dexerity, intelligence, vitality] = generateItemAttributes(level);

  return {
    level,
    strength,
    dexerity,
    intelligence,
    vitality,
    name,
  };
}

function random(max) {
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
      prev.dexerity !== next.dexerity ||
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
