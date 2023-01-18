![](static/screenshot.png)

# Deno Paste

A minimal plain text storage service built using [Deno](https://deno.land/),
[Fresh](https://fresh.deno.dev/), [twind](https://twind.dev/) and
[Supabase](https://supabase.io/).

## Quickstart

Set up your `.env` with Supabase credentials:

```
cp .env.example .env
```

Create a Supabase project:

- Navigate to https://app.supabase.com/
- Create a New Project
- Enter project details and launch
- Copy the URL and api key and save them to `.env`

Then start the server:

```
deno task start
```
