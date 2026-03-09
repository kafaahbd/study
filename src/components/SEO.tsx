import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description?: string;
  image?: string;
  url?: string;
}

const SEO: React.FC<SEOProps> = ({ title, description, image, url }) => {
  const siteTitle = "Kafa'ah Study Corner";
  const fullTitle = `${title} | ${siteTitle}`;
  const defaultDesc = "Kafa'ah Study Corner – বাংলাদেশের সেরা অনলাইন মডেল টেস্ট প্ল্যাটফর্ম। SSC, HSC ও এডমিশন প্রস্তুতির জন্য অধ্যায়ভিত্তিক পরীক্ষা, তাৎক্ষণিক ফলাফল ও ব্যাখ্যা। Kafa'ah Bangladesh এর একটি উদ্যোগ ইনশাআল্লাহ।";
  const defaultImage = "https://study.kafaahbd.com/stufy.jpg";
  const siteUrl = "https://study.kafaahbd.com";

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDesc} />
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || defaultDesc} />
      <meta property="og:image" content={image || defaultImage} />
      <meta property="og:image:secure_url" content={image || defaultImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:type" content="image/jpeg" />
      <meta property="og:image:alt" content="Kafa'ah Study Corner Preview" />
      <meta property="og:locale" content="bn_BD" />
      <meta property="og:url" content={url ? `${siteUrl}${url}` : siteUrl} />
      <meta property="og:type" content="website" />
      
      {/* Twitter */}
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || defaultDesc} />
      <meta name="twitter:image" content={image || defaultImage} />
    </Helmet>
  );
};

export default SEO;
