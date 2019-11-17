# Quickstart for Node.js in the App Engine flexible environment

This is the sample application for the
[Quickstart for Node.js in the App Engine flexible environment][tutorial]
tutorial found in the [Google App Engine Node.js flexible environment][appengine]
documentation.

- [Quickstart for Node.js in the App Engine flexible environment](#quickstart-for-nodejs-in-the-app-engine-flexible-environment)
  - [Setup](#setup)
  - [Running locally](#running-locally)
  - [Deploying to App Engine](#deploying-to-app-engine)
  - [Running the tests](#running-the-tests)
- [Use default Google authentication](#use-default-google-authentication)

## Setup

Before you can run or deploy the sample, you need to do the following:

1.  Refer to the [appengine/README.md][readme] file for instructions on
    running and deploying.
1.  Install dependencies:

        npm install

## Running locally

    npm start

## Deploying to App Engine

    gcloud app deploy

## Running the tests

# Use default Google authentication
    gcloud auth application-default login

See [Contributing][contributing].

[appengine]: https://cloud.google.com/appengine/docs/flexible/nodejs
[tutorial]: https://cloud.google.com/appengine/docs/flexible/nodejs/quickstart
[readme]: ../../README.md
[contributing]: https://github.com/GoogleCloudPlatform/nodejs-docs-samples/blob/master/CONTRIBUTING.md
