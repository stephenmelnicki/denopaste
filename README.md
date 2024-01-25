# Deno Paste

A minimal plain text storage service built with Deno and Fresh.

## Features

- Persistent text storage using Deno KV
- Stored pastes are automatically removed after one hour

This project is hosted on Deno Deploy:

- Served from 35 edge locations around the world
- Scales automatically
- Data is a globally distributed Deno KV store with no setup required
- Code is deployed automatically when pushed to GitHub
- Automatic HTTPS (even for custom domains)
- Free for most hobby use cases

## Example

You can try it out at https://deno-paste.deno.dev

![Screenshot](./static/screenshot.png)

## Development

You can start the local development server via:

```
deno task start
```
