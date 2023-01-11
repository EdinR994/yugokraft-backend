
exports.up = function(knex) {
    return knex
        .schema
        .createTable('statistics', (tableBuilder) => {
            tableBuilder.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
            tableBuilder.text('key')
            tableBuilder.jsonb('data')
            tableBuilder.date('created_at').defaultTo(knex.raw('current_date'))
        })
};

exports.down = function(knex) {
    return knex
        .schema
        .dropTable('statistics')
};
