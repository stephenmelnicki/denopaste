<picture>
  <img
    alt="denopaste.com screenshot"
    src="https://raw.githubusercontent.com/stephenmelnicki/denopaste/main/.readme-assets/screenshot.png"
  >
</picture>

[![Denopaste](https://github.com/stephenmelnicki/denopaste/actions/workflows/ci.yml/badge.svg)](https://github.com/stephenmelnicki/denopaste/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

# Deno Paste

A simple paste service built with [Deno](https://deno.land) 🦕 and
[Fresh](https://fresh.deno.dev) 🍋

## Getting Started

Install the latest [Deno CLI](https://deno.land) version.

Then start the development server using the `deno task` command:

```sh
deno task dev
```

Now open http://localhost:8000 in your browser to view Deno Paste. Any changes
you make to the source code will be reflected in your browser.

Deno Paste is deployed via [Deno Deploy](https://deno.com/deploy). To deploy
your own version:

1. Fork this repository
2. [Create a Deno Deploy project](https://dash.deno.com/new)
3. [Link](https://deno.com/deploy/docs/projects#enabling) the Deno Deploy
   project to the `main.ts` file
4. The project will be deployed to a public $project.deno.dev subdomain.

For a more in-depth getting started guide, visit the
[Getting Started](https://fresh.deno.dev/docs/getting-started) page in the Fresh
docs.

## Testing

To run the unit tests:

```sh
deno task test
```

To view a test coverage report:

```sh
deno task test -- --coverage
deno coverage
```

To run the integration tests, start the Deno Paste server if you haven't
already:

```sh
deno task dev
```

Or

```sh
deno task build
deno task preview
```

Then, in another tab, run the integration tests:

```sh
deno task e2e
```
