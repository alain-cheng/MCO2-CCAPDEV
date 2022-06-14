import { MongoClient } from 'MongoDB';

const connectionString = process.env.MONGODB_URI;
const client = new MongoClient(connectionString);

export function connectToMongo(callback) {
    client.connect((err, client) => {
        if(err || !client) {
            return callback(err);
        }

        return callback();
    });
}

export function getDb(dbName = process.env.DB_NAME) {
    return client.db(dbName);
}

function signalHandler() {
    console.log("Closing mongodb connection...");
    client.close();
    process.exit();
}
process.on('SIGINT', signalHandler);
process.on('SIGTERM', signalHandler);
process.on('SIGQUIT', signalHandler);