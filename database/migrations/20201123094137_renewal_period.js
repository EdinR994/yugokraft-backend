
exports.up = function(knex) {
  return knex
      .schema
      .alterTable('employers', (tableBuilder) => {
          tableBuilder.dropColumn('renewal_period')
      })
      .then(() => knex
          .schema
          .alterTable('owners', (tableBuilder) => {
              tableBuilder.integer('renewal_period').defaultTo(14)
          })
      )
};

exports.down = function(knex) {
    return knex
        .schema
        .alterTable('owners', (tableBuilder) => {
            tableBuilder.dropColumn('renewal_period')
        })
        .then(() => knex
            .schema
            .alterTable('employers', (tableBuilder) => {
                tableBuilder.integer('renewal_period').defaultTo(14)
            })
        )
};
