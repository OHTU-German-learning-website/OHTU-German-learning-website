export default function Navbar({ children }) {
    return (
      <html lang="en">
        <body>
          {/* Layout UI */}
          <h1>Here is the navigation!</h1>
          {/* Place children where you want to render a page or nested layout */}
          <main>{children}</main>
        </body>
      </html>
    );
}
