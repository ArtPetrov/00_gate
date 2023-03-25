import Hapi from '@hapi/hapi';
import Joi from 'joi';
import {createHmac} from 'node:crypto';

process.on('unhandledRejection', (err) => {
  console.error(err);
  process.exit(1);
});

const algo = process.env.ALGO;
const secret = process.env.SECRET;

if (typeof secret === 'undefined') {
  console.error(`no secret specified`);
  process.exit(1);
}

const server = Hapi.server({
  port: 9000,
  host: '0.0.0.0',
});

server.route({
  method: 'POST',
  path: '/',
  handler: (request, h) => {
    const hmac = createHmac(algo, secret);
    hmac.update(request.payload.data, 'utf8');

    return {
      statusCode: 200,
      error: null,
      message: 'ok',
      hmac: hmac.digest('base64url'),
    };
  },
  options: {
    validate: {
      payload: Joi.object({
        data: Joi.string()
      }),
    },
  },
})

await server.start();
console.info(`server started on ${server.info.uri}`);

