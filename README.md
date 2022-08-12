# Freehold - Solana NFTs made easy
## Overview


## Running Locally
In order to run this repository locally, you must first copy the contents of `.env.sample` to `.env.local`. The only required environment variables are `NEXT_PUBLIC_RPC_DEVNET` and `NEXT_PUBLIC_RPC_MAINNET_BETA` which have the publicly available RPC nodes from the Solana Foundation included by default.

If you wish to utilize the built-in API, the `SOLANA_PRIVATE_KEY` variable will also need set. To prevent unauthorized access to the endpoints that interact with that private key, basic auth credentials can be set via the `BASIC_AUTH_USER` and `BASIC_AUTH_PASSWORD` variables.

Once `.env.local` is set up, simply start the local server with:
```shell
next dev
```

You should see your environment variables being loaded as well as confirmation that the server is now running on `http://localhost:3000`.
```shell
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
info  - Loaded env from [...]/freehold/.env.local
wait  - compiling...
event - compiled client and server successfully in 1770 ms (1813 modules)

```

## Repository Structure

## Tech Stack

## Roadmap

