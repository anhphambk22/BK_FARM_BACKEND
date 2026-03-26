import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();

const SOURCE_URL = 'https://giacaphe.com/';
const WEATHER_SOURCE_URL = 'https://thoitiet.vn';
const WEATHER_CACHE_TTL_MS = 2 * 60 * 1000;

const WEST_HIGHLANDS_PROVINCES = [
  { slug: 'lam-dong', name: 'Lâm Đồng' },
  { slug: 'dak-lak', name: 'Đắk Lắk' },
  { slug: 'gia-lai', name: 'Gia Lai' },
];

let weatherCache = {
  updatedAt: 0,
  payload: null,
};

function cleanText(value) {
  return value
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractFirst(html, regex, fallback = '') {
  const match = html.match(regex);
  if (!match) return fallback;
  return cleanText(match[1] || fallback);
}

function extractMetricByLabel(html, label) {
  const escapedLabel = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(
    `<span[^>]*>${escapedLabel}<\\/span>[\\s\\S]*?<span[^>]*class=\"text-white op-8 fw-bold\"[^>]*>([\\s\\S]*?)<\\/span>`,
    'i'
  );
  return extractFirst(html, regex);
}

async function fetchProvinceWeather(province) {
  const url = `${WEATHER_SOURCE_URL}/${province.slug}`;
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 BKFarmBackend/1.0',
    },
    timeout: 15000,
  });

  if (!response.ok) {
    throw new Error(`Không thể lấy thời tiết ${province.name} (HTTP ${response.status})`);
  }

  const html = await response.text();

  const currentTemp = extractFirst(
    html,
    /<span[^>]*class=\"current-temperature\"[^>]*>([\s\S]*?)<\/span>/i
  );
  const condition = extractFirst(
    html,
    /<p[^>]*class=\"overview-caption-item overview-caption-item-detail\"[^>]*>([\s\S]*?)<\/p>/i
  );
  const feelsLike = extractFirst(
    html,
    /<p[^>]*class=\"overview-caption-item overview-caption-summary-detail\"[^>]*>([\s\S]*?)<\/p>/i
  );

  const lowHigh = extractMetricByLabel(html, 'Thấp/Cao');
  const humidity = extractMetricByLabel(html, 'Độ ẩm');
  const wind = extractMetricByLabel(html, 'Gió');

  if (!currentTemp || !condition) {
    throw new Error(`Không phân tích được dữ liệu thời tiết cho ${province.name}`);
  }

  return {
    province: province.name,
    slug: province.slug,
    url,
    currentTemp,
    condition,
    feelsLike,
    lowHigh,
    humidity,
    wind,
  };
}

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

router.get('/weather/west-highlands', async (req, res) => {
  try {
    const now = Date.now();
    if (weatherCache.payload && now - weatherCache.updatedAt < WEATHER_CACHE_TTL_MS) {
      return res.json({
        ...weatherCache.payload,
        cached: true,
      });
    }

    const provinces = await Promise.all(WEST_HIGHLANDS_PROVINCES.map((province) => fetchProvinceWeather(province)));

    const payload = {
      source: WEATHER_SOURCE_URL,
      fetchedAt: new Date().toISOString(),
      provinces,
      cached: false,
    };

    weatherCache = {
      updatedAt: now,
      payload,
    };

    return res.json(payload);
  } catch (err) {
    console.error('West Highlands weather fetch error:', err);
    return res.status(500).json({ message: 'Không lấy được dữ liệu thời tiết Tây Nguyên.' });
  }
});

export default router;
