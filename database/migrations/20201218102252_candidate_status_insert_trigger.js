exports.up = function(knex) {
    return  knex
              .raw(`
              CREATE OR REPLACE FUNCTION set_candidate_status()
                  RETURNS TRIGGER
                  LANGUAGE PLPGSQL
                  AS
              $$
              BEGIN
                  INSERT INTO candidate_status (candidate_id, employer_id)
                  SELECT NEW.id as candidate_id, id as employer_id 
                  FROM employers;
                  RETURN NEW;
              END
              $$
            `)
        .then(() => knex
            .raw(`
            CREATE TRIGGER set_candidate_status 
            AFTER INSERT 
            ON candidates
            FOR EACH ROW
            EXECUTE PROCEDURE set_candidate_status()
          `)
        )
};

exports.down = function(knex) {
    return knex.raw('DROP TRIGGER set_candidate_status ON candidates')
        .then(() => knex.raw(
            'DROP FUNCTION set_candidate_status'
        ))
};
