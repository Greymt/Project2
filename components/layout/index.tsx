import Head from "next/head";
import { PropsWithChildren } from "react";
import SEO, { SEOProps } from "./SEO";

export default function Layout(props: PropsWithChildren<SEOProps>) {
  const {
    children,
    ...seoProps
  } = props;

  return <>
    <SEO {...seoProps} />
    <div id="main">
      {children}
    </div>
  </>;
}