import { CacheProvider, EmotionCache } from "@emotion/react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { AppProps } from "next/app";
import { SnackbarProvider } from "notistack";
import { FC } from "react";
import { Provider } from "react-redux";
import { wrapper } from "../app/store";
import theme from "../styles/theme";
import "../styles/_global.scss";
import createEmotionCache from "../utils/createEmotionCache";

const clientSideEmotionCache = createEmotionCache();

const App: FC<AppProps & { emotionCache: EmotionCache }> = ({ Component, ..._props }) => {
  const { store, props } = wrapper.useWrappedStore(_props);
  const { pageProps, emotionCache = clientSideEmotionCache } = props as typeof _props;
  return <Provider store={store}>
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <SnackbarProvider maxSnack={3} anchorOrigin={{ horizontal: "center", vertical: "top" }} autoHideDuration={5000}>
          <CssBaseline />
          <Component {...pageProps} />
        </SnackbarProvider>
      </ThemeProvider>
    </CacheProvider>
  </Provider>
}

export default App;