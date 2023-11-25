import { createServer } from 'http';
import { app } from './app.js';
import createDebug from 'debug';
import { dbConnect } from './services/db.connect.js';

const debug = createDebug('W7E:index');
const PORT = process.env.PORT || 3030; // La primera parte designa un puerto de manera estatica

const server = createServer(app);
debug('Starting server');

dbConnect()
  .then((mongoose) => {
    server.listen(PORT);
    debug('Connected to DB:', mongoose.connection.db.databaseName);
  })
  .catch((error) => server.emit(error));

server.on('listening', () => {
  console.log('Listening on port', PORT);
  debug('Listening on port', PORT);
});

server.on('error', (error) => {
  console.log(`Error ${error.message}`);
});
