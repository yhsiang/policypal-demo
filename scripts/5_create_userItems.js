import { MongoClient } from 'mongodb';
import {
  DB_URL,
  userItemLimit,
} from '../constants';
import { random } from '../utils';



MongoClient.connect(DB_URL, async (err, db) => {
  if (err) throw err;
  console.log("Connected correctly to server");
  const uiCol = db.collection('UserItems');
  const userCol = db.collection('Users');
  const itemCol = db.collection('Items');
  const users = await userCol.find().toArray();
  const items = await itemCol.find().toArray();
  const newUserItems = [];

  users.forEach(user => {
    const ui = Array
      .apply(null, new Array(random(userItemLimit)()))
      .map(() => {
        let item = items[random(items.length)()];
        while (item.level > user.level) {
          item = items[random(items.length)()];
        }
        return {
          // uid stand for user id
          uid: user._id,
          // iid stand for item id
          iid: item._id,
        };
      });
    newUserItems.push(...ui);
  });

  uiCol.insertMany(newUserItems, (err, result) => {
    if (err) throw err;
    console.log(result.insertedCount);
    db.close();
  });
});
