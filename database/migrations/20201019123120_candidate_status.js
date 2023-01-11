exports.up = function(knex) {
  return knex.schema
      .createTable('candidate_status', (tableBuilder) => {
          tableBuilder.uuid('id').defaultTo(knex.raw('uuid_generate_v4()'))
          tableBuilder.uuid('candidate_id').references('candidates.id').onDelete('CASCADE')
          tableBuilder.uuid('employer_id').references('employers.id').onDelete('CASCADE')
          tableBuilder.enum('status', [
              0,
              1,
              2,
              3,
              4,
              5,
              6,
              7
          ]).defaultTo(0)
      })
      .then(() => knex
          .raw(`
            CREATE OR REPLACE FUNCTION update_candidate_status()
                RETURNS TRIGGER
                LANGUAGE PLPGSQL
                AS
            $$
            BEGIN
                INSERT INTO candidate_status (candidate_id, employer_id)
                SELECT id as candidate_id, NEW.id as employer_id
                FROM candidates;
                RETURN NEW;
            END
            $$
          `)
      )
      .then(() => knex
          .raw(`
            CREATE TRIGGER candidate_status_update 
            AFTER INSERT 
            ON employers
            FOR EACH ROW
            EXECUTE PROCEDURE update_candidate_status()
          `)
      )
};

exports.down = function(knex) {
    return knex.raw('DROP TRIGGER candidate_status_update ON employers')
        .then(() => knex.raw(
            'DROP FUNCTION update_candidate_status'
        ))
        .then(() => knex.schema.dropTable('candidate_status'))
};
