import LightningConfirm from 'lightning/confirm'
import LightningAlert from 'lightning/alert'
import BOOKING from '@salesforce/schema/Booking_List__c'
import Name from '@salesforce/schema/Booking_List__c.Name'
import Contact from '@salesforce/schema/Booking_List__c.Contact_No__c'
import Address from '@salesforce/schema/Booking_List__c.Address__c'
import Email from '@salesforce/schema/Booking_List__c.Email__c'
import Event from '@salesforce/schema/Booking_List__c.Event_Type__c'
import Date from '@salesforce/schema/Booking_List__c.Date_of_Event__c'
import Time from '@salesforce/schema/Booking_List__c.Estimated_Time__c'
import Attendee from '@salesforce/schema/Booking_List__c.Attendee__c'
import getAttendee from '@salesforce/apex/AttendeeField.getAttendee'
import createPriceList from '@salesforce/apex/AttendeeField.createPriceList'
import getCharge from '@salesforce/apex/AttendeeField.getCharge'
import deleteBooking from '@salesforce/apex/AttendeeField.deleteBooking'
import LightningModal from 'lightning/modal';

export default class FrontPage extends LightningModal {

    venueCost
    entertainmentCharge
    serviceCharge
    dinnerCost
    snacksCost
    objectApiName = BOOKING
    nameField = Name
    contactField = Contact
    addressField = Address
    emailField = Email
    eventField = Event
    dateField = Date
    timeField = Time
    attendeeField = Attendee
    playerId
    priceListId
    flowApiName = "Food_Item_Selection"
    totalDinnerCost
    totalSnackCost
    isDisplayed = false
    isSubmitted = false
    isOver = false
    isTrue = false
    name

    openModal(event) {

    }

    handleSuccess(event) {
        event.preventDefault()
        this.isTrue = true
        this.playerId = event.detail.id
        this.name= event.detail.Name
        this.isDisplayed = true
    }

    handleError(event) {
        //errorMessage = event.detail;
        console.log(event.detail.detail);

        LightningAlert.open({
            message: event.detail.detail,
            theme: 'Error',
            label: 'Close'
        })
    }

    get flowInputVariables() {
        return [
            {
                name: 'bookingId',
                type: 'String',
                value: this.playerId
            }
        ]
    }

    handleFlowStatusChange(event) {
        console.log("flow status", event.detail.status)


        if (event.detail.status === "FINISHED") {
            const outputVariables = event.detail.outputVariables
            for (let i = 0; i < outputVariables.length; i++) {
                const outputVar = outputVariables[i]
                if (outputVar.name == 'DinnerCost') {
                    this.dinnerCost = outputVar.value
                }
                if (outputVar.name == 'SnacksCost') {
                    this.snacksCost = outputVar.value
                }
            }
            this.isDisplayed = false
            this.isOver = true
            console.log(this.dinnerCost + this.snacksCost)

            const inputvalue = {
                recordId: this.playerId
            }

            getAttendee(inputvalue)
                .then((response) => {
                    console.log(response.Attendee__c);
                    this.totalDinnerCost = response.Attendee__c * this.dinnerCost
                    this.totalSnackCost = response.Attendee__c * this.snacksCost

                    getCharge()
                        .then((result) => {
                            this.venueCost = result.Venue_Charge__c;
                            this.entertainmentCharge = result.Entertainment__c;
                            this.serviceCharge = result.Service__c;
                        })

                })
                .catch(error => {
                    console.log(error);
                })
        }
    }
    async handleCancel() {
        const result = await LightningConfirm.open({
            message: 'Are you sure you want to cancel your booking?',
            variant: 'default',
            label: 'Cancel Booking'
        })
        if (result) {
            this.handleSuccessAlertClick()
        } else {
            this.handleErrorAlertClick()
        }

    }

    async handleSuccessAlertClick() {
        
        await LightningAlert.open({
            message: 'Your booking has been canceled',
            theme: 'error',
            label: 'Booking Canceled'
        })
        deleteBooking({BookingId: this.playerId})
            .then(response => {
                console.log(this.playerId)
                console.log(response)
            })
            .catch(error => {
                console.log(error)
            })
        this.isOver = false
        this.close();
    }

    async handleErrorAlertClick() {
        await LightningAlert.open({
            message: 'You can continue your booking',
            theme: 'success',
            label: 'Booking not canceled'
        })
    }

    async handleConfirm(event) {
        this.isOver = false
        await LightningAlert.open({
            message: 'Your Booking has been Confirmed',
            theme: 'Success',
            label: 'Booking Confirmed'
        })
        createPriceList({ bookingId: this.playerId, dinnerCost: this.totalDinnerCost, snackCost: this.totalSnackCost, venue: this.venueCost, entertainment: this.entertainmentCharge, service: this.serviceCharge })
            .then((result) => {
                console.log(result + 'result: ' + JSON.parse(JSON.stringify(result)))
            })
            .catch(error => {
                console.log('error: ' + JSON.stringify(error))
            })

        this.close();
    }
}