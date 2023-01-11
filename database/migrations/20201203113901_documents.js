
exports.up = function(knex) {
    return knex
        .schema
        .alterTable('documents', (tableBuilder) => {
            tableBuilder.uuid('category_id').references('document_categories.id')
            tableBuilder.dropColumn('additional')
            tableBuilder.text('path')
            tableBuilder.integer('version')
        })
        .then(() => knex
            .raw(`
                UPDATE
                    documents
                SET
                    category_id = (SELECT id FROM document_categories WHERE name = 'Other'),
                    name = concat(split_part(split_part(name, substring (name from '.\\w+.$' ), 1), 'upload/', 2), '_', replace("createdAt"::date::text, '-', '_'), '_', 'other', substring (name from '.\\w+.$' )),
                    path = concat('https://', 'yugo-kraft.ams3.digitaloceanspaces.com'::text, '/', regexp_replace(encode(documents."name"::bytea,'hex'),'(..)',E'%\\\\1','g')),
                    version = 1
            `)
        )
};

exports.down = function(knex) {
  return knex
      .schema
      .alterTable('documents', (tableBuilder) => {
          tableBuilder.dropColumn('category_id')
      })
};
