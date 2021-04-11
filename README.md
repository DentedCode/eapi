# Project

This is the admin panel of e-commerce site.

## How to use

- Clone the project `git clone ...`
- `cd eapi`
- `npm install`
- `npm run dev`
- Note: Make sure that you system has `nodemon` installed global

## APIs

The following api is used in this project. All the api will followed by the root url `http://localhost:8000`

| #   | End Point          | Verb | Description                                         |
| --- | ------------------ | ---- | --------------------------------------------------- |
| 1   | `/api/v1/login`    | POST | required login email, password to verify user login |
| 2   | `/api/v1/category` | GET  | Get all the categories                              |
| 3   | `/api/v1/category` | POST | Create new entry in the category database           |
