import { MongoClient, Db } from 'mongodb';

declare global {
    // allow global cache across hot-reloads in development
    // eslint-disable-next-line no-var
    var __mongo__: { client: MongoClient; db: Db } | undefined;
}

let cached = (global as any).__mongo__ as { client: MongoClient; db: Db } | undefined;

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
    const uri = process.env.NEXT_PUBLIC_MONGODB_URI;
    if (!uri) {
        throw new Error('Please define the MONGODB_URI (or MONGO_URI) environment variable.');
    }

    if (cached) {
        return cached;
    }

    const client = new MongoClient(uri);
    await client.connect();

    const dbName = process.env.NEXT_PUBLIC_MONGODB_DB;
    const db = dbName ? client.db(dbName) : client.db();

    cached = { client, db };
    // @ts-ignore
    global.__mongo__ = cached;

    return cached;
}
