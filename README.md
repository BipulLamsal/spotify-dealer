# spotify-dealer

**spotify-dealer** is a straightforward application designed to showcase your Spotify playing status on the web. It provides a simple authorization process that returns an SVG image, allowing you to display your Spotify activity anywhere you like.

<center>
![spotify-dealer](https://spotify-dealer.vercel.app/api/badge/31bx3nvidhujrgdrzx3xigrgm4wu)
</center>

## Usage
Simply authorize the application and copy your URL to start showcasing your Spotify activity. [Authorize Me](https://spotify-dealer.vercel.app/ "Authorize Me").

## Running Locally

Ensure you have a `.env.local` file in the root directory with the following setup as shown in the snippet:
```
SPOTIFY_CLIENT_ID = AVAILABLE_OVER_SPOTIFY_DEVELOPER_PORTAL
SPOTIFY_CLIENT_SECRET = AVAILABLE_OVER_SPOTIFY_DEVELOPER_PORTAL
SPOTIFY_REDIRECT_URI = http://localhost:3000/api/callback
NEXT_PUBLIC_API_URI = http://localhost:3000/
```

Use any package manager mentioned below and get started.

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```


## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.
