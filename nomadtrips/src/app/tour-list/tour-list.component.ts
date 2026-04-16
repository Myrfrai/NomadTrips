import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppLanguage, I18nService } from '../i18n.service';

type LocalizedText = Record<AppLanguage, string>;

type TourCard = {
  id: number;
  name: LocalizedText;
  price: number;
  duration: LocalizedText;
  season: LocalizedText;
  location: LocalizedText;
  description: LocalizedText;
};

@Component({
  selector: 'app-tour-list',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './tour-list.component.html',
  styleUrls: ['./tour-list.component.css']
})
export class TourListComponent {
  readonly i18n = inject(I18nService);

  tours: TourCard[] = [
    {
      id: 1,
      name: { ru: 'Алматы - Чарын', kz: 'Алматы - Шарын', en: 'Almaty - Charyn' },
      price: 20000,
      duration: { ru: '2 дня / 1 ночь', kz: '2 күн / 1 түн', en: '2 days / 1 night' },
      season: { ru: 'Весна - Осень', kz: 'Көктем - Күз', en: 'Spring - Autumn' },
      location: { ru: 'Алматинская область', kz: 'Алматы облысы', en: 'Almaty region' },
      description: {
        ru: 'Каньон, прогулки по долине замков и ночевка в гостевом доме.',
        kz: 'Шатқал, қамалдар аңғарында серуен және қонақ үйде түнеу.',
        en: 'Canyon route, valley walks, and an overnight stay in a guest house.'
      }
    },
    {
      id: 2,
      name: { ru: 'Астана - Бурабай', kz: 'Астана - Бурабай', en: 'Astana - Burabay' },
      price: 15000,
      duration: { ru: '1 день', kz: '1 күн', en: '1 day' },
      season: { ru: 'Круглый год', kz: 'Жыл бойы', en: 'All year round' },
      location: { ru: 'Акмолинская область', kz: 'Ақмола облысы', en: 'Akmola region' },
      description: {
        ru: 'Озера, хвойный лес, обзорные площадки и экотропы.',
        kz: 'Көлдер, қылқан жапырақты орман, шолу алаңдары және экосоқпақтар.',
        en: 'Lakes, pine forests, viewpoints, and eco trails.'
      }
    },
    {
      id: 3,
      name: { ru: 'Шымкент - Туркестан', kz: 'Шымкент - Түркістан', en: 'Shymkent - Turkestan' },
      price: 25000,
      duration: { ru: '2 дня / 1 ночь', kz: '2 күн / 1 түн', en: '2 days / 1 night' },
      season: { ru: 'Осень / Весна', kz: 'Күз / Көктем', en: 'Autumn / Spring' },
      location: { ru: 'Туркестанская область', kz: 'Түркістан облысы', en: 'Turkestan region' },
      description: {
        ru: 'Исторические памятники, мавзолей Ходжи Ахмеда Яссауи и локальная кухня.',
        kz: 'Тарихи ескерткіштер, Қожа Ахмет Ясауи кесенесі және жергілікті асхана.',
        en: 'Historical landmarks, Khoja Ahmed Yasawi mausoleum, and local cuisine.'
      }
    }
  ];
}
