
exports.up = function(knex) {
  return knex
      .schema
      .alterTable('interviews', (tableBuilder) => {
          tableBuilder.jsonb('data')
      })
};

exports.down = function(knex) {
    return knex
        .schema
        .alterTable('interviews', (tableBuilder) => {
            tableBuilder.dropColumn('data')
        })
};
