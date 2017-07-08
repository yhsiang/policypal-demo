import { MongoClient } from 'mongodb';
import { DB_URL } from '../constants';
import { createUser } from '../utils';

MongoClient.connect(DB_URL, (err, db) => {
  if (err) throw err;
  console.log("Connected correctly to server");
  const userCol = db.collection('users');
  const newUsers = Array.apply(null, Array(10)).map(() => createUser());
  userCol.insertMany(newUsers, (err, result) => {
    if (err) throw err;
    console.log(result.insertedCount);
    db.close();
  });
});
