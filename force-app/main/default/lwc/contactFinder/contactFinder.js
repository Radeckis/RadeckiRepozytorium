import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import findContactsByEmail from '@salesforce/apex/ContactFinderController.findContactsByEmail';
import createContact from '@salesforce/apex/ContactFinderController.createContact';
import searchContactsByPartialEmail from '@salesforce/apex/ContactFinderController.searchContactsByPartialEmail';
import docPick from '@salesforce/resourceUrl/ludzik';

export default class ContactFinder extends NavigationMixin(LightningElement) {
    email = '';
    kontakt = null;
    duplikaty = [];
    pokazDuplikaty = false;
    podpowiedzi = [];
    placeholderText = 'Type email here';
    emailImage = docPick;

    

    handleFocus() {
    this.placeholderText = '';
    }

handleBlur() {
    if (!this.email) {
        this.placeholderText = 'Type your email here';
        }
    }

    async handleChange(event) {
        this.email = event.target.value;

        if (this.email.length >= 2) {
            this.podpowiedzi = await searchContactsByPartialEmail({ czesciowyEmail: this.email });
        } else {
            this.podpowiedzi = [];
        }
    }

    async wybierzPodpowiedz(event) {
        const wybraneId = event.currentTarget.dataset.id;
        const wybranyKontakt = this.podpowiedzi.find(k => k.Id === wybraneId);

        this.email = wybranyKontakt.Email;
        this.podpowiedzi = [];

        await this.handleClick();
    }

    async handleClick() {
        this.kontakt = null;
        this.duplikaty = [];
        this.pokazDuplikaty = false;

        const results = await findContactsByEmail({ email: this.email });

        if (results.length === 0) {
            const potwierdzenie = confirm(`Nie znaleziono kontaktu dla "${this.email}". Czy na pewno chcesz utworzyć nowy kontakt?`);

            if (!potwierdzenie) {
                return;
            }

            const nowyKontakt = await createContact({ email: this.email, lastName: '' });
            this.kontakt = nowyKontakt;
        } else {
            this.kontakt = results[0];
            this.duplikaty = results;
        }
    }

    get nazwaFirmy() {
        return this.kontakt && this.kontakt.Account ? this.kontakt.Account.Name : 'Brak firmy';
    }

    get maDuplikaty() {
        return this.duplikaty.length > 1;
    }

    get etykietaWiecej() {
        return this.pokazDuplikaty ? 'Ukryj' : `Więcej (${this.duplikaty.length - 1})`;
    }

    toggleDuplikaty() {
        this.pokazDuplikaty = !this.pokazDuplikaty;
    }

    wybierzDuplikat(event) {
        const wybraneId = event.currentTarget.dataset.id;
        this.kontakt = this.duplikaty.find(k => k.Id === wybraneId);
        this.pokazDuplikaty = false;
    }

    handleOpenContact() {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.kontakt.Id,
                objectApiName: 'Contact',
                actionName: 'view'
            }
        });
    }
}    