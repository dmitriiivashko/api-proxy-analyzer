import { Mongo } from 'meteor/mongo';

const Calls = new Mongo.Collection('tasks');
export { Calls as default };
