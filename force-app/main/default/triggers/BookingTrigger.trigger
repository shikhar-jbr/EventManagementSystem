trigger BookingTrigger on Booking_List__c (before delete) {
    public static void deleteBookingById(Id recordId){
        Booking_List__c recordToDelete= [SELECT Id FROM Booking_List__c WHERE Id= :recordId];
        delete recordToDelete;
    }
    
    public static void onBeforeDelete(List<Booking_List__c> records){
        if(records.size()==1){
            Id recordId= records[0].Id;
            deleteBookingById(recordId);
        }
    }
}