// Статические данные мастеров — полностью автономно, без Supabase

export type SubscriptionStatus = 'free' | 'active' | 'expired';

export interface MasterPublicProfile {
  id: string;
  slug: string;
  display_name: string;
  avatar_url: string | null;
  bio: string | null;
  experience_years: number;
  city_slug: string;
  city_name: string;
  city_name_prep: string;
  service_types: string[];
  fixed_prices: Record<string, number>;
  phone: string | null;
  telegram: string | null;
  is_online: boolean;
  is_verified: boolean;
  is_active: boolean;
  rating: number;
  reviews_count: number;
  orders_count: number;
}

export interface MasterReview {
  id: string;
  master_id: string;
  author_name: string;
  author_city: string | null;
  rating: number;
  appliance: string | null;
  text: string;
  reply: string | null;
  created_at: string;
}

export const SERVICE_LABELS: Record<string, string> = {
  'remont-holodilnikov':      'Холодильники',
  'remont-stiralnykh-mashin': 'Стиральные машины',
  'remont-elektropliit':      'Электроплиты',
  'remont-mikrovolnovok':     'Микроволновки',
  'remont-pylesesov':         'Пылесосы',
  'remont-kofemashiny':       'Кофемашины',
};

export const MASTERS: MasterPublicProfile[] = [
  {
    id: '1',
    slug: 'dmitriy-ivanov',
    display_name: 'Дмитрий Правда',
    avatar_url: '/master-dmitriy.png',
    bio: 'Опытный мастер по ремонту холодильников и стиральных машин. Работаю в Миассе с 2012 года. Выезд в день звонка, гарантия на все работы.',
    experience_years: 12,
    city_slug: 'miass',
    city_name: 'Миасс',
    city_name_prep: 'Миассе',
    service_types: ['remont-holodilnikov', 'remont-stiralnykh-mashin', 'remont-elektropliit'],
    fixed_prices: {
      'remont-holodilnikov': 2000,
      'remont-stiralnykh-mashin': 2500,
    },
    phone: '+79512577757',
    telegram: 'Drugan1900',
    is_online: true,
    is_verified: true,
    is_active: true,
    rating: 4.9,
    reviews_count: 47,
    orders_count: 312,
  },
  {
    id: '2',
    slug: 'aleksey-petrov',
    display_name: 'Алексей Петров',
    avatar_url: null,
    bio: 'Специалист по ремонту электроплит, микроволновок и пылесосов. Работаю в Златоусте и Чебаркуле. Диагностика бесплатно.',
    experience_years: 8,
    city_slug: 'zlatoust',
    city_name: 'Златоуст',
    city_name_prep: 'Златоусте',
    service_types: ['remont-elektropliit', 'remont-mikrovolnovok', 'remont-pylesesov'],
    fixed_prices: {
      'remont-elektropliit': 1800,
      'remont-mikrovolnovok': 1500,
    },
    phone: null,
    telegram: null,
    is_online: true,
    is_verified: true,
    is_active: true,
    rating: 4.8,
    reviews_count: 31,
    orders_count: 198,
  },
  {
    id: '3',
    slug: 'sergey-kozlov',
    display_name: 'Сергей Честный',
    avatar_url: null,
    bio: 'Ремонт кофемашин, пылесосов и мелкой бытовой техники. Принимаю технику в мастерской и с выездом на дом по Чебаркулю.',
    experience_years: 6,
    city_slug: 'chebarkul',
    city_name: 'Чебаркуль',
    city_name_prep: 'Чебаркуле',
    service_types: ['remont-kofemashiny', 'remont-pylesesov', 'remont-mikrovolnovok'],
    fixed_prices: {
      'remont-kofemashiny': 2200,
    },
    phone: null,
    telegram: null,
    is_online: false,
    is_verified: false,
    is_active: true,
    rating: 4.7,
    reviews_count: 19,
    orders_count: 124,
  },
];

export const MASTER_REVIEWS: MasterReview[] = [
  {
    id: 'r1',
    master_id: '1',
    author_name: 'Наталья К.',
    author_city: 'Миасс',
    rating: 5,
    appliance: 'Холодильник Samsung',
    text: 'Дмитрий приехал через час после звонка. Нашёл причину — утечка фреона. Заправил, проверил — всё работает. Цена разумная, давал советы по уходу. Буду обращаться ещё.',
    reply: null,
    created_at: '2024-11-15',
  },
  {
    id: 'r2',
    master_id: '1',
    author_name: 'Игорь В.',
    author_city: 'Миасс',
    rating: 5,
    appliance: 'Стиральная машина Bosch',
    text: 'Отлично. Заменил подшипники барабана за один визит. Работает тихо, как новая. Гарантию дал на 12 месяцев.',
    reply: null,
    created_at: '2024-10-22',
  },
  {
    id: 'r3',
    master_id: '1',
    author_name: 'Елена М.',
    author_city: 'Миасс',
    rating: 4,
    appliance: 'Холодильник LG',
    text: 'Мастер пришёл вовремя, вежливый. Заменили термостат быстро. Немного дороже чем ожидала, но качество работы хорошее.',
    reply: 'Спасибо за отзыв! Если есть вопросы — обращайтесь.',
    created_at: '2024-09-10',
  },
  {
    id: 'r4',
    master_id: '2',
    author_name: 'Владимир Р.',
    author_city: 'Златоуст',
    rating: 5,
    appliance: 'Электроплита Hansa',
    text: 'Алексей быстро определил причину — сгорел нагревательный элемент. Заменил в тот же день. Рекомендую!',
    reply: null,
    created_at: '2024-11-01',
  },
  {
    id: 'r5',
    master_id: '2',
    author_name: 'Ольга Т.',
    author_city: 'Чебаркуль',
    rating: 5,
    appliance: 'Микроволновка LG',
    text: 'Приехал в Чебаркуль, всё сделал аккуратно и чисто. Поменял магнетрон. Теперь работает отлично!',
    reply: null,
    created_at: '2024-10-05',
  },
  {
    id: 'r6',
    master_id: '3',
    author_name: 'Марина С.',
    author_city: 'Чебаркуль',
    rating: 5,
    appliance: 'Кофемашина DeLonghi',
    text: 'Почистил кофемашину, заменил помпу. Теперь кофе как в кофейне! Приятный и профессиональный мастер.',
    reply: null,
    created_at: '2024-11-20',
  },
];

export function getMasterBySlug(slug: string): MasterPublicProfile | null {
  return MASTERS.find(m => m.slug === slug && m.is_active) ?? null;
}

export function getReviewsForMaster(masterId: string): MasterReview[] {
  return MASTER_REVIEWS.filter(r => r.master_id === masterId);
}
