import { LocalizedText, PhotoAttribution, Tour, UserProfile } from './api.models';

export interface DemoUser extends UserProfile {
  password: string;
}

function localized(ru: string, kz: string, en: string): LocalizedText {
  return { ru, kz, en };
}

function photo(
  author: string,
  sourceUrl: string,
  licenseLabel: string,
  licenseUrl: string
): PhotoAttribution {
  return {
    author,
    sourceLabel: 'Wikimedia Commons',
    sourceUrl,
    licenseLabel,
    licenseUrl
  };
}

export const DEMO_USERS: DemoUser[] = [
  {
    id: 1,
    name: 'Aruzhan Sarsembayeva',
    email: 'traveler@nomadtrips.kz',
    password: 'demo12345',
    role: 'traveler'
  },
  {
    id: 2,
    name: 'Dias Tulegen',
    email: 'manager@nomadtrips.kz',
    password: 'demo12345',
    role: 'manager'
  }
];

export const DEMO_TOURS: Tour[] = [
  {
    id: 1,
    slug: 'almaty-charyn',
    name: localized('Алматы - Чарын', 'Алматы - Шарын', 'Almaty - Charyn'),
    summary: localized(
      'Чарынский каньон, прогулки по Долине замков и вечер с панорамой красных скал.',
      'Шарын шатқалы, Қамалдар аңғарымен серуен және қызыл жартастарға қараған кеш.',
      'Charyn Canyon trails, Valley of Castles walks, and an evening with red cliff panoramas.'
    ),
    region: localized('Алматинская область', 'Алматы облысы', 'Almaty region'),
    regionKey: 'almaty',
    season: localized('Весна - Осень', 'Көктем - Күз', 'Spring - Autumn'),
    seasonKey: 'mid',
    duration: localized('2 дня / 1 ночь', '2 күн / 1 түн', '2 days / 1 night'),
    departure: localized('Алматы', 'Алматы', 'Almaty'),
    price: 42000,
    rating: 4.9,
    popular: true,
    heroLabel: 'Canyon Escape',
    imageUrl: '/images/tours/charyn-canyon.jpg',
    imageAlt: localized(
      'Чарынский каньон на закате',
      'Күн батардағы Шарын шатқалы',
      'Charyn Canyon at sunset'
    ),
    photoAttribution: photo(
      'kalpaktravel',
      'https://commons.wikimedia.org/wiki/File:Kazakhstan,_Charyn_Canyon.jpg',
      'CC BY 2.0',
      'https://creativecommons.org/licenses/by/2.0/'
    ),
    highlights: [
      localized('Закат на смотровой точке', 'Шолу нүктесіндегі күн батуы', 'Sunset viewpoint stop'),
      localized('Трекинг по каньону', 'Шатқал ішіндегі трекинг', 'Canyon trekking'),
      localized('Ночёвка в глэмпинге', 'Глэмпингтегі түн', 'Glamping overnight stay')
    ],
    includes: [
      localized('Трансфер из Алматы', 'Алматыдан трансфер', 'Transfer from Almaty'),
      localized('Услуги гида', 'Гид қызметі', 'Guide service'),
      localized('Завтрак и ужин', 'Таңғы және кешкі ас', 'Breakfast and dinner')
    ]
  },
  {
    id: 2,
    slug: 'burabay-lakes',
    name: localized('Астана - Бурабай', 'Астана - Бурабай', 'Astana - Burabay'),
    summary: localized(
      'Хвойный лес, прозрачное озеро и лёгкий однодневный маршрут для отдыха на выходных.',
      'Қарағайлы орман, мөлдір көл және демалыс күндеріне арналған жеңіл маршрут.',
      'Pine forests, clear water, and an easy one-day escape for a relaxed weekend.'
    ),
    region: localized('Акмолинская область', 'Ақмола облысы', 'Akmola region'),
    regionKey: 'akmola',
    season: localized('Круглый год', 'Жыл бойы', 'All year'),
    seasonKey: 'all',
    duration: localized('1 день', '1 күн', '1 day'),
    departure: localized('Астана', 'Астана', 'Astana'),
    price: 28000,
    rating: 4.7,
    popular: true,
    heroLabel: 'Lake Weekend',
    imageUrl: '/images/tours/burabay-lake.jpg',
    imageAlt: localized('Озеро Бурабай', 'Бурабай көлі', 'Burabay Lake'),
    photoAttribution: photo(
      'alexandrorodrigez',
      'https://commons.wikimedia.org/wiki/File:Burabay_020000,_Kazakhstan_-_panoramio_(1).jpg',
      'CC BY-SA 3.0',
      'https://creativecommons.org/licenses/by-sa/3.0/'
    ),
    highlights: [
      localized('Подъём на обзорную точку', 'Шолу алаңына көтерілу', 'Viewpoint hike'),
      localized('Пикник у озера', 'Көл жағасындағы пикник', 'Lake picnic'),
      localized('Фотоостановки в сосновом бору', 'Қарағай ішінде фото-тоқтау', 'Photo stops in the pine forest')
    ],
    includes: [
      localized('Трансфер туда-обратно', 'Екі жаққа трансфер', 'Round-trip transfer'),
      localized('Сопровождение координатора', 'Координатор сүйемелдеуі', 'Trip coordinator'),
      localized('Пикник-набор', 'Пикник жиынтығы', 'Picnic set')
    ]
  },
  {
    id: 3,
    slug: 'turkestan-heritage',
    name: localized('Шымкент - Туркестан', 'Шымкент - Түркістан', 'Shymkent - Turkestan'),
    summary: localized(
      'Исторический маршрут с мавзолеем Яссауи, ремесленными лавками и атмосферой старого города.',
      'Ясауи кесенесі, қолөнер дүкендері және ескі қаланың рухы бар тарихи сапар.',
      'A heritage route with the Yasawi mausoleum, artisan shops, and the atmosphere of the old city.'
    ),
    region: localized('Туркестанская область', 'Түркістан облысы', 'Turkestan region'),
    regionKey: 'turkestan',
    season: localized('Осень / Весна', 'Күз / Көктем', 'Autumn / Spring'),
    seasonKey: 'mid',
    duration: localized('2 дня / 1 ночь', '2 күн / 1 түн', '2 days / 1 night'),
    departure: localized('Шымкент', 'Шымкент', 'Shymkent'),
    price: 51000,
    rating: 4.8,
    popular: false,
    heroLabel: 'Heritage Route',
    imageUrl: '/images/tours/turkestan-yasawi.jpg',
    imageAlt: localized(
      'Мавзолей Ходжи Ахмеда Яссауи',
      'Қожа Ахмет Ясауи кесенесі',
      'Khoja Ahmed Yasawi mausoleum'
    ),
    photoAttribution: photo(
      'Petar Milošević',
      'https://commons.wikimedia.org/wiki/File:Mausoleum_of_Khoja_Ahmed_Yasawi_in_Hazrat-e_Turkestan,_Kazakhstan.jpg',
      'CC BY-SA 4.0',
      'https://creativecommons.org/licenses/by-sa/4.0/'
    ),
    highlights: [
      localized('Экскурсия по мавзолею Яссауи', 'Ясауи кесенесіне экскурсия', 'Yasawi mausoleum tour'),
      localized('Ужин в этно-ресторане', 'Этно-ресторандағы кешкі ас', 'Dinner in an ethno restaurant'),
      localized('Прогулка по старому Туркестану', 'Ескі Түркістанда серуен', 'Old Turkestan walk')
    ],
    includes: [
      localized('Трансфер по маршруту', 'Маршрут бойымен трансфер', 'Route transfer'),
      localized('Проживание в бутик-отеле', 'Бутик-қонақүйде тұру', 'Boutique hotel stay'),
      localized('Входные билеты', 'Кіру билеттері', 'Entrance tickets')
    ]
  },
  {
    id: 4,
    slug: 'mangystau-expedition',
    name: localized('Мангистауская экспедиция', 'Маңғыстау экспедициясы', 'Mangystau Expedition'),
    summary: localized(
      'Марсианские пейзажи Бозжыры, лагерь под звёздами и длинные джип-переезды по плато.',
      'Бозжыраның ғажайып пейзаждары, жұлдыз астындағы лагерь және ұзақ джип-жолдар.',
      'Bozzhyra cliffs, camping under the stars, and long 4x4 drives across the plateau.'
    ),
    region: localized('Мангистауская область', 'Маңғыстау облысы', 'Mangystau region'),
    regionKey: 'mangystau',
    season: localized('Осень / Весна', 'Күз / Көктем', 'Autumn / Spring'),
    seasonKey: 'mid',
    duration: localized('3 дня / 2 ночи', '3 күн / 2 түн', '3 days / 2 nights'),
    departure: localized('Актау', 'Ақтау', 'Aktau'),
    price: 88000,
    rating: 5,
    popular: true,
    heroLabel: 'Desert Drive',
    imageUrl: '/images/tours/bozzhyra-valley.jpg',
    imageAlt: localized('Бозжыра в Мангистау', 'Маңғыстаудағы Бозжыра', 'Bozzhyra Valley in Mangystau'),
    photoAttribution: photo(
      'Berik Aday',
      'https://commons.wikimedia.org/wiki/File:Bozzhyra_valley,_Mangistau,_Kazakhstan.jpg',
      'CC BY-SA 4.0',
      'https://creativecommons.org/licenses/by-sa/4.0/'
    ),
    highlights: [
      localized('Панорамы Бозжыры', 'Бозжыра панорамалары', 'Bozzhyra panoramas'),
      localized('Кэмпинг под звёздами', 'Жұлдыз астындағы кемпинг', 'Camping under the stars'),
      localized('Джип-сафари по плато', 'Үстіртпен джип-сафари', 'Jeep safari across the plateau')
    ],
    includes: [
      localized('Полноприводный транспорт', 'Толық жетекті көлік', '4x4 transport'),
      localized('Полевое питание', 'Далалық ас', 'Camp meals'),
      localized('Сопровождение проводника', 'Жолбасшы сүйемелдеуі', 'Expedition guide')
    ]
  },
  {
    id: 5,
    slug: 'kolsai-kaindy',
    name: localized('Кольсай и Каинды', 'Көлсай және Қайыңды', 'Kolsai and Kaindy Lakes'),
    summary: localized(
      'Горные озёра, хвойные склоны и одна из самых фотогеничных природных точек юго-востока Казахстана.',
      'Таулы көлдер, шыршалы беткейлер және оңтүстік-шығыс Қазақстандағы ең әсерлі табиғи бағыттардың бірі.',
      'Mountain lakes, spruce slopes, and one of the most photogenic nature routes in southeast Kazakhstan.'
    ),
    region: localized('Алматинская область', 'Алматы облысы', 'Almaty region'),
    regionKey: 'almaty',
    season: localized('Лето - Осень', 'Жаз - Күз', 'Summer - Autumn'),
    seasonKey: 'mid',
    duration: localized('2 дня / 1 ночь', '2 күн / 1 түн', '2 days / 1 night'),
    departure: localized('Алматы', 'Алматы', 'Almaty'),
    price: 64000,
    rating: 4.9,
    popular: true,
    heroLabel: 'Alpine Lakes',
    imageUrl: '/images/tours/kolsai-lakes.jpg',
    imageAlt: localized('Кольсайские озёра', 'Көлсай көлдері', 'Kolsai Lakes'),
    photoAttribution: photo(
      'Dimash Kenesbek',
      'https://commons.wikimedia.org/wiki/File:Kolsai_lakes.Mountains.jpg',
      'CC BY-SA 4.0',
      'https://creativecommons.org/licenses/by-sa/4.0/'
    ),
    highlights: [
      localized('Вид на Кольсайские озёра', 'Көлсай көлдеріне көрініс', 'Kolsai lake viewpoints'),
      localized('Прогулка к озеру Каинды', 'Қайыңды көліне серуен', 'Walk toward Kaindy Lake'),
      localized('Утро в горевом гостевом доме', 'Таудағы қонақүйдегі таң', 'Mountain guesthouse morning')
    ],
    includes: [
      localized('Трансфер и дорога по нацпарку', 'Трансфер және ұлттық парк жолы', 'Transfers and park transport'),
      localized('Сопровождение локального гида', 'Жергілікті гид сүйемелдеуі', 'Local guide support'),
      localized('Ужин и завтрак', 'Кешкі және таңғы ас', 'Dinner and breakfast')
    ]
  },
  {
    id: 6,
    slug: 'altyn-emel-aktau',
    name: localized('Алтын-Эмель и горы Актау', 'Алтын-Емел және Ақтау таулары', 'Altyn-Emel and Aktau Mountains'),
    summary: localized(
      'Пёстрые меловые горы, пустынные ландшафты и маршрут для тех, кто хочет увидеть другой Казахстан.',
      'Түрлі түсті борлы таулар, шөл пейзаждары және Қазақстанның басқа қырын көргісі келетіндерге арналған сапар.',
      'Colorful chalk mountains, desert landscapes, and a route for travelers who want to see a very different side of Kazakhstan.'
    ),
    region: localized('Алматинская область', 'Алматы облысы', 'Almaty region'),
    regionKey: 'almaty',
    season: localized('Весна / Осень', 'Көктем / Күз', 'Spring / Autumn'),
    seasonKey: 'mid',
    duration: localized('2 дня / 1 ночь', '2 күн / 1 түн', '2 days / 1 night'),
    departure: localized('Алматы', 'Алматы', 'Almaty'),
    price: 58000,
    rating: 4.8,
    popular: false,
    heroLabel: 'Painted Desert',
    imageUrl: '/images/tours/altyn-emel-aktau.jpg',
    imageAlt: localized('Горы Актау в Алтын-Эмеле', 'Алтын-Емелдегі Ақтау таулары', 'Aktau Mountains in Altyn-Emel'),
    photoAttribution: photo(
      'Astrobond',
      'https://commons.wikimedia.org/wiki/File:Chalk_Mountains._Aktau_Mountains._Altyn-Emel_National_Park._Kazakhstan,_April_2025_06.jpg',
      'CC BY-SA 4.0',
      'https://creativecommons.org/licenses/by-sa/4.0/'
    ),
    highlights: [
      localized('Панорамы гор Актау', 'Ақтау тауларының панорамалары', 'Aktau mountain panoramas'),
      localized('Пустынные тропы и геология парка', 'Шөл соқпақтары және парк геологиясы', 'Desert trails and park geology'),
      localized('Фотостопы на цветных склонах', 'Түсті беткейлердегі фотостоптар', 'Photo stops on colorful slopes')
    ],
    includes: [
      localized('Трансфер из Алматы', 'Алматыдан трансфер', 'Transfer from Almaty'),
      localized('Ночёвка в кемпинге или гостевом доме', 'Кемпингте немесе қонақүйде түн', 'Camping or guesthouse overnight'),
      localized('Питание по программе', 'Бағдарлама бойынша ас', 'Meals included')
    ]
  }
];
