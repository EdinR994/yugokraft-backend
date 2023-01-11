
exports.up = async function(knex) {
  const [{ pg_typeof: type }, ...etc] = await knex('polls')
      .select([
          knex.raw('pg_typeof(available)')
      ])
      .limit(1);
  return type === 'boolean'
      ? Promise.resolve()
      : knex.transaction(trx => trx.raw(`
    UPDATE polls SET available =
        CASE 
            WHEN available = 'Nein' THEN 'false'
            WHEN available = 'Ne' THEN 'false'
            WHEN available = 'no' THEN 'false'
            WHEN available = 'string' THEN 'false'
            WHEN available = 'Da' THEN 'true'
            WHEN available = 'Ja' THEN 'true'
            WHEN available = 'yes' THEN 'true'
            ELSE available
        END;
        
    ALTER TABLE polls
        ADD COLUMN available_clone boolean DEFAULT false;
        
    UPDATE polls SET available_clone = true WHERE available = 'true';

    ALTER TABLE polls
        DROP COLUMN available;
        
    ALTER TABLE polls
        ADD COLUMN available boolean DEFAULT false;
        
    UPDATE polls SET available = true WHERE available_clone;

    ALTER TABLE polls
        DROP COLUMN available_clone;
  `))
};

exports.down = function(knex) {
    return Promise.resolve();
};
