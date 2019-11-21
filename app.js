/**
 * Copyright 2017, Google, Inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';
const {PubSub} = require('@google-cloud/pubsub');
const { Datastore } = require('@google-cloud/datastore');
const keyFilename = 'dataStorageKeyfile.json'

// [START gae_flex_quickstart]
const express = require('express');

const app = express();

// Instantiate a pubsub client
// const authClient = new OAuth2Client();
const pubsub = new PubSub();

const datastore = new Datastore({
  projectId: 'argon-rider-259315',
  keyFilename
});

// List of all messages received by this instance
const messages = [];
const claims = [];
const tokens = [];

// The following environment variables are set by app.yaml when running on GAE,
// but will need to be manually set when running locally.
const {PUBSUB_VERIFICATION_TOKEN} = process.env;
const TOPIC = process.env.PUBSUB_TOPIC;

const topic = pubsub.topic(TOPIC);

const path = require('path');

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res
    .status(200)
    .send('Hello, world!')
    .end();
});

app.get('/submit', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/form.html'));
});

app.post('/submit', async (req, res) => {
  const data = {
    name: req.body.name,
    message: req.body.message
  };
  const response = [];
  response.push(`Thanks for your message: ${JSON.stringify(data)}`);
  const dataToPublish = Buffer.from(JSON.stringify(data));
  try {
    const messageId = await topic.publish(dataToPublish);
    response.push(`Message ${messageId} sent.`);
    res.send(`Thanks for your message: ${JSON.stringify(response)}`);
  } catch (error) {
    next(error);
  }
})

app.get('/pull', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/pull_form.html'));
});

app.post('/pull', (req, res) => {
  const subscriptionName = req.body.subscription_name || '';
  const subscription = pubsub.subscription(subscriptionName);
  let messageCount = 0;
  const timeout = 60;
  const pulledMessages = [];
  const messageHandler = message => {
    console.log(`Received message ${message.id}:`);
    console.log(`\tData: ${message.data}`);
    console.log(`\tAttributes: ${message.attributes}`);
    let data = JSON.parse(Buffer.from(message.data, 'base64'));
    console.log('data is: ', data)

    pulledMessages.push({
      id: message.id,
      data,
      attributes: JSON.stringify(message.attributes)
    });
    datastore
      .save({
          key: datastore.key(TOPIC),
          data: [
            {
              name: 'Message',
              value: data.message
            },
            {
              name: 'Name',
              value: data.name
            },
            {
              name: 'Source',
              value: data.origin || 'App engine',
            }
          ]
      })
      .catch(err => {
          console.error('ERROR:', err);
          return;
      });
    messageCount += 1;
    message.ack();
  };

  subscription.on(`message`, messageHandler);

  setTimeout(() => {
    subscription.removeListener('message', messageHandler);
    console.log(`${messageCount} message(s) received.`);
    res.send(`${messageCount} message(s) received: ${JSON.stringify(pulledMessages)}`);
  }, timeout * 100)
});

// Start the server
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
// [END gae_flex_quickstart]

module.exports = app;
