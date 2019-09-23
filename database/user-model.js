const db = require('../database/dbConfig.js');

module.exports = {
  add,
  find,
  findBy,
  findById,
  insert,
};

function find() {
  return db('users').select('id', 'username', 'password');
}

function findBy(filter) {
  return db('users').where(filter);
}

async function add(user) {
  const [id] = await db('users').insert(user);

  return findById(id);
}
function insert(user) {
  if(!user || !user.username || !user.password) return false;
  else return db('users').insert(user);
}

function findById(id) {
  return db('users')
    .where({ id })
    .first();
}
