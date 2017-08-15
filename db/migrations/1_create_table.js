exports.up = function(knex, Promise) {
  return knex.schema
    .createTable('users', function (table) {
      table.increments('id');
      table.string('name');
      table.string('email');
      table.string('password');
    })
    .createTable('user_symbols', function (table) {
      table.increments('id');
      table.integer('user_id').references('users.id');
      table.string('symbol');
      table.boolean('favorite');
    })
};

exports.down = function(knex, Promise) {
  return knex.schema
    .dropTable('user_symbols')
    .dropTable('users')
};

