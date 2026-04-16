import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { I18nService } from '../i18n.service';

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.css']
})
export class BookingFormComponent {
  readonly i18n = inject(I18nService);

  name = '';
  phone = '';
  people = 1;
  travelDate = '';
  comment = '';

  onSubmit() {
    alert(
      `${this.i18n.t('booking.alert')} ${this.i18n.t('booking.name')}: ${this.name}, ${this.i18n.t('booking.phone')}: ${this.phone}, ${this.i18n.t('booking.people')}: ${this.people}, ${this.i18n.t('booking.date')}: ${this.travelDate}`
    );
  }
}
