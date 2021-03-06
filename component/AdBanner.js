import React, { useEffect } from "react";

const AdBanner = ({ clientId, slot }) => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {}
  }, []);
  return (
    <ins className="adsbygoogle"
     style={{display: 'block' }}
     data-full-width-responsive="true"
     data-ad-format="auto"
     data-ad-client={clientId}
     data-ad-slot={slot}></ins>
  
  );
};

export default AdBanner;
