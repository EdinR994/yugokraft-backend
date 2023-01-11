
exports.up = function(knex) {
    return knex
        .schema
        .alterTable('candidates', (tableBuilder) => {
            tableBuilder.boolean('expired').defaultTo(false);
        })
};

exports.down = function(knex) {
    return knex
        .schema
        .alterTable('candidates', (tableBuilder) => {
            tableBuilder.dropColumn('expired');
        })
};
