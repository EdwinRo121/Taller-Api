const { Client } = require('pg');

const client = new Client({
  host: 'aws-0-us-east-2.pooler.supabase.com',
  user: 'postgres.uzlqdowbjhguzuaiekzy',
  password: '3114762052*',
  database: 'postgres',
  port: 5432,
});

client.connect()
  .then(() => console.log(' Conectado a Base de datos'))
  .catch(err => console.error('Error al conectar a PostgreSQL', err));

module.exports = client;