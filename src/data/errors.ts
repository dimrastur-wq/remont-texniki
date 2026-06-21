export interface ErrorCode {
  id: string;
  slug: string;
  brand: string;
  appliance: string;
  code: string;
  description: string;
  cause: string;
  urgency: 'high' | 'medium' | 'low';
  // Rich fields used by /oshibki/[slug] page
  title: string;
  meaning: string;
  keywords: string[];
  causes: string[];
  diySteps: string[];
  whenCallMaster: string;
  repairPrice: string;
}

interface RawError {
  id: string;
  brand: string;
  appliance: string;
  code: string;
  description: string;
  cause: string;
  urgency: 'high' | 'medium' | 'low';
  diySteps?: string[];
  whenCallMaster?: string;
  repairPrice?: string;
}

const repairByUrgency: Record<string, string> = {
  high: '1 500–4 500 ₽',
  medium: '800–2 500 ₽',
  low: 'от 500 ₽',
};

const whenCallByUrgency: Record<string, string> = {
  high: 'Немедленно вызовите мастера — самостоятельный ремонт опасен и может привести к дорогостоящим последствиям.',
  medium: 'Если самостоятельные проверки не помогли — обратитесь к мастеру. Откладывать ремонт не стоит.',
  low: 'Вызовите мастера если простые проверки не дали результата или проблема повторяется.',
};

function enrich(raw: RawError): ErrorCode {
  const causes = raw.cause.split(/,\s*|;\s*/).map(s => s.trim()).filter(Boolean);
  return {
    ...raw,
    slug: raw.id,
    title: `Ошибка ${raw.code} ${raw.appliance} ${raw.brand}: ${raw.description}`,
    meaning: `${raw.description}. ${raw.cause}.`,
    keywords: [
      `ошибка ${raw.code}`,
      `${raw.brand} ошибка ${raw.code}`,
      `${raw.appliance} ${raw.brand} код ${raw.code}`,
      `${raw.description.toLowerCase()} ${raw.brand}`,
      'ремонт бытовой техники Миасс',
    ],
    causes,
    diySteps: raw.diySteps ?? [
      'Выключите технику из розетки и подождите 10–15 минут (сброс ошибки).',
      'Проверьте подключение шлангов, дверцы и фильтров на наличие видимых проблем.',
      'Снова включите и запустите тестовую программу — посмотрите, воспроизводится ли ошибка.',
    ],
    whenCallMaster: raw.whenCallMaster ?? whenCallByUrgency[raw.urgency],
    repairPrice: raw.repairPrice ?? repairByUrgency[raw.urgency],
  };
}

const RAW: RawError[] = [
  { id: 'bosch-e01', brand: 'Bosch', appliance: 'Стиральная машина', code: 'E01 / F01', description: 'Нет нагрева воды', cause: 'Неисправен ТЭН, неисправен термостат', urgency: 'high',
    diySteps: ['Убедитесь, что напряжение в сети в норме (220 В).', 'Проверьте, не сработал ли автомат защиты.', 'Попробуйте программу без нагрева — если крутит, проблема в ТЭНе.'],
    repairPrice: '1 200–3 500 ₽' },
  { id: 'bosch-e03', brand: 'Bosch', appliance: 'Стиральная машина', code: 'E03 / F03', description: 'Ошибка слива', cause: 'Засор помпы, засор патрубка слива', urgency: 'medium',
    diySteps: ['Откройте сервисный люк и почистите фильтр помпы.', 'Проверьте сливной шланг на перегиб или засор.', 'Убедитесь, что сливное отверстие в канализации не заблокировано.'],
    repairPrice: '800–2 000 ₽' },
  { id: 'bosch-e04', brand: 'Bosch', appliance: 'Стиральная машина', code: 'E04 / F04', description: 'Переполнение водой', cause: 'Неисправен прессостат, неисправен заливной клапан', urgency: 'high',
    repairPrice: '1 500–3 000 ₽' },
  { id: 'bosch-e17', brand: 'Bosch', appliance: 'Стиральная машина', code: 'E17 / F17', description: 'Нет набора воды', cause: 'Перекрыт кран, засор фильтра заливного клапана', urgency: 'medium',
    diySteps: ['Проверьте, открыт ли кран подачи воды.', 'Снимите шланг заливной и прочистите сетчатый фильтр.', 'Убедитесь в давлении воды в системе.'],
    repairPrice: '700–1 800 ₽' },
  { id: 'bosch-e23', brand: 'Bosch', appliance: 'Стиральная машина', code: 'E23 / F23', description: 'Протечка воды (AquaStop)', cause: 'Утечка в шлангах, утечка в уплотнениях, утечка в баке', urgency: 'high',
    diySteps: ['Осмотрите шланги на предмет трещин или ослабленных соединений.', 'Проверьте под машиной — нет ли лужи.', 'Выключите воду и обратитесь к мастеру.'],
    repairPrice: '2 000–5 000 ₽' },

  { id: 'indesit-f01', brand: 'Indesit', appliance: 'Стиральная машина', code: 'F01', description: 'Неисправность мотора', cause: 'Обрыв обмотки, изношены щётки, нет контакта', urgency: 'high',
    repairPrice: '1 800–4 000 ₽' },
  { id: 'indesit-f02', brand: 'Indesit', appliance: 'Стиральная машина', code: 'F02', description: 'Нет сигнала скорости мотора', cause: 'Неисправен тахогенератор, ремень слетел', urgency: 'high',
    diySteps: ['Проверьте, вращается ли барабан руками при выключенной машине.', 'Если барабан не двигается — возможно слетел ремень.', 'Обратитесь к мастеру для диагностики тахогенератора.'],
    repairPrice: '1 500–3 500 ₽' },
  { id: 'indesit-f03', brand: 'Indesit', appliance: 'Стиральная машина', code: 'F03', description: 'Неисправность NTC-датчика температуры', cause: 'Обрыв датчика, короткое замыкание датчика', urgency: 'medium',
    repairPrice: '700–2 000 ₽' },
  { id: 'indesit-f05', brand: 'Indesit', appliance: 'Стиральная машина', code: 'F05', description: 'Ошибка слива (нет слива за 3 мин.)', cause: 'Засор помпы, засор фильтра, засор патрубка', urgency: 'medium',
    diySteps: ['Почистите фильтр помпы через сервисный люк внизу корпуса.', 'Проверьте сливной шланг на перегиб.', 'Запустите программу «Слив» отдельно.'],
    repairPrice: '800–2 000 ₽' },
  { id: 'indesit-f07', brand: 'Indesit', appliance: 'Стиральная машина', code: 'F07', description: 'Нет нагрева воды', cause: 'Неисправен ТЭН, неисправен термостат, неисправен triac', urgency: 'high',
    repairPrice: '1 200–3 500 ₽' },
  { id: 'indesit-f08', brand: 'Indesit', appliance: 'Стиральная машина', code: 'F08', description: 'Перегрев воды (NTC)', cause: 'Короткое замыкание датчика температуры', urgency: 'high',
    repairPrice: '700–2 000 ₽' },
  { id: 'indesit-f12', brand: 'Indesit', appliance: 'Стиральная машина', code: 'F12', description: 'Нет связи с модулем дисплея', cause: 'Неисправна шина связи, неисправна плата управления', urgency: 'medium',
    repairPrice: '1 500–5 000 ₽' },

  { id: 'lg-le', brand: 'LG', appliance: 'Стиральная машина', code: 'LE', description: 'Ошибка мотора (перегрузка)', cause: 'Перегруз барабана, повреждён ротор инвертора, повреждён статор инвертора', urgency: 'high',
    diySteps: ['Уменьшите загрузку белья (макс. 80% барабана).', 'Перезапустите машину без белья.', 'Если ошибка сохраняется — нужна диагностика мотора.'],
    repairPrice: '2 000–6 000 ₽' },
  { id: 'lg-oe', brand: 'LG', appliance: 'Стиральная машина', code: 'OE', description: 'Ошибка слива', cause: 'Засор помпы, засор патрубка', urgency: 'medium',
    diySteps: ['Откройте фильтр помпы (снизу справа) и удалите мусор.', 'Проверьте сливной шланг.', 'Запустите программу отдельного слива.'],
    repairPrice: '800–2 000 ₽' },
  { id: 'lg-ue', brand: 'LG', appliance: 'Стиральная машина', code: 'UE', description: 'Дисбаланс барабана', cause: 'Неравномерная загрузка белья', urgency: 'low',
    diySteps: ['Остановите машину и перераспределите бельё вручную.', 'Убедитесь, что машина стоит горизонтально (отрегулируйте ножки).', 'Не стирайте одиночные тяжёлые предметы (одеяла, джинсы).'],
    whenCallMaster: 'Если ошибка появляется при нормальной загрузке — возможно, изношены амортизаторы или пружины.',
    repairPrice: 'от 500 ₽' },
  { id: 'lg-de', brand: 'LG', appliance: 'Стиральная машина', code: 'DE / DE1', description: 'Дверь не закрыта', cause: 'Неисправен замок ULD, сломан зацеп люка', urgency: 'medium',
    diySteps: ['Плотно захлопните дверцу — должен щёлкнуть замок.', 'Осмотрите зацеп люка на поломки.', 'Попробуйте аккуратно нажать на дверцу при запуске.'],
    repairPrice: '700–1 800 ₽' },
  { id: 'lg-fe', brand: 'LG', appliance: 'Стиральная машина', code: 'FE', description: 'Переполнение водой', cause: 'Неисправен заливной клапан (не закрывается)', urgency: 'high',
    diySteps: ['Выключите машину и перекройте кран подачи воды.', 'Проверьте, не течёт ли вода в барабан при выключенной машине.'],
    repairPrice: '1 200–2 800 ₽' },
  { id: 'lg-te', brand: 'LG', appliance: 'Стиральная машина', code: 'tE', description: 'Ошибка датчика температуры', cause: 'Неисправен NTC-датчик', urgency: 'medium',
    repairPrice: '700–2 000 ₽' },

  { id: 'samsung-4e', brand: 'Samsung', appliance: 'Стиральная машина', code: '4E / 4C', description: 'Нет набора воды', cause: 'Перекрыт кран, засор фильтра клапана', urgency: 'medium',
    diySteps: ['Откройте кран подачи воды полностью.', 'Отсоедините заливной шланг и очистите сетчатый фильтр.', 'Проверьте давление воды в системе.'],
    repairPrice: '700–1 800 ₽' },
  { id: 'samsung-5e', brand: 'Samsung', appliance: 'Стиральная машина', code: '5E / 5C', description: 'Ошибка слива', cause: 'Засор помпы, засор патрубка слива', urgency: 'medium',
    diySteps: ['Почистите фильтр насоса — он находится за лючком внизу.', 'Проверьте изгиб и длину сливного шланга.', 'Запустите программу принудительного слива.'],
    repairPrice: '800–2 000 ₽' },
  { id: 'samsung-3e', brand: 'Samsung', appliance: 'Стиральная машина', code: '3E / 3C', description: 'Ошибка мотора', cause: 'Обрыв обмотки мотора, КЗ в BLDC-инверторе', urgency: 'high',
    repairPrice: '2 000–6 000 ₽' },
  { id: 'samsung-he', brand: 'Samsung', appliance: 'Стиральная машина', code: 'HE / HC', description: 'Перегрев воды', cause: 'Неисправен ТЭН, неисправен датчик температуры', urgency: 'high',
    repairPrice: '1 200–3 500 ₽' },
  { id: 'samsung-de', brand: 'Samsung', appliance: 'Стиральная машина', code: 'DE / DC', description: 'Дверь не закрыта', cause: 'Неисправен замок люка', urgency: 'medium',
    diySteps: ['Плотно закройте дверцу.', 'Осмотрите пластиковый зацеп на дверце.', 'Попробуйте придержать дверцу при пуске.'],
    repairPrice: '700–1 800 ₽' },

  { id: 'samsung-fr-1e', brand: 'Samsung', appliance: 'Холодильник', code: '1E / 1C', description: 'Ошибка датчика температуры холодильника', cause: 'Обрыв NTC-датчика морозилки', urgency: 'high',
    diySteps: ['Отключите холодильник на 15 минут — возможен сброс ошибки.', 'Проверьте, не обмёрз ли испаритель (ручная разморозка 24 ч).'],
    repairPrice: '1 000–2 500 ₽' },
  { id: 'samsung-fr-2e', brand: 'Samsung', appliance: 'Холодильник', code: '2E / 2C', description: 'Ошибка датчика морозилки', cause: 'КЗ датчика морозилки, обрыв датчика морозилки', urgency: 'high',
    repairPrice: '1 000–2 500 ₽' },
  { id: 'samsung-fr-88', brand: 'Samsung', appliance: 'Холодильник', code: '88 88', description: 'Демонстрационный режим активирован', cause: 'Режим ShowRoom включён случайно', urgency: 'low',
    diySteps: ['Одновременно зажмите Power Freeze + Fridge на 3–5 секунд.', 'На дисплее исчезнет надпись «OF» или «O FF».', 'Если не помогло — попробуйте отключить питание на 5 минут.'],
    whenCallMaster: 'Если режим не отключается кнопками — неисправна плата управления.',
    repairPrice: 'от 500 ₽' },

  { id: 'lg-fr-erff', brand: 'LG', appliance: 'Холодильник', code: 'Er FF', description: 'Вентилятор морозильной камеры не работает', cause: 'Мотор вентилятора заморозился, мотор вентилятора вышел из строя', urgency: 'high',
    diySteps: ['Отключите холодильник на 24 часа для полной разморозки.', 'После включения проверьте, гудит ли вентилятор.'],
    repairPrice: '1 500–3 500 ₽' },
  { id: 'lg-fr-erdh', brand: 'LG', appliance: 'Холодильник', code: 'Er dH', description: 'Ошибка системы размораживания', cause: 'Неисправен нагреватель разморозки, неисправен датчик размораживания', urgency: 'high',
    diySteps: ['Выполните ручную разморозку (выключите на 24 ч).', 'После включения проверьте, не накапливается ли лёд снова.'],
    repairPrice: '1 500–4 000 ₽' },
  { id: 'lg-fr-erco', brand: 'LG', appliance: 'Холодильник', code: 'Er CO', description: 'Нет связи между платами управления', cause: 'Повреждён шлейф данных, неисправна плата управления', urgency: 'high',
    diySteps: ['Отключите холодильник от сети на 10 минут.', 'Проверьте, не пережат ли шлейф в дверном проёме.'],
    repairPrice: '2 500–7 000 ₽' },
];

export const ERROR_CODES: ErrorCode[] = RAW.map(enrich);

export const ERROR_BRANDS = [...new Set(ERROR_CODES.map(e => e.brand))];
export const ERROR_APPLIANCES = [...new Set(ERROR_CODES.map(e => e.appliance))];
