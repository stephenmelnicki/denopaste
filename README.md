# Deno Paste

<img align="right" src="https://deno.com/logo.svg" height="150px" alt="The Deno logo" >

**Deno Paste** is a simple paste service built with Deno 🦕 and Fresh 🍋

Some features:

- Pastes automatically expire in one hour.
- Easily copy paste contents to the clipboard.
- Save the paste to file.
- Link directly to a paste's raw content.

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
