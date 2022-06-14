import mongoose from 'mongoose';

const url = process.env.DB_URL;

const database = {

    connect: () => {
        // @ts-ignore
        mongoose.connect(url, (error) => {
            if(error) throw error;
            console.log('Connected to ', url);
        });
    }

}

export default database;