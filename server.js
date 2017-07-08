import express from 'express';
import {
  PORT,
  DB_URL,
  jobList,
  itemQueryPatterns,
} from './constants';
import { MongoClient } from 'mongodb';

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
  if (!level) return res.json({ message: 'level is required.'});
  if (!job || jobList.indexOf(job) === -1) return res.json({ message: 'job is required.'});
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
    const itemCol = db.collection('items');
    const items = await itemCol
      .find(query)
      .sort(itemQueryPatterns[job])
      .limit(Number(limit || 0))
      .toArray();
    return res.json(items);
  });
});

app.listen(PORT, () => console.log(`Server listen on ${PORT}`));
