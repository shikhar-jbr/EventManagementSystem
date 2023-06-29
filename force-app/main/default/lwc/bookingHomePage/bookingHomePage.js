import { LightningElement } from 'lwc';
import Venue_Images from '@salesforce/resourceUrl/Venue_Images';
import Another_Image from '@salesforce/resourceUrl/Another_Image';
import BookingModal from 'c/frontPage';

export default class BookingHomePage extends LightningElement {


    torontoImage = Venue_Images;
    anotherImage = Another_Image;
    
    openModal() {
        BookingModal.open();
    }
}