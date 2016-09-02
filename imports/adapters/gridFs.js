import { MongoInternals } from 'meteor/mongo';
import Grid from 'gridfs-stream';

const g = MongoInternals ? Grid( // eslint-disable-line new-cap
  MongoInternals.defaultRemoteCollectionDriver().mongo.db,
  MongoInternals.NpmModule
) : null;

export default g;
