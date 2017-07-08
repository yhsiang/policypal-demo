import { MongoClient } from 'mongodb';
import { DB_URL } from '../constants';
import { createItem, filterItems } from '../utils';

MongoClient.connect(DB_URL, (err, db) => {
  if (err) throw err;
  console.log("Connected correctly to server");
  const itemCol = db.collection('items');
  const newItems = Array.apply(null, Array(20)).map((_, i) => createItem(i + 1));
  const otherItems = Array.apply(null, Array(20)).map((_, i) => createItem(i + 1));
  // step 3
  const items = filterItems([...newItems, ...otherItems]);
  itemCol.insertMany(items, (err, result) => {
    if (err) throw err;
    console.log(result.insertedCount);
    db.close();
  });
});
