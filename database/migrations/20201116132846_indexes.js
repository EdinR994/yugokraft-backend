
exports.up = function(knex) {
  return knex
      .raw('ALTER TABLE candidates ALTER COLUMN "createdAt" TYPE timestamp with time zone')
      .then(() => knex.raw(`ALTER TABLE candidates ALTER COLUMN "dateOfBirth" TYPE date USING "dateOfBirth"::date`))
      .then(() => knex
          .schema
          .alterTable('candidates', (tableBuilder) => {
              tableBuilder.index('createdAt');
              tableBuilder.index('dateOfBirth');
      }))
      .then(() => knex
          .schema
          .alterTable('countries', (tableBuilder) => {
              tableBuilder.index('name');
              tableBuilder.index(['name', 'eu']);
          })
      )
      .then(() => knex
          .schema
          .alterTable('candidate_status', (tableBuilder) => {
              tableBuilder.index(['employer_id', 'status', 'candidate_id'])
          })
      )
      .then(() => knex
          .schema
          .alterTable('jobs', (tableBuilder) => {
              tableBuilder.index('candidateId')
              tableBuilder.index('jobPathWay')
          })
      )
      .then(() => knex
          .schema
          .alterTable('educations', (tableBuilder) => {
              tableBuilder.index('candidateId')
              tableBuilder.index('educationName')
          })
      )
      .then(() => knex
          .schema
          .alterTable('languages', (tableBuilder) => {
              tableBuilder.index('languageName')
              tableBuilder.index('candidateId')
          })
      )
      .then(() => knex
          .schema
          .alterTable('skills', (tableBuilder) => {
              tableBuilder.index('skillName')
              tableBuilder.index('candidateId')
          })
      )
};

exports.down = function(knex) {
    return Promise.resolve();
};
