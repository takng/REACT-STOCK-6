// To reset the primary key in case of emergency: ALTER SEQUENCE users_id_seq RESTART WITH 1
exports.seed = function(knex, Promise) {
  return Promise.all([
    knex('users').insert({name: 'tak',
      email: 'tak@email.com',
      password: 'tak'}),
    knex('users').insert({name: 'kevin',
      email: 'kevin@email.com',
      password: 'kevin'}),
    knex('users').insert({name: 'ayesha',
      email: 'ayesha@email.com',
      password: 'ayesha'}),
  ]);
};

