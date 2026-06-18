export interface ShopPart {
  id: string;
  name: string;
  category: 'Стиральные машины' | 'Холодильники' | 'Микроволновки' | 'Водонагреватели';
  subcategory: string;
  brands: string[];
  condition: 'Новый' | 'Б/У';
  basePrice: number;
  inStock: boolean;
  popular?: boolean;
}

const MARKUP = 1.3;
const MASTER_DISCOUNT = 0.85;

export function retailPrice(part: ShopPart): number {
  return Math.round(part.basePrice * MARKUP);
}

export function masterPrice(part: ShopPart): number {
  return Math.round(part.basePrice * MARKUP * MASTER_DISCOUNT);
}

export function formatPrice(p: number): string {
  return p.toLocaleString('ru-RU') + ' ₽';
}

export const SHOP_PARTS: ShopPart[] = [
  // ── Стиральные машины ─────────────────────────────────────────

  { id: 'sm-ten-lg-1800', name: 'ТЭН 1800 Вт для LG / Samsung прямой', category: 'Стиральные машины', subcategory: 'ТЭНы', brands: ['LG', 'Samsung', 'Candy'], condition: 'Новый', basePrice: 780, inStock: true, popular: true },
  { id: 'sm-ten-bsh-1950', name: 'ТЭН 1950 Вт для Bosch / Siemens', category: 'Стиральные машины', subcategory: 'ТЭНы', brands: ['Bosch', 'Siemens', 'Neff'], condition: 'Новый', basePrice: 1100, inStock: true, popular: true },
  { id: 'sm-ten-ind-1700', name: 'ТЭН 1700 Вт U-образный Indesit / Ariston', category: 'Стиральные машины', subcategory: 'ТЭНы', brands: ['Indesit', 'Ariston', 'Hotpoint'], condition: 'Новый', basePrice: 850, inStock: true, popular: true },
  { id: 'sm-ten-2000-univ', name: 'ТЭН 2000 Вт универсальный 450 мм', category: 'Стиральные машины', subcategory: 'ТЭНы', brands: ['Samsung', 'LG', 'Electrolux'], condition: 'Новый', basePrice: 920, inStock: true },

  { id: 'sm-pump-askoll', name: 'Помпа слива ASKOLL M231 30 Вт', category: 'Стиральные машины', subcategory: 'Помпы', brands: ['Indesit', 'Ariston', 'Whirlpool', 'Candy'], condition: 'Новый', basePrice: 980, inStock: true, popular: true },
  { id: 'sm-pump-plaset', name: 'Помпа слива PLASET 54XT 30 Вт', category: 'Стиральные машины', subcategory: 'Помпы', brands: ['LG', 'Samsung', 'Daewoo'], condition: 'Новый', basePrice: 1050, inStock: true, popular: true },
  { id: 'sm-pump-bosch', name: 'Помпа слива Hanning DP025 Bosch', category: 'Стиральные машины', subcategory: 'Помпы', brands: ['Bosch', 'Siemens', 'Neff'], condition: 'Новый', basePrice: 1250, inStock: true },
  { id: 'sm-pump-ebs', name: 'Помпа слива EBS универсальная', category: 'Стиральные машины', subcategory: 'Помпы', brands: ['Electrolux', 'AEG', 'Zanussi', 'Beko'], condition: 'Новый', basePrice: 900, inStock: true },

  { id: 'sm-brg-6204', name: 'Подшипник барабана 6204 2RS (пара)', category: 'Стиральные машины', subcategory: 'Подшипники', brands: ['Samsung', 'LG', 'Indesit'], condition: 'Новый', basePrice: 290, inStock: true, popular: true },
  { id: 'sm-brg-6205', name: 'Подшипник барабана 6205 2RS (пара)', category: 'Стиральные машины', subcategory: 'Подшипники', brands: ['Bosch', 'Siemens', 'Samsung'], condition: 'Новый', basePrice: 320, inStock: true, popular: true },
  { id: 'sm-brg-6206', name: 'Подшипник барабана 6206 2RS (пара)', category: 'Стиральные машины', subcategory: 'Подшипники', brands: ['LG', 'Candy', 'Haier'], condition: 'Новый', basePrice: 380, inStock: true },
  { id: 'sm-brg-6304', name: 'Подшипник барабана 6304 2RS (пара)', category: 'Стиральные машины', subcategory: 'Подшипники', brands: ['Indesit', 'Ariston', 'Hotpoint'], condition: 'Новый', basePrice: 260, inStock: true },

  { id: 'sm-belt-1268j3', name: 'Ремень приводной 1268 J3 EL', category: 'Стиральные машины', subcategory: 'Ремни', brands: ['Indesit', 'Ariston', 'Whirlpool'], condition: 'Новый', basePrice: 280, inStock: true, popular: true },
  { id: 'sm-belt-1270j5', name: 'Ремень приводной 1270 J5 EL', category: 'Стиральные машины', subcategory: 'Ремни', brands: ['Samsung', 'LG', 'Beko'], condition: 'Новый', basePrice: 300, inStock: true, popular: true },
  { id: 'sm-belt-1245j5', name: 'Ремень приводной 1245 J5 Bosch', category: 'Стиральные машины', subcategory: 'Ремни', brands: ['Bosch', 'Siemens'], condition: 'Новый', basePrice: 350, inStock: true },

  { id: 'sm-seal-samsung', name: 'Манжета люка Samsung WF-серия', category: 'Стиральные машины', subcategory: 'Манжеты', brands: ['Samsung'], condition: 'Новый', basePrice: 820, inStock: true, popular: true },
  { id: 'sm-seal-lg', name: 'Манжета люка LG Direct Drive', category: 'Стиральные машины', subcategory: 'Манжеты', brands: ['LG'], condition: 'Новый', basePrice: 890, inStock: true },
  { id: 'sm-seal-bosch', name: 'Манжета люка Bosch WAN / WAx серия', category: 'Стиральные машины', subcategory: 'Манжеты', brands: ['Bosch', 'Siemens'], condition: 'Новый', basePrice: 1150, inStock: true },
  { id: 'sm-seal-indesit', name: 'Манжета люка Indesit / Ariston', category: 'Стиральные машины', subcategory: 'Манжеты', brands: ['Indesit', 'Ariston', 'Hotpoint'], condition: 'Б/У', basePrice: 480, inStock: true },

  { id: 'sm-brush-indesit', name: 'Щётки двигателя Indesit 5×14 мм (пара)', category: 'Стиральные машины', subcategory: 'Щётки', brands: ['Indesit', 'Ariston', 'Whirlpool'], condition: 'Новый', basePrice: 320, inStock: true },
  { id: 'sm-brush-lg', name: 'Щётки двигателя LG / Samsung 5×12.5 мм', category: 'Стиральные машины', subcategory: 'Щётки', brands: ['LG', 'Samsung', 'Daewoo'], condition: 'Новый', basePrice: 290, inStock: true },
  { id: 'sm-brush-bosch', name: 'Щётки двигателя Bosch / Siemens 6×14 мм', category: 'Стиральные машины', subcategory: 'Щётки', brands: ['Bosch', 'Siemens'], condition: 'Новый', basePrice: 380, inStock: false },

  { id: 'sm-pressоstat', name: 'Прессостат (датчик уровня воды) универсальный', category: 'Стиральные машины', subcategory: 'Датчики', brands: ['Samsung', 'LG', 'Indesit', 'Bosch'], condition: 'Новый', basePrice: 520, inStock: true },
  { id: 'sm-lock-dul', name: 'Замок люка (ULD) Samsung / Indesit', category: 'Стиральные машины', subcategory: 'Замки', brands: ['Samsung', 'Indesit', 'Ariston'], condition: 'Новый', basePrice: 680, inStock: true, popular: true },

  // ── Холодильники ──────────────────────────────────────────────

  { id: 'fr-compressor-atlant', name: 'Компрессор Атлант / Минск (Embraco)', category: 'Холодильники', subcategory: 'Компрессоры', brands: ['Атлант', 'Минск'], condition: 'Новый', basePrice: 3200, inStock: true, popular: true },
  { id: 'fr-compressor-samsung', name: 'Компрессор Samsung R600a RP56G', category: 'Холодильники', subcategory: 'Компрессоры', brands: ['Samsung'], condition: 'Новый', basePrice: 4200, inStock: true, popular: true },
  { id: 'fr-compressor-lg', name: 'Компрессор LG LMBN series', category: 'Холодильники', subcategory: 'Компрессоры', brands: ['LG'], condition: 'Новый', basePrice: 3900, inStock: false },

  { id: 'fr-thermostat-k59', name: 'Термостат K59 механический (холодильник)', category: 'Холодильники', subcategory: 'Термостаты', brands: ['Атлант', 'Indesit', 'Hotpoint', 'Минск'], condition: 'Новый', basePrice: 480, inStock: true, popular: true },
  { id: 'fr-thermostat-ntc', name: 'Датчик температуры NTC для инверторных', category: 'Холодильники', subcategory: 'Термостаты', brands: ['Samsung', 'LG', 'Bosch'], condition: 'Новый', basePrice: 320, inStock: true },

  { id: 'fr-start-relay', name: 'Пусковое реле РТК-Х / Danfoss 103N0021', category: 'Холодильники', subcategory: 'Реле', brands: ['Атлант', 'Indesit', 'Ariston', 'Минск'], condition: 'Новый', basePrice: 380, inStock: true, popular: true },
  { id: 'fr-ptc-relay', name: 'Реле пусковое PTC Embraco RNLG4EP', category: 'Холодильники', subcategory: 'Реле', brands: ['Samsung', 'LG', 'Candy'], condition: 'Новый', basePrice: 290, inStock: true },

  { id: 'fr-door-seal-atlant', name: 'Уплотнитель двери холодильника Атлант', category: 'Холодильники', subcategory: 'Уплотнители', brands: ['Атлант'], condition: 'Новый', basePrice: 650, inStock: true, popular: true },
  { id: 'fr-door-seal-indesit', name: 'Уплотнитель двери Indesit / Hotpoint', category: 'Холодильники', subcategory: 'Уплотнители', brands: ['Indesit', 'Ariston', 'Hotpoint'], condition: 'Новый', basePrice: 720, inStock: true },
  { id: 'fr-door-seal-samsung', name: 'Уплотнитель двери Samsung холодильник', category: 'Холодильники', subcategory: 'Уплотнители', brands: ['Samsung'], condition: 'Новый', basePrice: 850, inStock: false },

  { id: 'fr-fan-motor', name: 'Мотор вентилятора морозильной камеры DC 12В', category: 'Холодильники', subcategory: 'Вентиляторы', brands: ['Samsung', 'LG', 'Bosch'], condition: 'Новый', basePrice: 780, inStock: true },
  { id: 'fr-defrost-heater', name: 'Нагреватель размораживания (дефростер)', category: 'Холодильники', subcategory: 'Нагреватели', brands: ['Samsung', 'LG', 'Атлант'], condition: 'Новый', basePrice: 540, inStock: true },

  // ── Микроволновки ─────────────────────────────────────────────

  { id: 'mw-magnetron-samsung', name: 'Магнетрон Samsung 2M211 / 2M213', category: 'Микроволновки', subcategory: 'Магнетроны', brands: ['Samsung'], condition: 'Новый', basePrice: 2100, inStock: true, popular: true },
  { id: 'mw-magnetron-lg', name: 'Магнетрон LG 2M246 / 2M214', category: 'Микроволновки', subcategory: 'Магнетроны', brands: ['LG'], condition: 'Новый', basePrice: 2300, inStock: true, popular: true },
  { id: 'mw-magnetron-panasonic', name: 'Магнетрон Panasonic 2M261 универсальный', category: 'Микроволновки', subcategory: 'Магнетроны', brands: ['Panasonic', 'Sharp', 'Gorenje'], condition: 'Новый', basePrice: 2600, inStock: false },

  { id: 'mw-mica-plate', name: 'Слюдяная пластина защитная (универсальная)', category: 'Микроволновки', subcategory: 'Расходники', brands: ['Samsung', 'LG', 'Bosch', 'Panasonic'], condition: 'Новый', basePrice: 120, inStock: true, popular: true },
  { id: 'mw-turntable-motor', name: 'Мотор вращающегося поддона 3 Вт', category: 'Микроволновки', subcategory: 'Двигатели', brands: ['Samsung', 'LG', 'Electrolux'], condition: 'Новый', basePrice: 350, inStock: true },
  { id: 'mw-diode', name: 'Диод высоковольтный HV CL04-12 (пара)', category: 'Микроволновки', subcategory: 'Электроника', brands: ['Samsung', 'LG', 'Bosch', 'Panasonic'], condition: 'Новый', basePrice: 180, inStock: true },
  { id: 'mw-capacitor', name: 'Конденсатор высоковольтный 0.91 мкФ / 2100 В', category: 'Микроволновки', subcategory: 'Электроника', brands: ['Samsung', 'LG', 'Panasonic'], condition: 'Новый', basePrice: 420, inStock: true },
  { id: 'mw-door-switch', name: 'Концевой выключатель двери (набор 3 шт.)', category: 'Микроволновки', subcategory: 'Выключатели', brands: ['Samsung', 'LG', 'Bosch'], condition: 'Новый', basePrice: 290, inStock: true },
  { id: 'mw-grill-heater', name: 'Нагреватель гриля (кварцевый) 900 Вт', category: 'Микроволновки', subcategory: 'Нагреватели', brands: ['Samsung', 'LG', 'Electrolux'], condition: 'Новый', basePrice: 680, inStock: false },

  // ── Водонагреватели ───────────────────────────────────────────

  { id: 'wh-ten-1500', name: 'ТЭН 1500 Вт для водонагревателя прямой', category: 'Водонагреватели', subcategory: 'ТЭНы', brands: ['Ariston', 'Thermex', 'Electrolux', 'Gorenje'], condition: 'Новый', basePrice: 780, inStock: true, popular: true },
  { id: 'wh-ten-2000', name: 'ТЭН 2000 Вт для водонагревателя сухой', category: 'Водонагреватели', subcategory: 'ТЭНы', brands: ['Ariston', 'Termex', 'Haier'], condition: 'Новый', basePrice: 1050, inStock: true, popular: true },
  { id: 'wh-anode-mg', name: 'Анод магниевый M6×200 мм для бойлера', category: 'Водонагреватели', subcategory: 'Аноды', brands: ['Ariston', 'Thermex', 'Electrolux'], condition: 'Новый', basePrice: 250, inStock: true, popular: true },
  { id: 'wh-thermostat', name: 'Термостат регулируемый 16А капиллярный', category: 'Водонагреватели', subcategory: 'Термостаты', brands: ['Ariston', 'Termex', 'Gorenje', 'Garanterm'], condition: 'Новый', basePrice: 480, inStock: true, popular: true },
  { id: 'wh-safety-valve', name: 'Предохранительный клапан 8 бар 3/4"', category: 'Водонагреватели', subcategory: 'Клапаны', brands: ['Ariston', 'Thermex', 'любой'], condition: 'Новый', basePrice: 320, inStock: true },
  { id: 'wh-flange-ariston', name: 'Фланец ТЭНа в сборе Ariston ABS PRO', category: 'Водонагреватели', subcategory: 'Фланцы', brands: ['Ariston'], condition: 'Новый', basePrice: 1200, inStock: false },
];

export const SHOP_CATEGORIES = [
  'Стиральные машины',
  'Холодильники',
  'Микроволновки',
  'Водонагреватели',
] as const;

export type ShopCategory = typeof SHOP_CATEGORIES[number];
