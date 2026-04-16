import { Injectable, signal } from '@angular/core';

export type AppLanguage = 'ru' | 'kz' | 'en';

type Dictionary = Record<string, string>;

const translations: Record<AppLanguage, Dictionary> = {
  ru: {
    'site.tagline': 'Бронирование туров по Казахстану',
    'nav.home': 'Главная',
    'nav.popular': 'Популярное',
    'nav.contacts': 'Контакты',
    'footer.contacts': 'Контакты',
    'footer.phone': 'Телефон',
    'footer.email': 'Email',
    'footer.address': 'Адрес',
    'footer.addressValue': 'Алматы, пр. Абая, 120',
    'footer.language': 'Язык',
    'footer.selectLanguage': 'Выберите язык',
    'tourList.title': 'Туры по Казахстану',
    'tourList.subtitle': 'Выберите направление, даты и оставьте заявку на бронирование.',
    'tourList.priceFrom': 'от',
    'tourList.detailsButton': 'Подробнее и бронирование',
    'tourDetail.duration': 'Длительность',
    'tourDetail.departure': 'Город выезда',
    'tourDetail.price': 'Стоимость',
    'tourDetail.includes': 'Что включено',
    'tourDetail.notFound': 'Тур не найден. Вернитесь к списку и выберите другой маршрут.',
    'tourDetail.bookingTitle': 'Оформление заявки',
    'tourDetail.back': 'Назад к списку туров',
    'booking.title': 'Забронировать тур',
    'booking.name': 'Имя',
    'booking.phone': 'Телефон',
    'booking.people': 'Количество человек',
    'booking.date': 'Желаемая дата поездки',
    'booking.comment': 'Комментарий',
    'booking.commentPlaceholder': 'Например: нужны детские места в транспорте',
    'booking.submit': 'Забронировать',
    'booking.alert': 'Заявка отправлена!',
    'popular.title': 'Популярные направления',
    'popular.subtitle': 'Маршруты, которые чаще всего выбирают путешественники.',
    'contacts.title': 'Свяжитесь с нами',
    'contacts.subtitle': 'Мы поможем подобрать тур, даты и формат поездки.'
  },
  kz: {
    'site.tagline': 'Қазақстан бойынша турларды брондау',
    'nav.home': 'Басты бет',
    'nav.popular': 'Танымал',
    'nav.contacts': 'Байланыс',
    'footer.contacts': 'Байланыс',
    'footer.phone': 'Телефон',
    'footer.email': 'Email',
    'footer.address': 'Мекенжай',
    'footer.addressValue': 'Алматы, Абай даңғ., 120',
    'footer.language': 'Тіл',
    'footer.selectLanguage': 'Тілді таңдаңыз',
    'tourList.title': 'Қазақстан турлары',
    'tourList.subtitle': 'Бағытты, күндерді таңдап, брондау өтінімін қалдырыңыз.',
    'tourList.priceFrom': 'бастап',
    'tourList.detailsButton': 'Толығырақ және брондау',
    'tourDetail.duration': 'Ұзақтығы',
    'tourDetail.departure': 'Шығу қаласы',
    'tourDetail.price': 'Бағасы',
    'tourDetail.includes': 'Қамтылғандар',
    'tourDetail.notFound': 'Тур табылмады. Тізімге оралып, басқа бағытты таңдаңыз.',
    'tourDetail.bookingTitle': 'Өтінім беру',
    'tourDetail.back': 'Турлар тізіміне оралу',
    'booking.title': 'Турды брондау',
    'booking.name': 'Аты',
    'booking.phone': 'Телефон',
    'booking.people': 'Адам саны',
    'booking.date': 'Қалаған сапар күні',
    'booking.comment': 'Түсініктеме',
    'booking.commentPlaceholder': 'Мысалы: көлікте балалар орындары қажет',
    'booking.submit': 'Брондау',
    'booking.alert': 'Өтінім жіберілді!',
    'popular.title': 'Танымал бағыттар',
    'popular.subtitle': 'Саяхатшылар жиі таңдайтын маршруттар.',
    'contacts.title': 'Бізбен байланысыңыз',
    'contacts.subtitle': 'Тур, күндер және сапар форматын таңдауға көмектесеміз.'
  },
  en: {
    'site.tagline': 'Tour booking across Kazakhstan',
    'nav.home': 'Home',
    'nav.popular': 'Popular',
    'nav.contacts': 'Contacts',
    'footer.contacts': 'Contacts',
    'footer.phone': 'Phone',
    'footer.email': 'Email',
    'footer.address': 'Address',
    'footer.addressValue': 'Almaty, Abay Ave. 120',
    'footer.language': 'Language',
    'footer.selectLanguage': 'Choose language',
    'tourList.title': 'Tours in Kazakhstan',
    'tourList.subtitle': 'Choose destination, dates, and submit your booking request.',
    'tourList.priceFrom': 'from',
    'tourList.detailsButton': 'Details and booking',
    'tourDetail.duration': 'Duration',
    'tourDetail.departure': 'Departure city',
    'tourDetail.price': 'Price',
    'tourDetail.includes': 'Included',
    'tourDetail.notFound': 'Tour not found. Go back and choose another route.',
    'tourDetail.bookingTitle': 'Booking request',
    'tourDetail.back': 'Back to tours list',
    'booking.title': 'Book this tour',
    'booking.name': 'Name',
    'booking.phone': 'Phone',
    'booking.people': 'Number of people',
    'booking.date': 'Preferred travel date',
    'booking.comment': 'Comment',
    'booking.commentPlaceholder': 'For example: child seats needed in transport',
    'booking.submit': 'Book now',
    'booking.alert': 'Request sent!',
    'popular.title': 'Popular destinations',
    'popular.subtitle': 'Routes most frequently chosen by travelers.',
    'contacts.title': 'Contact us',
    'contacts.subtitle': 'We will help you choose a tour, dates, and trip format.'
  }
};

@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly currentLanguage = signal<AppLanguage>('ru');

  readonly lang = this.currentLanguage.asReadonly();

  setLanguage(language: AppLanguage): void {
    this.currentLanguage.set(language);
  }

  t(key: string): string {
    const active = translations[this.currentLanguage()];
    return active[key] ?? translations.ru[key] ?? key;
  }
}
