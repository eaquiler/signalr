import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import * as jwt from "jsonwebtoken";

export async function negotiate(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    const connectionString = process.env.SignalRConnectionString;
    const hub = process.env.SignalRHub;

    const endpoint = /Endpoint=(.*?);/.exec(connectionString)[1];
    const accessKey = /AccessKey=(.*?);/.exec(connectionString)[1];
    const url = `${endpoint}/client/?hub=${hub}`;
    const token = jwt.sign({ aud: url }, accessKey, { expiresIn: 3600 });
    return { jsonBody: { url: url, accessToken: token } };
};

app.http('negotiate', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: negotiate
});