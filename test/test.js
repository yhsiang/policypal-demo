import test from 'tape';
import { itemAttrLimit } from '../constants';
import {
  createUser,
  createItem,
  checkItem,
  filterItems,
} from '../utils';


test('create user', t => {
  t.plan(6);
  const user = createUser();
  t.ok(typeof user.level === 'number', 'user level should be a number');
  t.ok(user.level >= 1, 'user level should be greater than or equal to 1');
  t.ok(user.level <= 20, 'user level should be less than or equal to 20');
  t.ok(typeof user.job === 'string', 'user job should be a string');
  t.ok(
    ['Barbarian', 'Mage','Hunter'].indexOf(user.job) >= 0,
    'user job should be Barbarian, Mage or Hunter'
  );
  t.ok(typeof user.name === 'string', 'user name should be a string');
});

test('create item', t => {
  t.plan(12);
  const item = createItem();
  t.ok(typeof item.level === 'number', 'user level should be a number');
  t.ok(item.level >= 1, 'user level should be greater than or equal to 1');
  t.ok(item.level <= 20, 'user level should be less than or equal to 20');
  t.ok(typeof item.strength === 'number', 'user strength should be a number');
  t.ok(item.strength >= 0, 'user strength should be greater than or equal to 0');
  t.ok(typeof item.dexerity === 'number', 'user dexerity should be a number');
  t.ok(item.dexerity>= 0, 'user dexerity should be greater than or equal to 0');
  t.ok(typeof item.intelligence === 'number', 'user intelligence should be a number');
  t.ok(item.intelligence >= 0, 'user intelligence should be greater than or equal to 0');
  t.ok(typeof item.vitality === 'number', 'user vitality should be a number');
  t.ok(item.vitality >= 0, 'user vitality should be greater than or equal to 0');
  const sumOfAttrs =
    item.strength + item.dexerity + item.intelligence + item.vitality;
  t.ok(sumOfAttrs <= (item.level * itemAttrLimit));

});

test('filter items', t => {
  t.plan(1);
  const expected = [
    {
      level: 1,
      strength: 1,
      dexerity: 1,
      intelligence: 1,
      vitality: 1
    },
    {
      level: 1,
      strength: 2,
      dexerity: 0,
      intelligence: 1,
      vitality: 1
    }
  ];
  const items = filterItems([
    {
      level: 1,
      strength: 1,
      dexerity: 1,
      intelligence: 1,
      vitality: 1,
    },
    {
      level: 1,
      strength: 2,
      dexerity: 0,
      intelligence: 1,
      vitality: 1,
    },
    {
      level: 1,
      strength: 1,
      dexerity: 1,
      intelligence: 1,
      vitality: 1,
    },
    {
      level: 1,
      strength: 2,
      dexerity: 0,
      intelligence: 1,
      vitality: 1,
    },
  ]);
  t.deepEqual(items, expected, 'Items should be filtered');
});
