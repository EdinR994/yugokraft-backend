
exports.up = function(knex) {
    return knex
        .schema
        .createTable('document_requests', tableBuilder => {
            tableBuilder.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
            tableBuilder.boolean('fulfilled').defaultTo(false);
            tableBuilder.uuid('candidate_id').references('candidates.id').onDelete('CASCADE');
            tableBuilder.uuid('employer_id').references('employers.id').onDelete('CASCADE');
            tableBuilder.timestamps(true, true);
        })
};

exports.down = function(knex) {
  return knex
      .schema
      .dropTable('document_requests')
};
