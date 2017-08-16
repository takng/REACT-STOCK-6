// To reset the primary key in case of emergency: ALTER SEQUENCE points_id_seq RESTART WITH 1

exports.seed = function(knex, Promise) {
  return Promise.all([
    knex('user_symbols').insert({user_id: 1,
      symbol: 'MSFT',
      favorite: 1
    }),

    knex('user_symbols').insert({user_id: 1,
      symbol: 'AAPL',
      favorite: 1
    }),

    knex('user_symbols').insert({user_id: 1,
      symbol: 'INTC',
      favorite: 1
    }),
    knex('user_symbols').insert({user_id: 2,
      symbol: 'MSFT',
      favorite: 1
    }),

    knex('user_symbols').insert({user_id: 2,
      symbol: 'AAPL',
      favorite: 1
    }),

    knex('user_symbols').insert({user_id: 2,
      symbol: 'INTC',
      favorite: 1
    }),
    knex('user_symbols').insert({user_id: 3,
      symbol: 'MSFT',
      favorite: 1
    }),

    knex('user_symbols').insert({user_id: 3,
      symbol: 'AAPL',
      favorite: 1
    }),

    knex('user_symbols').insert({user_id: 3,
      symbol: 'INTC',
      favorite: 1
    }),

  ]);
};

