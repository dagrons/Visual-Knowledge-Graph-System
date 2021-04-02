// config 
const neo4j_ip_addr = '172.29.236.17';
const neo4j_port = '7687';
const listen_port = '3000';
const username = 'neo4j';
const password = 'daxiahyh';

// imports
const Koa = require('koa');
const cors = require('koa2-cors'); // plugin for cors

// Koa
const app = new Koa()
app.use(cors()); // use cors to bypass protection from browsers
app.use(async ctx => {
    const query = ctx.query.query;
    const neo4j = require('neo4j-driver');
    const driver = neo4j.driver(`bolt://${neo4j_ip_addr}:${neo4j_port}`, neo4j.auth.basic(username, password));
    const session = driver.session();
    try { // fetch res from ndeo4j
        const results = await session.run(query, {});
        ctx.body = results;
    } finally {
        await session.close();
    }
    await driver.close();
});

app.listen(listen_port, neo4j_ip_addr); console.log("listenning: " + 3000);