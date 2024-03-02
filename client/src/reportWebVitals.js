const reportWebVitals = onPerfEntry => {

  // industry average:
  // all industry average numbers are in milliseconds
  const avgCLS = 0.1;
  const avgFID = 100;
  const avgFCP = 1800; 
  const avgLCP = 2500;
  const avgTTFB = 200;

  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(metric => {
        console.log('Cumulative Layout Shift (CLS):', ( metric.value / avgCLS ) * 100);
        // onPerfEntry(metric);
      });
      getFID(metric => {
        console.log('First Input Delay (FID):', metric.value);
        // onPerfEntry(metric);
      });
      getFCP(metric => {
        console.log('First Contentful Paint (FCP) compared to standard:', ((metric.value - avgFCP) / avgFCP) * 100 + "%");
        console.log('First Contentful Paint (FCP) value:', metric.value);
        // onPerfEntry(metric);
      });
      getLCP(metric => {
        console.log('Largest Contentful Paint (LCP):', metric.value);
        // onPerfEntry(metric);
      });
      getTTFB(metric => {
        console.log('Time to First Byte (TTFB):', metric.value);
        // onPerfEntry(metric);
      });
    });
  }
};

export default reportWebVitals;
