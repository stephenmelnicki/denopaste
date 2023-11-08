# Deno Paste

![Screenshot](./static/screenshot.png)

A minimal plain text storage service built with Deno and Fresh.

## Features

- Global persistent data using Deno KV
- Sends updates from server to clients using EventSource (server-sent events)

This project is hosted on Deno Deploy:

- Served from 35 edge locations around the world
- Scales automatically
- Data is a globally distributed Deno KV store with no setup required
- Code is deployed automatically when pushed to GitHub
- Automatic HTTPS (even for custom domains)
- Free for most hobby use cases

## Development

You can start the local development server via:

```
deno task start
```
