
exports.up = function(knex) {
    return knex
        .schema
        .createTable('tokens', (tableBuilder) => {
            tableBuilder.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));;
            tableBuilder.text('token')
            tableBuilder.jsonb('data')
            tableBuilder.timestamps(true, true)
        })
};

exports.down = function(knex) {
    return knex
        .schema
        .dropTable('tokens')
};

