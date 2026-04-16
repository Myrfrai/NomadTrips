import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookingFormComponent } from '../booking-form/booking-form.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppLanguage, I18nService } from '../i18n.service';

type LocalizedText = Record<AppLanguage, string>;

type TourDetailData = {
  name: LocalizedText;
  duration: LocalizedText;
  price: number;
  departure: LocalizedText;
  includes: Record<AppLanguage, string[]>;
};

@Component({
  selector: 'app-tour-detail',
  standalone: true,
  imports: [BookingFormComponent, RouterModule, CommonModule],
  templateUrl: './tour-detail.component.html',
  styleUrls: ['./tour-detail.component.css']
})
export class TourDetailComponent {
  readonly i18n = inject(I18nService);

  tourId: number;
  private readonly toursData: Record<number, TourDetailData> = {
    1: {
      name: { ru: 'Алматы - Чарын', kz: 'Алматы - Шарын', en: 'Almaty - Charyn' },
      duration: { ru: '2 дня / 1 ночь', kz: '2 күн / 1 түн', en: '2 days / 1 night' },
      price: 20000,
      departure: { ru: 'Алматы', kz: 'Алматы', en: 'Almaty' },
      includes: {
        ru: ['Трансфер', 'Проживание', 'Услуги гида', 'Завтрак'],
        kz: ['Трансфер', 'Тұру', 'Гид қызметі', 'Таңғы ас'],
        en: ['Transfer', 'Accommodation', 'Guide service', 'Breakfast']
      }
    },
    2: {
      name: { ru: 'Астана - Бурабай', kz: 'Астана - Бурабай', en: 'Astana - Burabay' },
      duration: { ru: '1 день', kz: '1 күн', en: '1 day' },
      price: 15000,
      departure: { ru: 'Астана', kz: 'Астана', en: 'Astana' },
      includes: {
        ru: ['Трансфер', 'Сопровождение', 'Пикник-набор'],
        kz: ['Трансфер', 'Сүйемелдеу', 'Пикник жиынтығы'],
        en: ['Transfer', 'Escort', 'Picnic set']
      }
    },
    3: {
      name: { ru: 'Шымкент - Туркестан', kz: 'Шымкент - Түркістан', en: 'Shymkent - Turkestan' },
      duration: { ru: '2 дня / 1 ночь', kz: '2 күн / 1 түн', en: '2 days / 1 night' },
      price: 25000,
      departure: { ru: 'Шымкент', kz: 'Шымкент', en: 'Shymkent' },
      includes: {
        ru: ['Трансфер', 'Отель', 'Экскурсия', 'Входные билеты'],
        kz: ['Трансфер', 'Қонақ үй', 'Экскурсия', 'Кіру билеттері'],
        en: ['Transfer', 'Hotel', 'Excursion', 'Entrance tickets']
      }
    }
  };

  constructor(private route: ActivatedRoute) {
    this.tourId = +this.route.snapshot.paramMap.get('id')!;
  }

  get selectedTour(): TourDetailData | undefined {
    return this.toursData[this.tourId];
  }
}
