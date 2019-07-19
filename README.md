# WebScraper

### Installation
Clone the project:  `git clone https://github.com/ktranel/WebScraper.git`

### Requirements
This project requires instances of both mysql and redis.

Configuration details located in **config.js**

### Available Routes
`/api`
- Type: POST
- Required query parameters: url
- returns jobId string

#### example
`/api?url=http://amazon.com`

`/api`
- Type: GET
- Required query parameters: jobId
- returns json obj with properties: id, jobId, and content

#### example
`/api?url=http://amazon.com`
