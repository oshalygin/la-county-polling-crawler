/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  lastName: {
    type: String,
    required: true,
  },
  birthDate: {
    type: String,
    required: true,
  },
  houseNumber: {
    type: String,
    required: true,
  },
  userZipCode: {
    type: String,
    required: true,
  },
  createdDate: {
    type: Date,
    required: true,
  },
  addressAnchorLink: {
    type: String,
    required: true,
  },
  electionName: {
    type: String,
    required: true,
  },
  electionDate: {
    type: String,
    required: true,
  },
  hoursOfOperation: {
    type: String,
    required: true,
  },
  locationOne: {
    type: String,
    required: true,
  },
  locationTwo: {
    type: String,
    required: true,
  },
  street: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  zipCode: {
    type: String,
    required: true,
  },
  location: {
    type: Schema.Types.Mixed,
    required: true,
  },
});

userSchema.set('toJSON', {
  transform(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});

const model = mongoose.model('User', userSchema);

module.exports = model;
