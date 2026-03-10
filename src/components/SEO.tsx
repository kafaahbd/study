import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description?: string;
  image?: string;
  url?: string;
  keywords?: string; // এটি অলরেডি ছিল
}

// keywords কে এখানে রিসিভ করতে হবে
const SEO: React.FC<SEOProps> = ({ title, description, image, url, keywords }) => {
  const siteTitle = "Kafa'ah Study Corner";
  const fullTitle = `${title} | ${siteTitle}`;
  const defaultDesc = "বাংলাদেশের সেরা অনলাইন মডেল টেস্ট প্ল্যাটফর্ম। SSC, HSC ও এডমিশন প্রস্তুতির জন্য অধ্যায়ভিত্তিক পরীক্ষা, তাৎক্ষণিক ফলাফল ও ব্যাখ্যা।";
  const defaultImage = "https://study.kafaahbd.com/study.jpg"; 
  const siteUrl = "https://study.kafaahbd.com";

  // ইউআরএল ক্লিনিং লজিক
  const cleanUrl = url?.startsWith('/') ? url : `/${url || ''}`;
  const finalUrl = url ? `${siteUrl}${cleanUrl}` : siteUrl;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDesc} />
      
      {/* Keywords Meta Tag - এটি মিসিং ছিল */}
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:url" content={finalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || defaultDesc} />
      <meta property="og:image" content={image || defaultImage} />
      <meta property="og:image:secure_url" content={image || defaultImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:type" content="image/jpeg" />
      <meta property="og:image:alt" content={title} />
      <meta property="og:locale" content="bn_BD" />
      <meta property="og:type" content="website" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || defaultDesc} />
      <meta name="twitter:image" content={image || defaultImage} />

      {/* Canonical Link */}
      <link rel="canonical" href={finalUrl} />
      
      {/* Robots Tag - Search Engine এর জন্য */}
      <meta name="robots" content="index, follow" />
    </Helmet>
  );
};

export default SEO;