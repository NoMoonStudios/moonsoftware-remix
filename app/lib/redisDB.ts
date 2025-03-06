import { createClient } from 'redis';

async function redisDB() {
    const client = await createClient();
    if (client.isOpen){
        return client;
    }
    await client.connect();
    return client;
}

export default redisDB