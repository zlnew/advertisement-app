# Advertisement App
An Advertisement App with simple CRUD functionality, developed using Laravel and Vue.js.

## Prerequisites
1. php: version `8.1` or higher
2. Node.js: version `16.0` or higher

## Quick Start (Laravel)
1. Run `composer install` from terminal
2. Run `php artisan migrate` to migrate database
3. Then run `cp .env.example .env` to create .env file and run `php artisan key:generate` afterwards to generate the key
4. Finally run `php artisan serve`

### Note
This APP use [Mailtrap](https://mailtrap.io) to send email for testing purposes, make sure to insert your own MAIL_USERNAME and MAIL_PASSWORD on .env file.

## Quick Start (Vue.js)
1. Open the terminal from `resources/vue` folder directory 
2. Run `npm install` to install required dependencies
3. To start development server, run `npm run dev`
