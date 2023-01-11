
exports.up = function(knex) {
    return knex
        .schema
        .alterTable('candidates', (tableBuilder) => {
            tableBuilder.dropColumn('country')
        })
};

exports.down = function(knex) {
    return knex
        .schema
        .alterTable('candidates', (tableBuilder) => {
            tableBuilder.text('country')
        })
};
