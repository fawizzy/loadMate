
# loadMate

**loadMate** is a simple and scalable Node.js-based load balancer designed to distribute incoming traffic among multiple servers efficiently. Whether you are running a web application, API, or microservices, loadMate helps you achieve high availability and improved performance by intelligently distributing the load across your servers.

## Demo

Check out the [loadMate Demo](https://www.awesomescreenshot.com/video/23808383?key=0f86fe573e6b050db1c45ecdb5ca06e8) to see loadMate in action.

## Features

- **Load Balancing Algorithms:** Supports multiple load balancing algorithms, including Random, Round Robin, and Least Connections.
- **Dynamic Configuration:** Automatically updates server configurations based on health checks, ensuring only healthy servers receive traffic.
- **Scalability:** Easily scales with the addition of new servers, providing seamless handling of increased load.
- **Monitoring:** Provides monitoring capabilities to track server health, connections, and overall system performance.

## Getting Started

Follow these steps to set up and run loadMate on your system:

### Prerequisites

- Node.js and npm installed on your machine.

### Installation

1. Clone the loadMate repository to your local machine:

    ```bash
    git clone https://github.com/fawizzy/loadMate.git
    ```

2. Navigate to the project directory:

    ```bash
    cd loadMate
    ```

3. Install dependencies:

    ```bash
    npm install
    ```

### Configuration

1. Configure your servers in the `config.json` file:

    ```json
    {
    "all_servers": [
    {
      "id": 0,
      "url": "http://localhost:8000",
      "connections": 1
    },
    {
      "id": 1,
      "url": "http://localhost:8001",
      "connections": 0
    },
    {
      "id": 2,
      "url": "http://localhost:8002",
      "connections": 0
    }
    ],
    "healthy_servers": [],
    "unhealthy_servers": [],
    "algorithm": "round_robin"
    }
    ```

2. Customize the load balancing algorithm by setting the `"algorithm"` field to "random," "round_robin," or "least_connections."

### Usage

Start the loadMate server:

```bash
npm start
```

By default, loadMate runs on port 3000. Update the `port` variable in the `index.ts` file if you want to use a different port.

## Load Balancing Algorithms

Choose the appropriate algorithm for your use case:

- **Round Robin:** Distributes incoming requests in a circular sequence to each server.
- **Random:** Randomly selects a server for each incoming request.
- **Least Connections:** Directs traffic to the server with the fewest active connections.

Update the `"algorithm"` field in `config.json` accordingly.

## Contributing
Feel free to open issues, submit pull requests, or provide feedback to help improve loadMate.


