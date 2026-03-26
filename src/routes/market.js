import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();

const SOURCE_URL = 'https://giacaphe.com/';
const WEATHER_SOURCE_URL = 'https://thoitiet.vn';
const WEATHER_CACHE_TTL_MS = 15 * 1000;
const EXPORTER_SOURCE_URL =
  'https://trangvangvietnam.com/tagprovince/50062680/nh%C3%A0-xu%E1%BA%A5t-kh%E1%BA%A9u-c%C3%A0-ph%C3%AA-%E1%BB%9F-t%E1%BA%A1i-tp.-h%E1%BB%93-ch%C3%AD-minh-(tphcm).html';
const EXPORTER_CACHE_TTL_MS = 15 * 1000;

const WEST_HIGHLANDS_PROVINCES = [
  { slug: 'lam-dong', name: 'Lâm Đồng' },
  { slug: 'dak-lak', name: 'Đắk Lắk' },
  { slug: 'gia-lai', name: 'Gia Lai' },
];

let weatherCache = {
  updatedAt: 0,
  payload: null,
};

let exporterCache = {
  updatedAt: 0,
  payload: null,
};

let coffeeCache = {
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
    .filter((row) => row.price && !/USD|London|New York|Tỷ giá/i.test(row.label));

  return domestic;
}

function normalizeVietnameseText(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

function decodeHtmlEntities(value) {
  return value
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function extractTrangVangExporters(html, limit = 12) {
  const blocks = [];
  const listingRegex =
    /<h2[^>]*>\s*<a[^>]*href="([^"]*\/listings\/[^"]+)"[^>]*>([\s\S]*?)<\/a>\s*<\/h2>([\s\S]*?)(?=<h2[^>]*>\s*<a[^>]*href="[^"]*\/listings\/|$)/gi;

  let match;
  while ((match = listingRegex.exec(html)) !== null) {
    const detailUrlRaw = match[1] || '';
    const nameRaw = match[2] || '';
    const blockRaw = match[3] || '';

    const detailUrl = detailUrlRaw.startsWith('http')
      ? detailUrlRaw
      : `https://trangvangvietnam.com${detailUrlRaw}`;
    const name = cleanText(decodeHtmlEntities(nameRaw));

    const phoneMatch = blockRaw.match(/href="tel:([^"]+)"/i);
    const phone = phoneMatch ? cleanText(phoneMatch[1]).replace(/\./g, '') : '';

    const blockText = cleanText(decodeHtmlEntities(blockRaw));
    let address = '';

    const addressMatch1 = blockText.match(/Ở TẠI TP\. HỒ CHÍ MINH\s*(.*?)\s*Việt Nam/i);
    if (addressMatch1) {
      address = cleanText(addressMatch1[1]);
    }

    if (!address) {
      const addressMatch2 = blockText.match(/TP\. Hồ Chí Minh\s*,?\s*Việt Nam\s*(.*?)\s*(?:Hotline|BY YELLOW PAGES|$)/i);
      if (addressMatch2) {
        address = cleanText(addressMatch2[1]);
      }
    }

    blocks.push({
      name,
      detailUrl,
      phone,
      address: address || 'TP. Hồ Chí Minh',
    });

    if (blocks.length >= limit) break;
  }

  return blocks;
}

function pickProvinceRows(domesticRows) {
  const targets = [
    { key: 'dak_lak', label: 'Đắk Lắk', aliases: ['dak lak'] },
    { key: 'gia_lai', label: 'Gia Lai', aliases: ['gia lai'] },
    { key: 'lam_dong', label: 'Lâm Đồng', aliases: ['lam dong'] },
  ];

  return targets
    .map((target) => {
      const found = domesticRows.find((row) => {
        const normalizedLabel = normalizeVietnameseText(row.label || '');
        return target.aliases.some((alias) => normalizedLabel.includes(alias));
      });

      if (!found) return null;
      return {
        key: target.key,
        province: target.label,
        price: found.price,
        trend: found.change,
        unit: 'VNĐ/kg',
      };
    })
    .filter(Boolean);
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
    const provinceRows = pickProvinceRows(domesticRows);
    const dakLak = provinceRows.find((row) => row.key === 'dak_lak') || provinceRows[0] || domesticRows[0] || null;

    if (!dakLak?.price) {
      if (coffeeCache.payload) {
        return res.json({
          ...coffeeCache.payload,
          cached: true,
          warning: 'Nguồn dữ liệu thay đổi tạm thời, đang dùng bản gần nhất.',
        });
      }
      return res.status(502).json({ message: 'Không phân tích được dữ liệu giá cà phê từ nguồn.' });
    }

    const payload = {
      source: SOURCE_URL,
      updatedAt: new Date().toISOString(),
      domesticPrices: provinceRows,
      prices: [
        {
          market: 'Việt Nam (Robusta)',
          price: dakLak.price,
          unit: 'VNĐ/kg',
          trend: dakLak.change || '--',
        },
        {
          market: 'London (Robusta)',
          price: londonPrice || '',
          unit: 'USD/tấn',
          trend: londonChange || '--',
        },
        {
          market: 'New York (Arabica)',
          price: nyPrice || '',
          unit: 'US cent/lb',
          trend: nyChange || '--',
        },
      ],
      cached: false,
    };

    coffeeCache = {
      updatedAt: Date.now(),
      payload,
    };

    return res.json(payload);
  } catch (err) {
    console.error('Market price fetch error:', err);
    if (coffeeCache.payload) {
      return res.json({
        ...coffeeCache.payload,
        cached: true,
        warning: 'Kết nối nguồn tạm thời gián đoạn, đang dùng dữ liệu gần nhất.',
      });
    }
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

router.get('/exporters/hcm', async (req, res) => {
  try {
    const now = Date.now();
    if (exporterCache.payload && now - exporterCache.updatedAt < EXPORTER_CACHE_TTL_MS) {
      return res.json({
        ...exporterCache.payload,
        cached: true,
      });
    }

    const response = await fetch(EXPORTER_SOURCE_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 BKFarmBackend/1.0',
      },
      timeout: 15000,
    });

    if (!response.ok) {
      return res.status(502).json({ message: `Không lấy được danh sách nhà xuất khẩu (HTTP ${response.status}).` });
    }

    const html = await response.text();
    const exporters = extractTrangVangExporters(html, 12);

    if (!exporters.length) {
      return res.status(502).json({ message: 'Không phân tích được danh sách nhà xuất khẩu từ Trang Vàng.' });
    }

    const payload = {
      source: EXPORTER_SOURCE_URL,
      fetchedAt: new Date().toISOString(),
      exporters,
      cached: false,
    };

    exporterCache = {
      updatedAt: now,
      payload,
    };

    return res.json(payload);
  } catch (err) {
    console.error('TrangVang exporters fetch error:', err);
    return res.status(500).json({ message: 'Không lấy được dữ liệu nhà xuất khẩu từ Trang Vàng.' });
  }
});

export default router;
