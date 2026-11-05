const https = require('https');
const fs = require('fs');
const path = require('path');

const cssUrl = 'https://balrakshabharat.org/wp-content/themes/ngo/css/nwhmpg/mystyle.min.css?v=1.14';

https.get(cssUrl, (res) => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    console.log('CSS length:', data.length);
    fs.writeFileSync(path.join(__dirname, 'reference_style.css'), data, 'utf8');

    // Look for key layout properties: container max-widths, font families, box-shadows, border-radius
    const fonts = data.match(/font-family:[^;}]+/gi) || [];
    console.log('Unique font families in CSS:', [...new Set(fonts)].slice(0, 10));

    const shadows = data.match(/box-shadow:[^;}]+/gi) || [];
    console.log('Unique shadows in CSS:', [...new Set(shadows)].slice(0, 10));

    const radius = data.match(/border-radius:[^;}]+/gi) || [];
    console.log('Unique border-radius in CSS:', [...new Set(radius)].slice(0, 10));

    const bgColors = data.match(/background(?:-color)?:[^;}]+/gi) || [];
    console.log('Sample background colors in CSS:', [...new Set(bgColors)].slice(0, 15));
  });
}).on('error', err => console.log('CSS fetch error:', err.message));

