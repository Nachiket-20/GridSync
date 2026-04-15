const https = require('https');

https.get('https://api.openf1.org/v1/car_data?session_key=latest', (res) => {
  let data = '';
  console.log('Status code:', res.statusCode);
  res.on('data', d => data += d);
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      console.log(JSON.stringify(json.slice(0, 2), null, 2));
    } catch(e) {
      console.log('Error parsing JSON:', e.message);
      console.log(data.slice(0, 500));
    }
  });
}).on('error', e => console.error(e));
