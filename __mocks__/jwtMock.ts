const base64 = require('base-64');
const header = {
  alg: 'HS256',
  typ: 'JWT',
};
const payload = {
  sub: 'test.email@yada.com',
  exp: Math.floor(Date.now() / 1000) + 1,
}; //This expires in 1 second from creation.

const base64Header = base64.encode(JSON.stringify(header));
const base64Payload = base64.encode(JSON.stringify(payload));

const fakeJWT = `${base64Header}.${base64Payload}.signature`;

export default fakeJWT;
