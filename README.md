# Coffee Town Bakery - Production Tools

This application is an intelligent tool designed to streamline and automate daily operations for a modern bakery. It provides a suite of features to manage production planning, recipes, inventory, and historical data analysis, all within a single, cohesive interface.

## Core Features

- **Multi-Department Management**: The application supports multiple production departments (e.g., Roti Manis, Donut, Roti Sobek), allowing for segregated data management and calculations specific to each department.

- **Production Calculator**: The central feature for daily planning.
  - **Manual Entry**: Users can manually input the quantity of each product to be produced.
  - **Intelligent OCR**: Users can upload a screenshot of their production notes, and the application uses a Genkit AI flow with Gemini to automatically parse the image and fill in the production quantities, significantly speeding up data entry.
  - **Automated Calculations**: Instantly calculates key production metrics, such as the total number of trays needed, total dough required, and the exact number of base recipes to prepare.

- **Ingredient Summary & Usage History**:
  - After calculation, the app provides a complete summary of all ingredients needed for the day's production run.
  - This summary can be saved as a "Daily Usage" record, building a historical log of ingredient consumption.

- **Recipe Scaler**: A handy utility to dynamically scale any base recipe. Users can select a recipe, enter a multiplier (e.g., 1.5 for a 150% batch), and instantly get the adjusted ingredient quantities.

- **Comprehensive Management Tabs**:
  - **Recipe Management**: A full CRUD (Create, Read, Update, Delete) interface for managing base recipes, including ingredients and preparation steps.
  - **Product Management**: A CRUD interface to manage final products. Each product can be linked to one or more base recipes and can have its own list of additional ingredients (like toppings or fillings).
  - **Inventory Management**: A real-time view of ingredient stock levels. It tracks current stock against minimum thresholds and flags items as "In Stock," "Low," or "Critical."

- **Order Recommendation Calculator (Order CUK)**:
  - An intelligent forecasting tool that analyzes historical usage data for a selected day of the week.
  - It recommends the exact quantities of ingredients to order to meet forecasted demand and replenish stock to safe levels.

- **Authentication & Theming**:
  - A simple login system protects data-altering actions (Create, Update, Delete).
  - Features a customizable glassmorphism UI with light and dark modes.

## Technology Stack

The application is built with a modern, robust, and performant tech stack:

- **Framework**: **Next.js 15** (using the App Router). This provides a powerful foundation with features like Server Components, Server Actions, and optimized routing.

- **Language**: **TypeScript**. Used throughout the project for strong typing, better code quality, and improved developer experience.

- **UI Library**: **React 18**. The core library for building the interactive user interface.

- **Component Library**: **shadcn/ui**. A collection of beautifully designed and accessible components (like Cards, Buttons, Dialogs, and Tables) built on top of Radix UI and Tailwind CSS.

- **Styling**: **Tailwind CSS**. A utility-first CSS framework used for all styling, enabling rapid and consistent UI development. The application uses CSS variables for theming.

- **Database**: **Google Cloud Firestore**. A NoSQL, real-time document database used for all data persistence, including recipes, products, inventory, and usage history. The app interacts with it via the Firebase SDK for Web (v10).

- **Generative AI**: **Google Genkit**. The framework used to build and manage the server-side AI functionality.
  - **AI Model**: **Gemini 1.5 Flash** is used within a Genkit flow to power the OCR feature, extracting structured JSON data from uploaded images.

- **State Management**: Primarily uses React's built-in hooks (`useState`, `useEffect`, `useMemo`) for managing client-side state. Server data is fetched on the server and passed down as props, with updates handled by Next.js Server Actions and `revalidatePath`.

- **Forms**: **React Hook Form** with **Zod** for validation, providing a robust and type-safe way to handle all forms in the application.

## Architectural Concepts

- **Server-First Approach**: The app heavily leverages **Next.js Server Components** to fetch initial data and render static parts of the UI on the server, minimizing the amount of JavaScript sent to the client.

- **Server Actions**: All database mutations (add, update, delete) are handled through **Next.js Server Actions**. This eliminates the need for traditional API endpoints, simplifying the codebase and improving security. After a mutation, `revalidatePath` is used to refresh the data on the server and update the UI.

- **Data Seeding & Migration**: The application includes a robust data seeding and migration system that runs on the server when the application first starts. It ensures that the database is populated with initial data and that the data schema can be safely updated over time without manual intervention.

- **Glassmorphism Theming**: The UI's "glass" effect is achieved with CSS `backdrop-filter` and is fully customizable through the UI's Visual Settings popover, which updates CSS variables in real-time.
