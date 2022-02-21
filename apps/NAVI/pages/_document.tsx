
import Document, { Html, Head, Main, NextScript } from "next/document";
class MyDocument extends Document {
  static async getInitialProps(ctx: any) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head />
        <body style={{ overflow: "hidden" }}>
          <Main />
          <NextScript />


        </body>
      </Html>
    );
  }
}

export default MyDocument;
