
exports.up = function(knex) {
  return knex
    .schema
    .createTable('employers', (tableBuilder) => {
      tableBuilder.uuid('id').primary();
      tableBuilder.text('name').notNullable();
      tableBuilder.text('company').notNullable();
      tableBuilder.text('email').notNullable().unique();
      tableBuilder.text('password');
      tableBuilder.integer('renewal_period').defaultTo(14);
      tableBuilder.boolean('active').defaultTo(false);
      tableBuilder.timestamps(true, true);
    })
};

exports.down = function(knex) {
  return knex
    .schema
    .dropTable('employers')
};
