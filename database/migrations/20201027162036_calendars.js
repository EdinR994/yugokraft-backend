
exports.up = function(knex) {
  return knex
      .schema
      .createTable('calendars', (tableBuilder) => {
          tableBuilder.uuid('id').primary()
          tableBuilder.uuid('employer_id').references('employers.id')
          tableBuilder.date('start').notNullable()
          tableBuilder.date('end').notNullable()
          tableBuilder.integer('interview_duration').notNullable()
          tableBuilder.boolean('exempt_holidays').defaultTo(true)
      })
      .then((_) => knex
          .schema
          .createTable('calendar_preferred_time', (tableBuilder) => {
              tableBuilder.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
              tableBuilder.uuid('calendar_id').references('calendars.id').onDelete('CASCADE')
              tableBuilder.time('from')
              tableBuilder.time('to')
          })
      )
};

exports.down = function(knex) {
  return knex
      .schema
      .dropTable('calendar_preferred_time')
      .then(_ => knex
          .schema
          .dropTable('calendars')
      )
};
