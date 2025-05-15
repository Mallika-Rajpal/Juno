const express = require('express');
const bodyParser = require('body-parser');
const { WebhookClient } = require('dialogflow-fulfillment');

const app = express();
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('🧠 Juno Webhook is Live!');
});

app.post('/webhook', (req, res) => {
  const agent = new WebhookClient({ request: req, response: res });

  function handleLegalRights(agent) {
    const right = agent.parameters.Legal_Right || 'legal rights';
    
    if (right.toLowerCase().includes('safety')) {
      agent.add('Women have the right to file an FIR at any police station, and must be assisted by a female officer.');
    } else if (right.toLowerCase().includes('workplace')) {
      agent.add('You are protected under the Sexual Harassment of Women at Workplace Act, 2013.');
    } else {
      agent.add(`Here's what I found about your rights: ${right}`);
    }
  }

  let intentMap = new Map();
  intentMap.set('Women_Rights_Basics', handleLegalRights);
  agent.handleRequest(intentMap);
});

app.listen(3000, () => {
  console.log('Webhook server is live on port 3000');
});
