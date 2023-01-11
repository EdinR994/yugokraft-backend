
exports.up = function(knex) {
  return knex
      .schema
      .alterTable('candidates', (tableBuilder) => {
          tableBuilder.integer('age').defaultTo(18)
          tableBuilder.index('age')
      })
      .then(() => knex.raw(`
            CREATE FUNCTION update_age() RETURNS trigger AS $update_age$
                BEGIN
                    NEW.age := date_part('year', age(current_date, NEW."dateOfBirth"));
                    RETURN NEW;
                END;
            $update_age$ LANGUAGE plpgsql;
    
            CREATE TRIGGER update_age BEFORE INSERT OR UPDATE ON candidates
                FOR EACH ROW EXECUTE PROCEDURE update_age();
      `))
      .then(() => knex('candidates')
          .update({
              age: knex.raw('date_part(\'year\', age(current_date, candidates."dateOfBirth"))')
          })
      )
};

exports.down = function(knex) {
    return knex
        .raw(`
            DROP TRIGGER update_age ON candidates;
            DROP FUNCTION update_age;
        `)
        .then(() => knex
            .schema
            .alterTable('candidates', (tableBuilder) => {
                tableBuilder.dropIndex('age')
                tableBuilder.dropColumn('age')
            })
        )
};
