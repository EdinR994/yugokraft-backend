
exports.up = function(knex) {
    return knex
        .schema
        .createTable('document_categories', (tableBuilder) => {
            tableBuilder.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
            tableBuilder.text('name')
        })
        .then(() => knex('document_categories').insert([
            {
                name: 'Other'
            },
            {
                name: 'CV'
            },
            {
                name: 'CVTranslatedInGermanOrEnglish'
            },
            {
                name: 'Diploma'
            },
            {
                name: 'DiplomaTranslatedInGermanOrEnglish'
            },
            {
                name: 'Certificates'
            },
            {
                name: 'CertificatesTranslatedInGermanOrEnglish'
            },
            {
                name: 'References'
            },
            {
                name: 'ReferencesTranslatedInGermanOrEnglish'
            },
            {
                name: 'BiometricPhoto'
            },
            {
                name: 'ValidPassport'
            }
        ]))
};

exports.down = function(knex) {
    return knex
        .schema
        .dropTable('document_categories')
};
