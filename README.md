[![Build Status](https://travis-ci.com/oolushola/Banka.svg?branch=develop)](https://travis-ci.com/oolushola/Banka) [![Coverage Status](https://coveralls.io/repos/github/oolushola/Banka/badge.svg?branch=develop)](https://coveralls.io/github/oolushola/Banka?branch=develop) [![Maintainability](https://api.codeclimate.com/v1/badges/b5cadd3bb7b57281c835/maintainability)](https://codeclimate.com/github/oolushola/Banka/maintainability) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

![Logo of the project](UI/images/landing-page-design.jpg)

Banka is a light-weight core banking application that powers banking operations like account creation, customer deposit and withdrawals. This app is meant to support a single bank, where users can signup and create bank accounts online, but must visit the branch to withdraw or deposit money

### Prerequisites
In order to get the most of this application, there are a few prerequisites required: 

- Basic Understanding of HTML, CSS and Javascript
- Command Line Tools, e.g. Git Bash for Windows User
- [`Node Js`](https://nodejs.org/en/): a javascript runtime built on Chrome's V8 Javascript Engine.
- [`npm`](https://www.npmjs.com/package/download) Essential javascript development tools that assists to build powerful applications using modern open source code.
- [`express js`](https://expressjs.com/): A fast unopinionated, minimalist, web framework for node.js
- [`Air-bnb`](https://www.npmjs.com/package/eslint-config-airbnb) style guide was adopted
- [`ESLint`](https://eslint.org/): allow developers to discover problems with their JavaScript code without executing it.

## Installing / Getting started


- Install `NODE` and `NPM`
- clone the repository into your local directory. To do that, open either the terminal for macOS  users or command prompt for windows users and paste in `https://github.com/oolushola/Banka.git`
- Once its cloned, cd into the path where the repo is on the pc from the terminal and run `npm install` or `npm i` to install every necesarry development and production dependencies in the package.json file.
- After all dependencies are done, still on the terminal run `npm run devstart`
- **To run unit test**: `npm run test`


## Tools
- [`Pivotal Tracker`](https://www.pivotaltracker.com/): is the agile project management tool of choice for developers around the world for real-time collaboration around a shared, prioritized backlog.
- [`Travis CI`](https://travis-ci.com/): is a hosted, distributed continuous integration service used to build and test software projects hosted at GitHub.
- [`Coveralls`](https://coveralls.io/): consolidates the results from a suite of static analysis tools into a single, real-time report, giving your team the information it needs to identify hotspots, evaluate new approaches, and improve code quality(from crunch base).

- Test Framework
    * [`Mocha`](https://mochajs.org/): A javascript testing framework
    * [`Chai`](https://www.chaijs.com/): Javascript test assertation library
- [`Postman`](https://www.getpostman.com/): is the only complete API development environment, and flexibly integrates with the software development cycle.
- [`Heroku`](https://www.heroku.com/): is a platform as a service (PaaS) that enables developers to build, run, and operate applications entirely in the cloud.
- [`Code Climate`](https://codeclimate.com/): Helps to get automated code review for test coverage, complexity, duplication, security and style.


## Features

Banka aims to perform the following core objectives?
* User (client) can sign up.
* User (client) can login.
* User (client) can create an account.
* User (client) can view account transaction history.
* User (client) can view a specific account transaction.
* Staff (cashier) can debit user (client) account.
* Staff (cashier) can credit user (client) account.
* Admin/staff can view all user accounts.
* Admin/staff can view a specific user account.
* Admin/staff can activate or deactivate an account.
* Admin/staff can delete a specific user account.
* Admin can create staff and admin user accounts.

## UI-Links on GitHub Pages
- [Client](https://oolushola.github.io/Banka/) 
- [Staff](https://oolushola.github.io/Banka/staff/) 
- [Admin](https://oolushola.github.io/Banka/admin/)
```gherkin
Note: 
Above links redirects to each concerns for client, staff and admin user interface design respectively.

However, only javascript validations were made on all forms, 
core functionalities have not been inplemented yet.
```

## Additional Links
Pivotal Tracker Stories - [oolushola-Pivotal-tracker-stories](https://www.pivotaltracker.com/n/projects/2320366) 

Banka App, deployed to Heroku. Accessible via public URL [Here](https://adc-bankav1.herokuapp.com/)

## Endpoints

`Client`

|  Method  | URI             | Description  |  Status code |
|:----------:|:---------------------:|--------------|:---------:|
|`POST`   | /api/v1/auth/register | signup |  201 |
|`POST`  | /api/v1/auth/login|  login | 200  |
|`PUT`  | /api/v1/update-profile|  update profile | 201  |
|`GET`  | /account/{account-number}/transactions|  all user transactions | 200  |
|`GET`  | //accounts/transactions/{transaction-id}|  user specific transaction | 200  |
|`POST`  | /api/v1/accounts|  create bank account| 201  |
|`PATCH`  | /api/v1/change-password|  change user password | 200  |

`Staff`

|  Method  | URI             | Description  |  Status code |
|:----------:|:---------------------:|--------------|:---------:|
|`POST`  | /api/v1/auth/staff/login|  Login | 200  |
|`POST`  | /api/v1/transactions/{account-number}|  Make transaction on account | 201  |
|`DELETE`  | /api/v1/accounts/{account-number}|  Delete client account | 200  |
|`GET`  | /api/v1/accounts|  View all users account | 200  |
|`GET`  | /api/v1/{account-number}|  View specific account | 200  |
|`GET`  | /api/v1/accounts/&&status={status}|  View all bank accounts by status | 200  |

`Admin`

|  Method  | URI             | Description  |  Status code |
|:----------:|:---------------------:|--------------|:---------:|
|`POST`  | /api/v1/auth/admin/login|  Login | 200  |
|`PATCH`  | /api/v1/generate/account-number|  Assign account number to client | 201  |
|`PATCH`  | /api/v1/accounts/account-id={owner}&&account-status={status}|  Update client account status| 201  |
|`POST`  | /api/v1/admin/auth/registration|  create an admin/staff account | 201  |


## Contributing

````
I believe the best software are written by teams of software developers. Hence, If you'd like to contribute, 
please fork the repository and use a feature branch. Pull requests are warmly welcome.
````

## Resource

A big thank you to the authors whose resource helped me profusely in achieving the banka project and worthy of honorable mentions.

 [Node.js & pgSQL](https://blog.logrocket.com/setting-up-a-restful-api-with-node-js-and-postgresql-d96d6fc892d8),   [Jsonwebtoken](https://medium.freecodecamp.org/securing-node-js-restful-apis-with-json-web-tokens-9f811a92bb52), [Mocha](https://medium.com/@asciidev/testing-a-node-express-application-with-mocha-chai-9592d41c0083)

## Licensing

    The code in this project is licensed under MIT license.
