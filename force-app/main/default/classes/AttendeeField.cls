public with sharing class AttendeeField {
    public AttendeeField() {

    }

    @AuraEnabled(cacheable=true)
    public static Booking_List__c getAttendee(Id recordId){
        return [SELECT Attendee__c FROM Booking_List__c WHERE Id= :recordId];
    }

    @AuraEnabled(cacheable=false)
    public static List<Price_List__c> createPriceList(String bookingId, Decimal dinnerCost, Decimal snackCost, Decimal venue, Decimal entertainment, Decimal service){

       List<Price_List__c> priceList= new List<Price_List__c>();
       if(bookingId!= NULL && dinnerCost!=NULL && snackCost!=NULL && venue!=NULL && entertainment!=NULL && service!=NULL){
        Price_List__c obj= new Price_List__c();
        obj.Booking_List__c=bookingId;
        obj.Dinner_Total_Cost__c= dinnerCost;
        obj.Snacks_Total_Charge__c= snackCost;
        obj.Venue_Rent_Charge__c= venue;
        obj.Entertainment_Charge__c= entertainment;
        obj.Service_Charge__c= service;
        
        priceList.add(obj);
       }
       if(!priceList.isEmpty()){
        insert priceList;
        return priceList;
       }
       return NULL;
    }

    @AuraEnabled(cacheable=true)
    public static Food_Type__c getCharge(){
        return [SELECT Venue_Charge__c, Service__c, Entertainment__c FROM Food_Type__c WHERE Name= 'Venue'];
    }

    @AuraEnabled(cacheable=true)
    public static void deleteBooking(Id BookingId){
        Booking_List__c booking= [SELECT Id FROM Booking_List__c WHERE Id= :BookingId];
        delete booking;
    }
}