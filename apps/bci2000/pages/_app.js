import "../index.scss";
import { Container } from "react-bootstrap";
import SSRProvider from 'react-bootstrap/SSRProvider';

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
  return (
    <SSRProvider>
      <Container style={{ marginTop: 5 }} fluid={true}>
        <Component {...pageProps} />
      </Container>
      </SSRProvider>
  );
}
