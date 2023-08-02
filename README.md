# The Joy of Painting API

![Database UML](https://github.com/nathanhall762/holbertonschool-the-joy-of-painting-api/blob/main/DatabaseUML.jpeg)

This project is a RESTful API built with Node.js and MySQL that allows users to search for episodes of Bob Ross's show "The Joy of Painting" based on different criteria such as month, subject, color, and match type.

## Requirements

- Node.js
- MySQL

## Setup

Clone the repository:

```
git clone https://github.com/nathanhall762/holbertonschool-the-joy-of-painting-api.git
```

Navigate into the directory:
```
cd holbertonschool-the-joy-of-painting-api
```

Install the dependencies:
```
npm install
```

## Starting the Server

You can start the server by running:
```
npm start
```

The server will start on port 3000 by default. You can access the API at http://localhost:3000.
API Endpoints

GET /api/episodes/search: This endpoint allows users to search for episodes based on different criteria. 
The parameters for this endpoint are as follows:
- month: Filters the episodes based on the month they were aired.
- subject: Filters the episodes based on the subjects painted in the episode.
- color: Filters the episodes based on the colors used in the episode.
- matchType: Determines how the filters are applied.
 If set to ALL, the API will return episodes that match all of the selected filters. If set to anything else, the API will return episodes that match one or more of the selected filters.

## Testing

To test the API, you can use curl or any API testing tool such as Postman. Here's an example using curl:

```
curl "http://localhost:3000/api/episodes/search?month=January&subject=Tree&color
```