<p align="center">
<img height="100" src="./assets/images/logo_readme.png"/>
<br/>
<img alt="Express Version" src="https://img.shields.io/badge/express.js-v4.x.x-D7E8CD?labelColor=2A2D23&style=flat-square">
<img alt="GitHub Actions Workflow Status" src="https://img.shields.io/github/actions/workflow/status/dybdeskarphet/cycleapi/bun.yml?style=flat-square&label=Build%20Test&labelColor=2A2D23&color=%23D7E8CD">
<img alt="OpenAPI Info" src="https://img.shields.io/badge/OpenAPI-v3.0.0 with rapidoc-D7E8CD?labelColor=2A2D23&style=flat-square">
</p>

> [!WARNING]
> Even though this project is released, it's still under development. Use at your own risk.

A RESTful API built with Express.js and TypeScript to analyze and forecast product lifecycle trends using sales data. This system helps categorize products into lifecycle phases and calculate growth and regression metrics, offering valuable insights for marketing and production planning.

## 🧠 Features

- 📊 **Sales Data Input** — Add and update raw product sales data.
- 📈 **Growth Rates** — Get smoothed or window-based growth rates.
- 📉 **Linear Regression Slopes** — Analyze acceleration/deceleration trends.
- 🧬 **Lifecycle Phase Detection** — Automatically determine product phases (e.g. Introduction, Growth, Maturity, Decline) using regression-based heuristics.
- 🧪 **Built-in Validation** — Uses Zod to validate all input data.
- 🔒 **Authentication and scopes** — Use scopes like `read:products` or `write:sales` to give authentication to users.

## 🔗 API Endpoints

| Method | Endpoint                             | Description                       |
| ------ | ------------------------------------ | --------------------------------- |
| POST   | `/products/`                         | Create a new product              |
| GET    | `/products/:id`                      | Get product by ID                 |
| DELETE | `/products/:id`                      | Delete product by ID              |
| GET    | `/products/`                         | List all products                 |
| POST   | `/products/filter`                   | Get products by filtering         |
| GET    | `/products/:id/sales/:interval`      | Get product sales by interval     |
| POST   | `/products/:id/sales`                | Add new sale                      |
| DELETE | `/products/:productId/sales/:saleId` | Delete a sale by ID               |
| PUT    | `/products/:productId/sales/restore` | Restore sales from a local backup |
| POST   | `/lifecycle/:id/moving-averages`     | Get moving averages of sales      |
| POST   | `/lifecycle/:id/growth-rates`        | Get sales growth rates            |
| POST   | `/lifecycle/:id/acceleration-rates`  | Get acceleration rates            |
| POST   | `/lifecycle/:id/lr-slopes`           | Get linear regression slopes      |
| POST   | `/lifecycle/:id/phases-with-lr`      | Get lifecycle phases with LR      |
| POST   | `/admin/generate-token`              | Generate API key/token            |

## 🚀 Usage

### Build

```bash
bun run build
```

Compiles the TypeScript source files into JavaScript and outputs them to the `dist/` directory.

### Development

```bash
bun run dev
```

Runs the server in development mode with hot reloading.

### Start

```bash
bun run start
```

Starts the compiled server from the `dist/` directory.

### Type Check

```bash
bun run check
```

Performs a TypeScript type check without emitting output (needs `tsc`).

## 📦 Example Use Case

Say you have a product that’s been on the market for a year. Using this API, you can:

1. Upload monthly sales records.
2. Calculate the growth rate with a 3-month rolling average.
3. Analyze the slopes to detect acceleration trends.
4. Get an automatic forecast of which lifecycle phase the product is in.
5. Feed this into dashboards or Excel for stakeholder reports.

## 📌 TODO

See [TODO.md](./docs/TODO.md) for future improvements.

## 🛠 Tech Stack

- **Runtime:** [Bun](https://bun.sh/)
- **Backend:** Express.js (TypeScript)
- **Database:** MongoDB (via Mongoose)
- **Validation:** Zod
- **OpenAPI Docs:** zod-to-openapi

## 📣 Contribution

PRs welcome — especially if you're into data science, frontend dashboarding, or want to help optimize the lifecycle analysis.
