import { Component, inject } from '@angular/core';
import { I18nService } from '../i18n.service';

@Component({
  selector: 'app-contacts',
  standalone: true,
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent {
  readonly i18n = inject(I18nService);
}
