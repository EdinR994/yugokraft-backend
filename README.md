### Start project on your local machine:
1. Use run-db.sh in database directory to run database
2. On first start you must run migrations (npm run knex:migrate:latest)   
3. Run npm start
4. You can check swagger api doc on /api

### For first setup you might want to load db backup:
1. docker exec -i <postgres_container_id> psql postgresql://postgres:postgres@localhost:5432/yugokraft < <backup_name>.sql

### Start project on remote server:
1. Generate ssl certificates and copy them into nginx/ssl directory
2. Make a copy of nginx.template.conf, name it nginx.conf, make changes and leave it in nginx directory
3. Copy admin and web frontend bundles to nginx/admin nginx/web folders 
4. docker-compose up --build -d

### You need to setup .env file:
- PORT (4000): NodeJs application port
- DATABASE_PORT (5432): PostgreSQL port
- DATABASE_USER (postgres): PostgreSQL user
- DATABASE_PASSWORD (postgres): PostgreSQL password
- DATABASE_DB (postgres): PostgreSQL DB name
- UPLOAD_FOLDER (upload): AWS S3 upload folder
- DIGITAL_OCEAN_S3_BUCKET_NAME (yugo-kraft): AWS S3 bucket name
- DIGITAL_OCEAN_ACCESS_KEY_ID (7YB3LLJVAAIN3Z3PTKH3): AWS S3 access key ID
- DIGITAL_OCEAN_SECRET_ACCESS_KEY (OWgl5vQRQqJx8ojFNVa7X3YpwCPOUr7u4LuyecYCIG0): AWS S3 access key
- DIGITAL_OCEAN_REGION (ams3): AWS S3 region
- DIGITAL_OCEAN_ENDPOINT (ams3.digitaloceanspaces.com): AWS S3 host
- ACL (public-read): ACL for AWS S3 bucket
- RESET_PASSWORD_TIMEOUT (120000): Timeout for resetting password
- SESSION_TIMEOUT (86400000): Timeout for session
- SENDGRID_KEY (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): Sendgrid API key
- SUPPORT_EMAIL (testyugokraft@gmail.com): Email address of support
- OWNER_REGISTRATION_SECRET (any random string): Secret token for owner registration API
- EMAIL_TEMPLATES_PATH (/usr/app/templates): Path to handlebars templates
- HOST (https://admin.yugokraft.de): URL of admin part of web site
- HOST_WEB (https://yugokraft.de): URL of web part of web site
- GOOGLE_APPLICATION_CREDENTIALS (/var/credentials/disco-outpost-294920.json): Path to google service account JSON key
- GOOGLE_PROJECT_ID (disco-outpost-294920): Google Project Id
- FROM_MAIL (info@yugokraft.de): Sendgrid email address of sender
- NODE_ENV (): If value equals "production", project will be started in production mode
- LOG_PATH (/var/log): Path tp mount nodejs logs docker volume

### Migrations control:

    http://knexjs.org/#Migrations-CLI

- npm run knex:migrate:make <migration_name> - create migration file
- npm run knex:migrate:latest - apply all migrations
- npm run knex:migrate:up - apply migrations by one
- npm run knex:migrate:list - list of all applied migrations
- npm run knex:migrate:rollback - remove all previously applied migrations
