
exports.seed = function(knex) {
    // Deletes ALL existing entries
    return knex('countries')
        .then(function () {
            // Inserts seed entries
            return knex('countries').insert([
                {
                    name: 'Russia',
                    eu: false
                },
                {
                    name: 'Bulgaria',
                    eu: true
                },
                {
                    name: 'Portugal',
                    eu: true
                }
            ]);
        });
};
