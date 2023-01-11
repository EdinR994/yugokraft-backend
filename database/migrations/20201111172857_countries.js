
exports.up = function(knex) {
  return knex
      .schema
      .createTable('countries', (tableBuilder) => {
          tableBuilder.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
          tableBuilder.boolean('eu').notNullable()
          tableBuilder.text('name').notNullable().unique()
      })
      .then(() => knex('countries')
          .insert([
              {
                  name: 'Other',
                  eu: false
              },
              {
                  name: 'Belarus',
                  eu: false
              },
              {
                  name: 'Bosnia–Herzegovina',
                  eu: false
              },
              {
                  name: 'Estonia',
                  eu: true
              },
              {
                  name: 'Kosovo',
                  eu: false
              },
              {
                  name: 'Croatia',
                  eu: true
              },
              {
                  name: 'Moldova',
                  eu: false
              },
              {
                  name: 'Montenegro',
                  eu: false
              },
              {
                  name: 'North Macedonia',
                  eu: false
              },
              {
                  name: 'Serbia',
                  eu: false
              },
              {
                  name: 'Ukraine',
                  eu: false
              },
              {
                  name: 'Cyprus',
                  eu: true
              },
              {
                  name: 'Latvia',
                  eu: true
              },
              {
                  name: 'Lithuania',
                  eu: true
              },
              {
                  name: 'Romania',
                  eu: true
              },
              {
                  name: 'Slovakia',
                  eu: true
              }
          ])
      )
      .then(() => knex
          .schema
          .alterTable('candidates', (tableBuilder) => {
              tableBuilder.uuid('countryId').references('countries.id').onDelete('SET NULL')
          })
      )
      .then(() => knex
          .raw(`
            UPDATE candidates 
            SET "countryId" = countries.id
            FROM countries
            WHERE countries.name = CASE
                WHEN candidates.country = 'Anderes' THEN 'Other'
                WHEN candidates.country = 'Bosnien-Herzegowina' THEN 'Bosnia–Herzegovina'
                WHEN candidates.country = 'Kroatien' THEN 'Croatia'
                WHEN candidates.country = 'Nordmazedonien' THEN 'North Macedonia'
                WHEN candidates.country = 'Serbien' THEN 'Serbia'
                ELSE candidates.country
            END;
          `)
      )
};

exports.down = function(knex) {
  return knex
      .schema
      .alterTable('candidates', (tableBuilder) => {
          tableBuilder.dropColumn('countryId')
      })
      .then(() => knex
          .schema
          .dropTable('countries')
      )
};
