const User = require('./userModel');

async function save(model) {
  const user = new User({
    ...model,
  });

  const savedUser = await user.save();
  return savedUser;
}

async function findOneAndUpdate(model) {
  const user = new User({
    ...model,
  });

  await user.collection.findOneAndUpdate(
    {
      lastName: user.lastName,
      birthDate: user.birthDate,
      locationOne: user.locationOne,
    },
    {
      $set: {
        ...model,
        createdDate: new Date().valueOf(),
      },
    },
    {
      upsert: true,
      setDefaultsOnInsert: true,
      new: true,
    },
  );
}

const userDAL = {
  save,
  findOneAndUpdate,
};

module.exports = userDAL;
