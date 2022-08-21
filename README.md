# Periodic Tables Application

# Deployed Link [https://periodictables-pd14-client.herokuapp.com/dashboard]

The PostgreSQL Database is hosted by [ElephantSql](https://www.elephantsql.com/)


## Table of Contents

* [General Information](#general-information)
* [Technologies](#technologies)
* [Feature Summary](#feature-summary)
* [Installation](#installation)
* [Running Tests](#running-tests)


## General Information

Periodic tables is a restaurant reservation scheduler and management system. Users are able to add new reservations to specific future dates & times, as well as edit, cancel, and manage that reservation. Users are also able to add new tables with specified capacity to the reservation system. The application layout was designed with a mobile-first approach.
The project's base code and assignments can be viewed on this GitHub repository: https://github.com/Thinkful-Ed/starter-restaurant-reservation


## Technologies


### Front-End

* React JS
* CSS
* Bootstrap 4
* JSX


### Back-End

* PostgreSQL
* Knex JS
* Node JS
* Express JS


## Feature Summary


### Create New Reservation

 When a user clicks the `New Reservation` navigation in the menu, they can create a reservation. A reservation requires a customer's first name, last name, party size, phone number, reservation date, and reservation time. Or they can cancel and return to the previous page in history.

![create reservation form](https://i.imgur.com/0bPsGB0.png)


### Manage Reservations

Reservations are managed on the dashboard. By default, the dashboard will list reservations for today's date. Users can select the `Previous` and `Next` buttons to navigate through other reservations by date.

Tables and their availability are listed below the day's reservations.

![reservation dashboard](https://i.imgur.com/W5nuoZG.png)

When a user clicks the `Seat` button associated with a reservation, they are taken to the page for seating reservations. There they can choose which table they would like to seat the reservation, or cancel and return to the previous page in history.
> **Note** Tables with a capacity smaller than a reservation's party size will return an error from the server. Tables that are already occupied by another party are disabled in the selectable options.

![seat reservation](https://i.imgur.com/9eT0HEC.png)


### Edit Reservation

When a user clicks the `Edit` button associated with a reservation, they can edit the reservation with an editing form, or cancel and return to the previous page in history.

![edit reservation](https://i.imgur.com/XOG8Msf.png)


### Search Reservations

When a user clicks the `Search` navigation in the menu, they can search for a reservation by mobile number, with a full or partial match.

![search reservations](https://i.imgur.com/RkrpsCi.png)


### Add Tables

When a user clicks the `New Table` navigation in the menu, they can add additional tables to the management system, or cancel and return to the previous page in history.

![create table](https://i.imgur.com/LEUtejY.png)


## API


### Create Reservation

**POST** `/reservations`

* Required Body:

| Param | Type |
|-------|------|
|`first_name`| `string`|
|`last_name`| `string`|
|`mobile_number`| `string`|
|`people`|`integer`|
|`reservation_date`| `date`|
|`reservation_time`|`time`|


### Get Reservation by ID

`/reservations/:reservation_id`


#### 2 Available Methods

* **GET** - returns a reservation given an existing reservation ID
* **PUT** - updates an existing reservation given an existing reservation ID

* Required Params: `reservation_id (int)`

* Required Body for PUT:

| Param | Type |
|-------|------|
|`first_name`| `string`|
|`last_name`|`string`|
| `mobile_number` | `string`|
| `people`| `integer` |
| `reservation_date`| `date`|
| `reservation_time`| `time`|


### Get Reservation Status

**GET** `/reservations/:reservation_id/status`

Returns a status of `booked` `seated` `finished` or `cancelled` for the given reservation.


### Create Table

**POST** `/tables`

Creates a table to be listed in the tables list.

* Required Body:  

| Params | Type |
|--------|------|
| `capacity` | `integer` |
| `table_name` | `string` |


### Get Tables

**GET** `/tables`

Returns all available tables.


### Seat Table

**PUT** `/tables/:table_id/seat`

Seats a reservation, associating the table directly with that reservation. This also updates the reservation status to `seated`.

* Required Body:  

| Params | Type |
|--------|------|
| `reservation_id` | `integer` |


### Finish Table

**DELETE** `/tables/:table_id/seat`

Clears the table's association to a reservation, and sets that reservation's status to `finished`.


## Installation

1. Fork and clone this repository.
1. Run `cp ./back-end/.env.sample ./back-end/.env`.
1. Update the `./back-end/.env` file with the connection URL's to your ElephantSQL database instance.
1. Run `cp ./front-end/.env.sample ./front-end/.env`.
1. You will need to make changes to the `./front-end/utils/api` file, if you want connect to a local backend location, like `http://localhost:5001`.
1. Run `npm install` to install project dependencies.
1. Run `npm run start:dev` to start your server in development mode.


### Database setup

 Set up four new ElephantSQL database instances - development, test, preview, and production.


### Knex

Run `npx knex` commands from within the `back-end` folder, where the `knexfile.js` file is located.


## Running tests

This project has unit, integration, and end-to-end (e2e) tests.

Test are split up by user story. You can run the tests for a given user story by running:

`npm run test:X` where `X` is the user story number.

Have a look at the following examples:

* `npm run test:1` runs all the tests for user story 1 (both frontend and backend).
* `npm run test:3:backend` runs only the backend tests for user story 3.
* `npm run test:3:frontend` runs only the frontend tests for user story 3.

Whenever possible, frontend tests will run before backend tests to help you follow outside-in development.

> **Note** When running `npm run test:X` If the frontend tests fail, the tests will stop before running the backend tests. Remember, you can always run `npm run test:X:backend` or `npm run test:X:frontend` to target a specific part of the application.

If you would like a reminder of which npm scripts are available, run `npm run` to see a list of available commands.

Note that the logging level for the backend is set to `warn` when running tests and `info` otherwise.

> **Note**: After running `npm test`, `npm run test:X`, or `npm run test:e2e` you might see something like the following in the output: `[start:frontend] Assertion failed:`. This is not a failure, it is just the frontend project getting shutdown automatically.

> **Note**: If you are getting a `unable to resolve dependency tree` error when running the frontend tests, run the following command: `npm install --force --prefix front-end`. This will allow you to run the frontend tests.