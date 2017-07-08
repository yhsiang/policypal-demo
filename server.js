import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import {
  PORT,
  DB_URL,
  jobList,
  itemQueryPatterns,
} from './constants';
import {
  firstCapital,
   getUserPoint,
} from './utils';

const app = express();

/*
  level: required
  job: required
  limit: optional
  strength:optional
  dexerity: optional
  intelligence: optional
  vitality: optional
*/
app.get('/items', (req, res) => {
  const {
    level,
    job,
    limit,
    strength,
    dexerity,
    intelligence,
    vitality,
  } = req.query;
  if (!level) {
    return res.json({ message: 'level is required.'});
  }
  if (!job || jobList.indexOf(firstCapital(job)) === -1) {
    return res.json({ message: 'job is required.'});
  }
  const prepare = { level, strength, dexerity, intelligence, vitality };
  const query = Object
    .keys(prepare)
    .reduce((acc, cur) => {
      if (prepare[cur]) {
        acc[cur] = { $gte: Number(prepare[cur]) };
      }
      return acc;
    }, {})
  MongoClient.connect(DB_URL, async (err, db) => {
    if (err) return res.send(err);
    const itemCol = db.collection('Items');
    const items = await itemCol
      .find(query)
      .sort(itemQueryPatterns[job])
      .limit(Number(limit || 0))
      .toArray();
    db.close();
    return res.json(items);
  });
});

/*
  level: required (Item level)
  job: required
  limit: optional
*/
app.get('/users', (req, res) => {
  const {
    level,
    job,
    limit,
  } = req.query;
  // FIXME: create params handler in the future to reduce duplicated code.
  if (!level) {
    return res.json({ message: 'level is required.'});
  }
  if (!job || jobList.indexOf(firstCapital(job)) === -1) {
    return res.json({ message: 'job is required.'});
  }
  MongoClient.connect(DB_URL, async (err, db) => {
    // FIXME: better error handling in the future.
    if (err) return res.send(err);
    const userCol = db.collection('Users');
    const uiCol = db.collection('UserItems');
    const itemCol = db.collection('Items');
    const users = await userCol
      .find({ job: firstCapital(job) })
      .toArray();
    const userIds = users.map(u => ObjectId(u._id));
    // Find record of user items
    const userItems = await uiCol
      .find({ uid: { $in: userIds } })
      .toArray();
    const itemIds = userItems
      .map(ui => ObjectId(ui.iid))
      .reduce((acc, cur) => {
        if (acc.indexOf(cur) === -1) {
          acc.push(cur);
        }
        return acc;
      }, []);
    // Find related items
    const items = await itemCol
      .find({ _id: { $in: itemIds }})
      .toArray();
    // Trick for easy getting item
    const itemMapping = items
      .reduce((acc, cur) => {
        acc[cur._id] = cur;
        return acc;
      }, {});

    // Prepare { job, items } to calculate user point
    let response = users
      .map(u => {
        u.items = userItems
          .filter(ui => `${ui.uid}` === `${u._id}`) // trick
          .map(ui => itemMapping[ui.iid]);
        u.point = getUserPoint(u);
        return u;
      })
      .sort((p, n) => n.point - p.point);

    if (limit) {
      response = response.slice(0, Number(limit));
    }

    db.close();
    return res.json(response);
  });
});

app.listen(PORT, () => console.log(`Server listen on ${PORT}`));
