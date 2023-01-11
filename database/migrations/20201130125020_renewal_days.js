exports.up = function(knex) {
    return knex
        .schema
        .createTable('renewal_days', (tableBuilder) => {
            tableBuilder.integer('id').primary()
            tableBuilder.integer('value')
        })
        .then(() =>
            knex
                .schema
                .alterTable('owners', (tableBuilder) => {
                    tableBuilder.dropColumn('renewal_period')
                })
        )
        .then(() =>
            knex('renewal_days')
                .insert({ id: 1, value: 14 })
        )
};

exports.down = function(knex) {
    return knex
        .schema
        .dropTable('renewal_days')
        .then(() =>
            knex
                .schema
                .alterTable('owners', (tableBuilder) => {
                    tableBuilder.integer('renewal_period').defaultTo(14)
                })
        )
};
