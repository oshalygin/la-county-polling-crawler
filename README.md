<p align="center">
  <img alt="Application Logo" src="docs/crawler.jpg" height="150" width="300" />
  <h3 align="center">LA County Polling Crawler</h3>
  <p align="center">Simple LA County Web Crawling Application Used as a Backend for Mobile Clients</p>

</p>

## Setup

1.  **Install [Node 10.2.0 or greater](https://nodejs.org)**.

- The recommended approach to managing your Node.js installation is through
  `nvm`. This allows you to dynamically switch versions across various
  environments and test locally.
- To install nvm run the following command:

```bash
# Download and install nvm
$ curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.32.1/install.sh | bash
# Install Node.js v10.2.0 through nvm
nvm install v10.2.0
# Set the current Node.js version as the default node version
nvm alias default node
```

2.  **Install [Git](https://git-scm.com/downloads)**.
3.  **[Disable safe write in your editor](http://webpack.github.io/docs/webpack-dev-server.html#working-with-editors-ides-supporting-safe-write)**
    to assure hot reloading works properly.
4.  Clone the project.
    - HTTP: `git clone https://github.com/oshalygin/la-county-polling-crawler.git`
    - SSH: `git@github.com:oshalygin/la-county-polling-crawler.git`

## Building the Application

```bash
# Install the dependencies with yarn
yarn
```

Note that we use yarn explicitly and it is leveraged in the build process. If
you're adding a new package, make sure that `yarn.lock` is updated accordingly.

**[Lockfiles should be committed on all projects](https://yarnpkg.com/blog/2016/11/24/lockfiles-for-all/)**

## Style-Guide

This is the JavaScript style guide , please reference it:
**[JavaScript Style Guide](https://github.com/airbnb/javascript)**

## Run

- `yarn start -s`
  - This will run the automated build process and expose the application over :8080.

## Running Tests and Code Coverage

- To run tests explicitly, `yarn run test`.
- To perform code coverage analysis: `npm run test:coverage`.
  - Code coverage can be viewed in the `/coverage` folder.
  - To view the coverage results in a web browser, run `open:coverage`
  - If WallabyJS is configured and running, navigate to `wallabyjs.com/app` to
    view test results and coverage.

## Building the project

```bash
# This will build the solution and produce the artifacts to the /dist-server and /dist-client folders
yarn run build

# If you would like to build JUST the client bundle(React application):
yarn run build-client

# If you would like to build JUST the server code(Gateway API Express Application):
yarn run build-server
```

## Viewing the running application

- Deployed environments:

  - Local:
    **[http://localhost:8080](http://localhost:8080)**
  - Deployed:
    **This application is actually deployed as either a simple web service or a cloud function**

## Technologies

The following technologies are used on this application. To learn more, please
reference the associated documentation links.

| **Tech**                                            | **Description**                                                    | **Learn More** |
| --------------------------------------------------- | ------------------------------------------------------------------ | -------------- |
| [Node.js](https://nodejs.org/en/)                   | Node.js.                                                           |                |
| [Nightmare](https://github.com/segmentio/nightmare) | Nightmare is a high-level browser automation library from Segment. |                |
