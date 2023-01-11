
exports.up = function(knex) {
  return knex
      .raw(`
        UPDATE candidates SET "dateOfBirth" =
            CASE
                WHEN split_part("dateOfBirth", '-', 2) = 'Decembar' THEN concat(split_part("dateOfBirth", '-', 1), '-', '12', '-', split_part("dateOfBirth", '-', 3))::timestamptz
                WHEN split_part("dateOfBirth", '-', 2) = 'Januar' THEN concat(split_part("dateOfBirth", '-', 1), '-', '1', '-', split_part("dateOfBirth", '-', 3))::timestamptz
                WHEN split_part("dateOfBirth", '-', 2) = 'Februar' THEN concat(split_part("dateOfBirth", '-', 1), '-', '2', '-', split_part("dateOfBirth", '-', 3))::timestamptz
                WHEN split_part("dateOfBirth", '-', 2) = 'März' THEN concat(split_part("dateOfBirth", '-', 1), '-', '3', '-', split_part("dateOfBirth", '-', 3))::timestamptz
                WHEN split_part("dateOfBirth", '-', 2) = 'Mart' THEN concat(split_part("dateOfBirth", '-', 1), '-', '3', '-', split_part("dateOfBirth", '-', 3))::timestamptz
                WHEN split_part("dateOfBirth", '-', 2) = 'April' THEN concat(split_part("dateOfBirth", '-', 1), '-', '4', '-', split_part("dateOfBirth", '-', 3))::timestamptz
                WHEN split_part("dateOfBirth", '-', 2) = 'Maj' THEN concat(split_part("dateOfBirth", '-', 1), '-', '5', '-', split_part("dateOfBirth", '-', 3))::timestamptz
                WHEN split_part("dateOfBirth", '-', 2) = 'Juni' THEN concat(split_part("dateOfBirth", '-', 1), '-', '6', '-', split_part("dateOfBirth", '-', 3))::timestamptz
                WHEN split_part("dateOfBirth", '-', 2) = 'Juli' THEN concat(split_part("dateOfBirth", '-', 1), '-', '7', '-', split_part("dateOfBirth", '-', 3))::timestamptz
                WHEN split_part("dateOfBirth", '-', 2) = 'August' THEN concat(split_part("dateOfBirth", '-', 1), '-', '8', '-', split_part("dateOfBirth", '-', 3))::timestamptz
                WHEN split_part("dateOfBirth", '-', 2) = 'Septembar' THEN concat(split_part("dateOfBirth", '-', 1), '-', '9', '-', split_part("dateOfBirth", '-', 3))::timestamptz
                WHEN split_part("dateOfBirth", '-', 2) = 'Oktober' THEN concat(split_part("dateOfBirth", '-', 1), '-', '10', '-', split_part("dateOfBirth", '-', 3))::timestamptz
                WHEN split_part("dateOfBirth", '-', 2) = 'Oktobar' THEN concat(split_part("dateOfBirth", '-', 1), '-', '10', '-', split_part("dateOfBirth", '-', 3))::timestamptz
                WHEN split_part("dateOfBirth", '-', 2) = 'Novembar' THEN concat(split_part("dateOfBirth", '-', 1), '-', '11', '-', split_part("dateOfBirth", '-', 3))::timestamptz
                WHEN "dateOfBirth" = '1976-08- 2T00:00:00.506Z' THEN '1976-08-02'::timestamptz
                WHEN "dateOfBirth" = '1999-03-0T00:00:00.506Z' THEN '1999-03-01'::timestamptz
                WHEN "dateOfBirth" = '1999-02-31T00:00:00.506Z' THEN '1999-03-03'::timestamptz
                WHEN "dateOfBirth" = '1986-06- 2T00:00:00.506Z' THEN '1986-06-02'::timestamptz
                WHEN "dateOfBirth" = '1983-02-0T00:00:00.506Z' THEN '1983-02-01'::timestamptz
                WHEN "dateOfBirth" = '1992-07- 5T00:00:00.506Z' THEN '1992-07-05'::timestamptz
            END
        WHERE "dateOfBirth" ~ '^\\d{4}-\\w+-\\d{1,2}$' 
        OR "dateOfBirth" = '1976-08- 2T00:00:00.506Z'
        OR "dateOfBirth" = '1999-03-0T00:00:00.506Z'
        OR "dateOfBirth" = '1999-02-31T00:00:00.506Z'
        OR "dateOfBirth" = '1986-06- 2T00:00:00.506Z'
        OR "dateOfBirth" = '1983-02-0T00:00:00.506Z'
        OR "dateOfBirth" = '1992-07- 5T00:00:00.506Z'
      `)
};

exports.down = function(knex) {
  return Promise.resolve();
};
