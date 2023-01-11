
exports.up = async function(knex) {
    const [{ pg_typeof: type }, ...etc] = await knex('jobs')
        .select([
            knex.raw('pg_typeof("tillNow")')
        ])
        .limit(1);
    console.log(type)
    return type === 'boolean'
        ? Promise.resolve()
        : knex
            .schema
            .alterTable('jobs', tableBuilder => {
                tableBuilder.boolean('tillNow_bool')
            })
            .then(() => knex
                .raw('UPDATE jobs SET "tillNow_bool" = jobs."tillNow" IS NULL')
            )
            .then(() => knex
                .schema
                .alterTable('jobs', tableBuilder => {
                    tableBuilder.dropColumn('tillNow')
                    tableBuilder.renameColumn('tillNow_bool', 'tillNow')
                })
            )
};

exports.down = function(knex) {
    return Promise.resolve();
};
