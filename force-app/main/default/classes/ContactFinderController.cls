public with sharing class ContactFinderController {

    @AuraEnabled(cacheable=true)
    public static List<Contact> findContactsByEmail(String email) {
        return [
            SELECT Id, LastName, Email, Phone, Account.Name
            FROM Contact
            WHERE Email = :email
        ];
    }
    @AuraEnabled(cacheable=true)
    public static List<Contact> searchContactsByPartialEmail(String czesciowyEmail) {
        String wzorzec = '%' + czesciowyEmail + '%';
        return [
            SELECT Id, LastName, Email, Phone
            FROM Contact
            WHERE Email LIKE :wzorzec AND OwnerId = :UserInfo.getUserId()
            LIMIT 5
        ];
    }
    @AuraEnabled
    public static Contact createContact(String email, String lastName) {
        Contact newContact = new Contact();
        newContact.Email = email;
        newContact.LastName = String.isBlank(lastName) ? email : lastName;

        insert newContact;

        return [SELECT Id, LastName, Email, Phone, Account.Name FROM Contact WHERE Id = :newContact.Id];
    }
}