# DStore

DStore is an educational project that demonstrates a file upload and download mechanism using Discord's API. The project focuses on uploading files in chunks to Discord and downloading them by fetching each chunk and assembling them. Please note that this project is intended for educational purposes only.

## Features

- **File Upload**: Upload files to Discord in smaller, manageable 25MB chunks.
- **File Download**: Download files by fetching each chunk and assembling them on the client side.
- **Database**: Inserts chunks related to a file in database

## Prerequisites

Before using DStore, ensure you have the following installed:

- Node.js
- Discord API credentials (create a Discord bot and obtain the token)

## Getting Started

1. Clone the repository:

    ```bash
    git clone https://github.com/fero1xd/DStore.git
    ```

2. Install dependencies:

    ```bash
    cd DStore
    pnpm install
    ```

3. Configure your Discord API credentials:

    Create a `.env` file in the project root and add your Discord bot token:

    ```
    APPLICATION_ID=
    APPLICATION_SECRET=
    TEST_CHANNEL_ID=
    
    PGUSER=
    PGHOST=
    PGDATABASE=
    PGPASSWORD=
    PGPORT=
    ```

4. Build the application:

    ```bash
    pnpm run build
    # OR
    pnpm run build:dev
    ```

## CLI

- To Upload a file
```bash
pnpm start:build --upload ./path/to.file
```

- To Download a file
```bash
pnpm start:build --download file_id --path /save/here/
```

- To Download files from web
```bash

pnpm start:build --web

```
And then visit `http://localhost:3000/{fileid}`

## License

This project is licensed under the [MIT License](LICENSE.md).

## Acknowledgments

- [Discord.js](https://discord.js.org/) - Discord API library for Node.js.

## Disclaimer

This project is for educational purposes only. Use it responsibly and respect the terms of service of Discord.
