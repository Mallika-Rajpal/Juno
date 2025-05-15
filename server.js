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

  // Handler for Women Rights Basics intent
  function handleLegalRights(agent) {
    const right = agent.parameters.Legal_Right || 'legal rights';

    if (right.toLowerCase().includes('safety')) {
      agent.add('Women have the right to file an FIR at any police station, and must be assisted by a female officer.');
    } else if (right.toLowerCase().includes('workplace')) {
      agent.add('You are protected under the Sexual Harassment of Women at Workplace Act, 2013.');
    } else {
      agent.add(`Here’s what I found about your rights: ${right}`);
    }
  }

  // Handler for Report Harassment intent
  function handleReportHarassment(agent) {
    const harassmentType = agent.parameters.Harassment_Type || 'harassment';
    const personInvolved = agent.parameters.Person_Involved || 'someone';
    const location = agent.parameters.Location_Keyword || 'unknown location';
    const time = agent.parameters.Time_Reference || 'unknown time';

    agent.add(`You reported a ${harassmentType} involving ${personInvolved} at ${location} around ${time}. Authorities are here to support you.`);
  }

  // Handler for Emergency Service intent
  function handleEmergencyService(agent) {
    const emergencyType = agent.parameters.Emergency_Service || 'emergency';
    const location = agent.parameters.Location_Keyword || 'your location';

    agent.add(`Emergency services for ${emergencyType} have been alerted at ${location}. Help is on the way.`);
  }

  // Default fallback handler
  function fallback(agent) {
    agent.add("Sorry, I didn't get that. Can you please rephrase?");
  }

  // Map intents to handlers
  let intentMap = new Map();
  intentMap.set('Women_Rights_Basics', handleLegalRights);
  intentMap.set('ReportHarassment', handleReportHarassment);
  intentMap.set('Emergency_Service', handleEmergencyService);
  intentMap.set('Default Fallback Intent', fallback);

  agent.handleRequest(intentMap);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Webhook server is live on port ${PORT}`);
});
