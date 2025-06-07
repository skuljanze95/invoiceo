# Invoiceo

Invoiceo is a invoice generator application built with Next.js 14. It provides an easy way to create and manage invoices.

![invoiceo-4](https://github.com/skuljanze95/invoiceo/assets/75167535/1ad2863d-ef0a-4205-aa7c-df83ee73f20b) | ![invoiceo-3](https://github.com/skuljanze95/invoiceo/assets/75167535/e52f15de-5123-41d4-a41a-988d1f53b4d5)
:-------------------------:|:-------------------------:
![invoiceo-2](https://github.com/skuljanze95/invoiceo/assets/75167535/0121af9e-7173-4a8f-b98e-4d47d0e9ecd3) | ![invoiceo-1](https://github.com/skuljanze95/invoiceo/assets/75167535/9ef207fa-4ca3-48c8-b5ad-3ae2d0d78c07)






## Technologies


- **Next.js:** React framework for SSR and client-side navigation.
- **TypeScript:** JavaScript superset with static typing.
- **Clerk:** Authentication platform.
- **Turso:** SQLite-compatible database built on libSQL.
- **Drizzle:** Headless TypeScript ORM.
- **Resend:** Email API.
- **Shadcn-UI:** UI library for enhanced visuals.
- **Tailwind:** Utility-first CSS framework.
- **React Hook Form:** Form management for React.
- **Zod:** TypeScript-first schema validation.
- **React-pdf:** React renderer for creating PDF files on the browser and server.


## Demo

Visit the [live demo](https://invoiceo.vercel.app/) 

## Getting Started

Follow these instructions to get up and running on your local machine.

### Prerequisites

- Clerk account
- Resend account
- Turso account

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/skuljanze95/invoiceo.git
   cd invoiceo
   ```
2. Install dependencies
   
   ```bash
   npm install
   ```
3. Copy the .env.local.example file to .env.local and add real values (This step is for sending pdf to email feature):
   ```bash
   cp .env.local.example .env.local
   ```
4. Start development server

    ```bash
    npm run dev
    ```
5. Open your web browser and access the application at [http://localhost:3000](http://localhost:3000)
<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.
