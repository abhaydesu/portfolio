# Abhay Singh - Portfolio

A personal portfolio website showcasing my work as a software engineer, along with a collection of my skills and personal writings.

---

### Key Features

* **Responsive Design:** A clean and modern design that looks great on any device.
* **Project Showcase:** A dedicated section to display my projects with a brief description and a link to live demos.
* **Skills Showcase:** An elegant, scrolling marquee that highlights the tech stacks, languages, and frameworks I am proficient in.
* **Blog Integration:** A section for my personal writings on tech, book reviews, and other topics.
* **Contact Form:** A direct way for visitors to get in touch with me.

---

### Tech Stack

* **Framework:** Next.js
* **Styling:** Tailwind CSS
* **Language:** TypeScript
* **Animation:** Framer Motion (as seen in `motion-div.tsx`)

---

### Project Structure

The project is organized into a logical folder structure to ensure maintainability and scalability.

* **`app`**: Contains the main pages and their respective layouts (`about`, `blog`, `contact`, `projects`).
* **`components`**: A collection of reusable React components that make up the user interface (`tech-showcase.tsx`, `project-landing.tsx`, `section-heading.tsx`).
* **`constants`**: Stores data that is constant across the application, such as project details (`projects.ts`).
* **`public`**: Houses static assets like images and icons.

---

### Getting Started

To run this project locally, follow these steps:

1.  **Clone the repository:**
    ```sh
    git clone [your-repository-url]
    ```

2.  **Navigate to the project directory:**
    ```sh
    cd portfolio
    ```

3.  **Install dependencies:**
    ```sh
    npm install
    # or
    yarn install
    ```

4.  **Run the development server:**
    ```sh
    npm run dev
    # or
    yarn dev
    ```

The application will be accessible at `http://localhost:3000`.

---

### License

This project is open-source and available under the MIT License.