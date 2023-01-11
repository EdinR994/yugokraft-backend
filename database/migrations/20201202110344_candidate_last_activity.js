
exports.up = function(knex) {
  return knex
      .schema
      .alterTable('candidates', (tableBuilder) => {
          tableBuilder.timestamp('last_activity').defaultTo(knex.raw('NOW()'));
      })
};

exports.down = function(knex) {
    return knex
        .schema
        .alterTable('candidates', (tableBuilder) => {
            tableBuilder.dropColumn('last_activity');
        })
};
