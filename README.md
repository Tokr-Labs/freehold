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
Top-level directories:
```text
├── components/      # Reusable React components
├── contexts/        # Custom React contexts
├── pages/           # File-based page routing, see next.js docs for more info
│    └── api/        # File-based API endpoints, see next.js docs for more info
├── public/          # Publicly available files such as images and logos
├── styles/          # Theming related files (light mode, dark mode, and global)
└── utils/           # Utility functions for the API
```

Notes and resources:
- Next.js file-based [page routing](https://nextjs.org/docs/basic-features/pages) and [API endpoints](https://nextjs.org/docs/api-routes/introduction)
- Filenames beginning with an underscore within the `pages/` directory are excluded from showing up as a page or API endpoint
- The `utils/` directory includes functions that are able to be used within the API endpoint files (which cannot utilized contexts or hooks as they are not React components) 


## Tech Stack
- [Next.js](https://nextjs.org/) (React framework)
- [NextUI](https://nextui.org/) (UI component library and theming)
- [React Icons](https://github.com/react-icons/react-icons) (iconography)
- [Metaplex](https://www.metaplex.com/) (NFT SDK)
- [Solflare](https://github.com/solflare-wallet/solana-pfp) (PFP program and SDK)
- [Solana Labs](https://github.com/solana-labs/wallet-adapter) (wallet adapter)
- [Vercel](https://vercel.com/) (hosting and deployments)

## Roadmap

