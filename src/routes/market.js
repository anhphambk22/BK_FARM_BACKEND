import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();

const SOURCE_URL = 'https://giacaphe.com/';

function extractCssContentMap(html) {
  const map = new Map();
  const regex = /\.([A-Za-z0-9_-]+)::after\s*\{\s*content:'([^']*)';\s*\}/g;
  let match;
  while ((match = regex.exec(html)) !== null) {
    map.set(match[1], match[2]);
  }
  return map;
}

function extractGlobalRows(html) {
  const londonMatch = html.match(/<td[^>]*data-thi-truong='RC'[^>]*>.*?<td[^>]*data-price='([^']+)'[^>]*>.*?<span[^>]*data-price='([^']+)'/s);
  const nyMatch = html.match(/<td[^>]*data-thi-truong='KC'[^>]*>.*?<td[^>]*data-price='([^']+)'[^>]*>.*?<span[^>]*data-price='([^']+)'/s);

  return {
    londonPrice: londonMatch?.[1] || '',
    londonChange: londonMatch?.[2] || '',
    nyPrice: nyMatch?.[1] || '',
    nyChange: nyMatch?.[2] || '',
  };
}

function extractDomesticRows(html, cssMap) {
  const rows = [...html.matchAll(/<tr>\s*<td>([^<]+)<\/td>\s*<td class='gnd-gia'>\s*<span class='[^']*\s([A-Za-z0-9_-]+)'[^>]*>\s*<\/span>\s*<\/td>\s*<td class='price_change'>\s*<span class='[^']*\s([A-Za-z0-9_-]+)'[^>]*>\s*<\/span>/gs)];

  const domestic = rows
    .map((row) => {
      const label = row[1] || '';
      const priceClass = row[2] || '';
      const changeClass = row[3] || '';

      return {
        label,
        price: cssMap.get(priceClass) || '',
        change: cssMap.get(changeClass) || '',
      };
    })
    .filter((row) => row.price && row.change && !/USD|London|New York|Tỷ giá/i.test(row.label));

  return domestic;
}

router.get('/coffee-prices', async (req, res) => {
  try {
    const response = await fetch(SOURCE_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 BKFarmBackend/1.0',
      },
      timeout: 15000,
    });

    if (!response.ok) {
      return res.status(502).json({ message: `Không lấy được dữ liệu giá cà phê (HTTP ${response.status}).` });
    }

    const html = await response.text();
    const cssMap = extractCssContentMap(html);
    const { londonPrice, londonChange, nyPrice, nyChange } = extractGlobalRows(html);
    const domesticRows = extractDomesticRows(html, cssMap);
    const dakLak = domesticRows[0];

    if (!londonPrice || !nyPrice || !dakLak?.price) {
      return res.status(502).json({ message: 'Không phân tích được dữ liệu giá cà phê từ nguồn.' });
    }

    return res.json({
      source: SOURCE_URL,
      updatedAt: new Date().toISOString(),
      prices: [
        {
          market: 'Việt Nam (Robusta)',
          price: dakLak.price,
          unit: 'VNĐ/kg',
          trend: dakLak.change,
        },
        {
          market: 'London (Robusta)',
          price: londonPrice,
          unit: 'USD/tấn',
          trend: londonChange,
        },
        {
          market: 'New York (Arabica)',
          price: nyPrice,
          unit: 'US cent/lb',
          trend: nyChange,
        },
      ],
    });
  } catch (err) {
    console.error('Market price fetch error:', err);
    return res.status(500).json({ message: 'Lỗi server khi cập nhật giá cà phê.' });
  }
});

export default router;
