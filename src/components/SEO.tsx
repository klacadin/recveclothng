import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'product' | 'article';
  price?: number;
  currency?: string;
}

const DEFAULT_TITLE = 'REVE Clothing | Performance Apparel from Bukidnon';
const DEFAULT_DESCRIPTION = 'Premium quality running and athletic wear at affordable prices. From Nobody to Somebody. Timing is Everything. Shop running shirts, singlets, shorts, and more. Nationwide delivery via J&T.';
const DEFAULT_IMAGE = '/og-image.jpg';
const SITE_NAME = 'REVE Clothing';
const BASE_URL = 'https://reveclothingxnobody.com';

const SEO = ({
  title,
  description = DEFAULT_DESCRIPTION,
  image = DEFAULT_IMAGE,
  url,
  type = 'website',
  price,
  currency = 'PHP',
}: SEOProps) => {
  const pageTitle = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE;
  const pageUrl = url ? `${BASE_URL}${url}` : BASE_URL;
  const imageUrl = image.startsWith('http') ? image : `${BASE_URL}${image}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={pageUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_PH" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={pageUrl} />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />

      {/* Product-specific tags */}
      {type === 'product' && price && (
        <>
          <meta property="product:price:amount" content={price.toString()} />
          <meta property="product:price:currency" content={currency} />
        </>
      )}

      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content="REVE Clothing" />
      <meta name="geo.region" content="PH-BUK" />
      <meta name="geo.placename" content="Maramag, Bukidnon" />
    </Helmet>
  );
};

export default SEO;
