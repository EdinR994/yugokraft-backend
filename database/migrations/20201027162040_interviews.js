
exports.up = function(knex) {
  return knex
      .schema
      .createTable('interviews', (tableBuilder) => {
          tableBuilder.uuid('id').primary()
          tableBuilder.uuid('candidate_id').references('candidates.id').onDelete('CASCADE')
          tableBuilder.uuid('employer_id').references('employers.id').onDelete('CASCADE')
          tableBuilder.uuid('calendar_id').references('calendars.id').nullable().onDelete('SET NULL')
          tableBuilder.date('date')
          tableBuilder.time('from')
          tableBuilder.time('to')
      });
};

exports.down = function(knex) {
  return knex
      .schema
      .dropTable('interviews');
};
