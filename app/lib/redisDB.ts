import { createClient } from 'redis';

async function redisDB() {
    const client = await createClient({
        url: "redis://default:TTwyzrfblsrfhduzQUmRDjRTICylsVNp@switchyard.proxy.rlwy.net:37265"
    });
    if (client.isOpen){
        return client;
    }
    await client.connect();
    return client;
}

export default redisDB