import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nService } from '../i18n.service';

@Component({
  selector: 'app-popular',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './popular.component.html',
  styleUrls: ['./popular.component.css']
})
export class PopularComponent {
  readonly i18n = inject(I18nService);

  readonly cards = [
    {
      title: { ru: 'Кольсай и Каинды', kz: 'Көлсай және Қайыңды', en: 'Kolsai and Kaindy' },
      text: {
        ru: 'Горные озера, пешие маршруты и фототочки.',
        kz: 'Тау көлдері, жаяу маршруттар және фото нүктелер.',
        en: 'Mountain lakes, hiking routes, and photo points.'
      }
    },
    {
      title: { ru: 'Мангистауские каньоны', kz: 'Маңғыстау шатқалдары', en: 'Mangystau canyons' },
      text: {
        ru: 'Марсианские ландшафты и экспедиционный формат.',
        kz: 'Марсқа ұқсас ландшафттар және экспедициялық формат.',
        en: 'Mars-like landscapes and expedition format.'
      }
    },
    {
      title: { ru: 'Баянаул', kz: 'Баянауыл', en: 'Bayanaul' },
      text: {
        ru: 'Скалы, озера и активный отдых на выходные.',
        kz: 'Жартастар, көлдер және демалыс күнгі белсенді сапар.',
        en: 'Rocks, lakes, and an active weekend getaway.'
      }
    }
  ];
}
