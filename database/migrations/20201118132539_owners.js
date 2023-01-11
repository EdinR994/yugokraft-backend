
exports.up = function(knex) {
    return knex
        .schema
        .createTable('owners', (tableBuilder) => {
            tableBuilder.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
            tableBuilder.text('email').notNullable().unique()
            tableBuilder.text('password')
        })
};

exports.down = function(knex) {
    return knex
        .schema
        .dropTable('owners')
};
