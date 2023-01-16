import createEmotionServer from "@emotion/server/create-instance";
import Document, { DocumentContext, Head, Html, Main, NextScript } from "next/document";
import React from "react";
import createEmotionCache from "../utils/createEmotionCache";

class AppDocument extends Document {
  render() {
    return <Html>
      <Head lang="vi">
      </Head>

      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  }

  static async getInitialProps(ctx: DocumentContext) {
    const originalRenderPage = ctx.renderPage;
    const cache = createEmotionCache();
    const { extractCriticalToChunks } = createEmotionServer(cache);
    ctx.renderPage = () => originalRenderPage({
      // @ts-ignore
      enhanceApp: (App) => (props) => <App {...props} emotionCache={cache} />
    });

    const initialProps = await Document.getInitialProps(ctx);
    const emotionStyles = extractCriticalToChunks(initialProps.html);
    const emotionStyleTags = emotionStyles.styles.map((style) => (
      <style
        data-emotion={`${style.key} ${style.ids.join(' ')}`}
        key={style.key}
        dangerouslySetInnerHTML={{ __html: style.css }}
      />
    ));
    return {
      ...initialProps,
      styles: [
        ...React.Children.toArray(initialProps.styles),
        ...emotionStyleTags
      ]
    }
  }
}

export default AppDocument;