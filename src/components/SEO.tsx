import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description?: string;
  image?: string;
  url?: string;
}

const SEO: React.FC<SEOProps> = ({ title, description, image, url }) => {
  const siteTitle = "Study Corner - Kafa'ah";
  const fullTitle = `${title} | ${siteTitle}`;
  const defaultDesc = "Study Corner by Kafa'ah – অধ্যায়ভিত্তিক মডেল টেস্ট ও পরীক্ষার প্রস্তুতি। SSC, HSC ও এডমিশন পরীক্ষার্থীদের জন্য সম্পূর্ণ ফ্রি অনলাইন পরীক্ষা ইনশাআল্লাহ।";
  const defaultImage = "https://raw.githubusercontent.com/kafaahbd/Eng2/refs/heads/main/studyy.jpg";
  const siteUrl = "https://study.kafaahbd.com";

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDesc} />
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || defaultDesc} />
      <meta property="og:image" content={image || defaultImage} />
      <meta property="og:url" content={url ? `${siteUrl}${url}` : siteUrl} />
      
      {/* Twitter */}
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || defaultDesc} />
      <meta name="twitter:image" content={image || defaultImage} />
    </Helmet>
  );
};

export default SEO;
