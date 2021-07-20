import axios from 'axios';
import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

(async () => {
  const query = {
    query: {
      model: 'm3',
      condition: 'new',
      options: {},
      arrangeBy: 'Year',
      order: 'desc',
      market: 'US',
      language: 'en',
      super_region: 'north america',
      lng: -75.1749671,
      lat: 39.9531865,
      zip: '19130',
      range: 200,
      region: 'PA',
    },
    offset: 0,
    count: 50,
    outsideOffset: 0,
    outsideSearch: false,
  };

  const params = {
    query: JSON.stringify(query),
  };

  const data = (await axios.get('https://www.tesla.com/inventory/api/v1/inventory-results', {
    params,
  })).data;

  const totalMatches = data['total_matches_found'];

  if (totalMatches < 1) {
    return;
  }

  await client.messages.create({
    body: 'A car has been found',
    from: '+16788258973',
    to: '+19179915809',
  })
})();
