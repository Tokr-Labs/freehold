# Structure

`api/` -- Next.js HTTP APIs, for use publicly and internally. These should be kept lightweight, with minimal logic. Any logic which may be repeated across route handlers (or Pages) should be defined in `library/`

`library/` -- An organized collection of typescript functions to support APIs & UI/UX activity. Where the bulk of logic happens, especially for logic that is used by *both* APIs & UI/UX.

* Be aware of designing `library/` code that broadcasts transactions. On the API-side, we'll be sending transactions with a private key loaded in from `.env`, while on the Page-side, we'll be sending transactions from a connected wallet.