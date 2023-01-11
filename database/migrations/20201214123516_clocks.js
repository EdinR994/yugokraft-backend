
exports.up = function(knex) {
    return knex
        .schema
        .createTable('clocks', (tableBuilder) => {
            tableBuilder.text('key').primary()
            tableBuilder.bigInteger('timeout')
            tableBuilder.text('type')
            tableBuilder.boolean('repeat')
            tableBuilder.text('event')
            tableBuilder.jsonb('event_data')
            tableBuilder.timestamp('updated_at', { useTz: true }).defaultTo(knex.raw('NOW()'))
        })
};

exports.down = function(knex) {
  return knex
      .schema
      .dropTable('clocks')
};
