import mongoose from 'mongoose';

const url = process.env.DB_URL || 'mongodb+srv://user:W4vlm1o6khDkh0Z0@cluster0.wqulwpm.mongodb.net/Prof2Pick?retryWrites=true&w=majority';

const database = {

    connect: () => {
        // @ts-ignore
        mongoose.connect(url, {useNewUrlParser: true})
            .then(connect => console.log('connected to mongodb...'))
            .catch(err => console.log('error occured when connecting to mongodb...', err));
    },

    insertOne: (model, document, callback) => {
        model.create(document, (err, result) => {
            if(err) return callback(false);
            console.log('Added', result);
            return callback(true);
        });
    },

    insertMany: (model, documents, callback) => {
        model.insertMany(documents, (err, result) => {
            if(err) return callback(false);
            console.log('Added', result);
            return callback(true);
        })
    },

    findOne: (model, query, projection, callback) => {
        model.findOne(query, projection, (err, result) => {
            if(err) return callback(false);
            return callback(result);
        });
    },

    findMany: (model, query, projection, callback) => {
        model.find(query, projection, (err, result) => {
            if(err) return callback(false);
            return callback(result);
        });
    },

    updateOne: (model, filter, update, callback) => {
        model.updateOne(filter, update, (err, result) => {
            if(err) return callback(false);
            console.log('Updated', result.nModified);
            return callback(true);
        });
    },

    updateMany: (model, filter, update, callback) => {
        model.updateMany(filter, update, (err, result) => {
            if(err) return callback(false);
            console.log('Updated multiple', result.nModified);
            return callback(true);
        });
    },

    deleteOne: (model, conditions, callback) => {
        model.deleteOne(conditions, (err, result) => {
            if(err) return callback(false);
            console.log('Deleted', result.deletedCount);
            return callback(true);
        });
    },

    deleteMany: (model, conditions, callback) => {
        model.deleteMany(conditions, (err, result) => {
            if(err) return callback(false);
            console.log('Deleted', result.deletedCount);
        });
    }

}

export default database;