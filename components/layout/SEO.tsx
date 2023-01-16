import Head from "next/head";
import { useRouter } from "next/router";
import { PropsWithoutRef } from "react";
import { getAppConfig, mapMetaRobot } from "../../utils/config";

const config = getAppConfig();

function getCanonical(args: { slug: string }) {
  const { slug } = args;
  if (!slug) return { canonical: null, alternates: [] };
  if (slug === "/") {
    return {
      canonical: "/"
    }
  }
  let _slug = slug;
  if (!slug.startsWith("/")) _slug = `/${_slug}`;
  if (!slug.endsWith("/")) _slug = `${_slug}/`;
  return {
    canonical: _slug
  }
}

const getSitename = (siteAddress: string) => {
  try {
    return new URL(siteAddress).hostname;
  } catch (_) {
    return "";
  }
}

export type SEOProps = {
  title?: string;
  description?: string;
  keywords?: string;
  robots?: string | number;
  slug?: string;
  siteAddress?: string;
  imageSharing?: string;
  imageSharingAlt?: string;
  jsonLd?: string[];
  noAlternateLink?: boolean;
}

export default function SEO(props: PropsWithoutRef<SEOProps>) {
  const {
    title,
    description,
    keywords,
    robots,
    slug = "",
    siteAddress = config.siteAddress,
    imageSharing: _imageSharing,
    imageSharingAlt,
    jsonLd = [],
    // noAlternateLink
  } = props;

  const host = process.env.NODE_ENV === "production" ? siteAddress || "" : "";
  const router = useRouter();

  const { canonical: _canonical } = getCanonical({ slug });
  const canonical = !_canonical ? "" : `${host}${_canonical}`;
  const siteName = getSitename(siteAddress);
  const imageSharing = _imageSharing
    ? (_imageSharing.startsWith("http")
      ? _imageSharing
      : `${host}${_imageSharing.startsWith("/") ? "" : "/"}${_imageSharing}`)
    : "";

  return <Head>
    <title>{title}</title>
    <meta name="title" content={title} />
    <meta name="description" content={description} />
    <meta name="keywords" content={keywords} />
    {typeof robots !== "undefined" && <meta
      name="robots"
      content={typeof robots === "string" ? robots : mapMetaRobot[robots]}
    />}
    {!!canonical && <>
      <link rel="canonical" href={canonical} />
      <meta property="og:url" content={canonical} />
    </>}
    {/* Open Graph */}
    <meta property="og:type" content="website" />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    {!!imageSharing && <>
      <meta property="og:image" content={imageSharing} />
      <meta property="og:image:secure_url" content={imageSharing} />
      <meta property="og:image:alt" content={imageSharingAlt} />
    </>}
    <meta property="og:site_name" content={siteName} />
    {jsonLd.map((script, i) => (
      <script
        key={i}
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: script,
        }}
      />
    ))}
  </Head>
}
