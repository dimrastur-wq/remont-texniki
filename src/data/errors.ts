export interface ErrorCode {
  id: string;
  slug: string;
  brand: string;
  appliance: string;
  code: string;
  description: string;
  cause: string;
  urgency: 'high' | 'medium' | 'low';
}

export const ERROR_CODES: ErrorCode[] = ([
  { id: 'bosch-e01', brand: 'Bosch', appliance: 'Стиральная машина', code: 'E01 / F01', description: 'Нет нагрева воды', cause: 'Неисправен ТЭН или термостат', urgency: 'high' },
  { id: 'bosch-e03', brand: 'Bosch', appliance: 'Стиральная машина', code: 'E03 / F03', description: 'Ошибка слива', cause: 'Засор помпы или патрубка слива', urgency: 'medium' },
  { id: 'bosch-e04', brand: 'Bosch', appliance: 'Стиральная машина', code: 'E04 / F04', description: 'Переполнение водой', cause: 'Неисправен прессостат или клапан заливной', urgency: 'high' },
  { id: 'bosch-e17', brand: 'Bosch', appliance: 'Стиральная машина', code: 'E17 / F17', description: 'Нет набора воды', cause: 'Перекрыт кран, засор фильтра заливного клапана', urgency: 'medium' },
  { id: 'bosch-e23', brand: 'Bosch', appliance: 'Стиральная машина', code: 'E23 / F23', description: 'Протечка воды (AquaStop)', cause: 'Утечка в шлангах, уплотнениях или баке', urgency: 'high' },

  { id: 'indesit-f01', brand: 'Indesit', appliance: 'Стиральная машина', code: 'F01', description: 'Неисправность мотора', cause: 'Обрыв обмотки, щётки, нет контакта', urgency: 'high' },
  { id: 'indesit-f02', brand: 'Indesit', appliance: 'Стиральная машина', code: 'F02', description: 'Нет сигнала скорости мотора', cause: 'Неисправен тахогенератор или ремень слетел', urgency: 'high' },
  { id: 'indesit-f03', brand: 'Indesit', appliance: 'Стиральная машина', code: 'F03', description: 'Неисправность NTC-датчика температуры', cause: 'Обрыв или короткое замыкание датчика', urgency: 'medium' },
  { id: 'indesit-f05', brand: 'Indesit', appliance: 'Стиральная машина', code: 'F05', description: 'Ошибка слива (нет слива за 3 мин.)', cause: 'Засор помпы, фильтра или патрубка', urgency: 'medium' },
  { id: 'indesit-f07', brand: 'Indesit', appliance: 'Стиральная машина', code: 'F07', description: 'Нет нагрева воды', cause: 'Неисправен ТЭН, термостат или трiac', urgency: 'high' },
  { id: 'indesit-f08', brand: 'Indesit', appliance: 'Стиральная машина', code: 'F08', description: 'Перегрев воды (NTC)', cause: 'Короткое замыкание датчика температуры', urgency: 'high' },
  { id: 'indesit-f12', brand: 'Indesit', appliance: 'Стиральная машина', code: 'F12', description: 'Нет связи с модулем дисплея', cause: 'Неисправна шина связи или плата', urgency: 'medium' },

  { id: 'lg-le', brand: 'LG', appliance: 'Стиральная машина', code: 'LE', description: 'Ошибка мотора (перегрузка)', cause: 'Перегруз барабана, повреждён ротор/статор инвертора', urgency: 'high' },
  { id: 'lg-oe', brand: 'LG', appliance: 'Стиральная машина', code: 'OE', description: 'Ошибка слива', cause: 'Засор помпы или патрубка', urgency: 'medium' },
  { id: 'lg-ue', brand: 'LG', appliance: 'Стиральная машина', code: 'UE', description: 'Дисбаланс барабана', cause: 'Неравномерная загрузка белья', urgency: 'low' },
  { id: 'lg-de', brand: 'LG', appliance: 'Стиральная машина', code: 'DE / DE1', description: 'Дверь не закрыта', cause: 'Неисправен замок ULD или сломан зацеп люка', urgency: 'medium' },
  { id: 'lg-fe', brand: 'LG', appliance: 'Стиральная машина', code: 'FE', description: 'Переполнение водой', cause: 'Неисправен клапан заливной (не закрывается)', urgency: 'high' },
  { id: 'lg-te', brand: 'LG', appliance: 'Стиральная машина', code: 'tE', description: 'Ошибка датчика температуры', cause: 'Неисправен NTC-датчик', urgency: 'medium' },

  { id: 'samsung-4e', brand: 'Samsung', appliance: 'Стиральная машина', code: '4E / 4C', description: 'Нет набора воды', cause: 'Перекрыт кран, засор фильтра клапана', urgency: 'medium' },
  { id: 'samsung-5e', brand: 'Samsung', appliance: 'Стиральная машина', code: '5E / 5C', description: 'Ошибка слива', cause: 'Засор помпы или патрубка слива', urgency: 'medium' },
  { id: 'samsung-3e', brand: 'Samsung', appliance: 'Стиральная машина', code: '3E / 3C', description: 'Ошибка мотора', cause: 'Обрыв или КЗ в обмотке мотора, BLDC-инвертор', urgency: 'high' },
  { id: 'samsung-he', brand: 'Samsung', appliance: 'Стиральная машина', code: 'HE / HC', description: 'Перегрев воды', cause: 'Неисправен ТЭН или датчик температуры', urgency: 'high' },
  { id: 'samsung-de', brand: 'Samsung', appliance: 'Стиральная машина', code: 'DE / DC', description: 'Дверь не закрыта', cause: 'Неисправен замок люка', urgency: 'medium' },

  { id: 'samsung-fr-1e', brand: 'Samsung', appliance: 'Холодильник', code: '1E / 1C', description: 'Ошибка датчика температуры холодильника', cause: 'Обрыв NTC-датчика морозилки', urgency: 'high' },
  { id: 'samsung-fr-2e', brand: 'Samsung', appliance: 'Холодильник', code: '2E / 2C', description: 'Ошибка датчика морозилки', cause: 'КЗ или обрыв NTC-датчика морозилки', urgency: 'high' },
  { id: 'samsung-fr-88', brand: 'Samsung', appliance: 'Холодильник', code: '88 88', description: 'Демонстрационный режим', cause: 'Режим включён — отключить двойным нажатием Power Freeze+Fridge', urgency: 'low' },

  { id: 'lg-fr-erff', brand: 'LG', appliance: 'Холодильник', code: 'Er FF', description: 'Вентилятор морозилки', cause: 'Мотор вентилятора заморозился или вышел из строя', urgency: 'high' },
  { id: 'lg-fr-erdh', brand: 'LG', appliance: 'Холодильник', code: 'Er dH', description: 'Ошибка размораживания', cause: 'Неисправен нагреватель разморозки или датчик', urgency: 'high' },
  { id: 'lg-fr-erco', brand: 'LG', appliance: 'Холодильник', code: 'Er CO', description: 'Нет связи между платами', cause: 'Повреждён шлейф или неисправна плата', urgency: 'high' },
] as Omit<ErrorCode, 'slug'>[]).map(e => ({ ...e, slug: e.id }));

export const ERROR_BRANDS = [...new Set(ERROR_CODES.map(e => e.brand))];
export const ERROR_APPLIANCES = [...new Set(ERROR_CODES.map(e => e.appliance))];
