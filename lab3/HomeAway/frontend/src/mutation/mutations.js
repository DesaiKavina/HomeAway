
import { gql } from 'apollo-boost';

const travelerSignupMutation = gql`
    mutation AddTraveler($firstname: String, $lastname: String, $email: String, $password: String){
        addTraveler(firstname: $firstname, lastname: $lastname, email: $email, password: $password){
            email
        }
    }
`;

const ownerSignupMutation = gql`
    mutation AddTraveler($firstname: String, $lastname: String, $email: String, $password: String){
        addOwner(firstname: $firstname, lastname: $lastname, email: $email, password: $password){
            email
        }
    }
`;

const travelerProfileMutation = gql`
mutation TravelerProfile($firstname: String, $lastname: String, $email: String, $aboutme: String, $city: String, 
                         $country: String, $company: String, $school: String, $hometown: String, $languages: String, $gender: String, $phoneno: String){
    TravelerProfile(firstname: $firstname, lastname: $lastname, email: $email, aboutme: $aboutme, city: $city, country: $country, company: $company,
                    school: $school, hometown: $hometown, languages: $languages, gender: $gender, phoneno: $phoneno){
        email
        firstname
        lastname
    }
}
`;

const HomePageSearchMutation = gql`
    mutation HomePageSearch($location: String, $startDate: String, $endDate: String, $guests: String, $email: String){
         HomePageSearch(location: $location, startDate: $startDate, endDate: $endDate, guests: $guests, email: $email){
        email
        location
        startDate
        endDate
        guests
    }
}
`;

const TravelerBookingMutation = gql`
    mutation TravelerBooking($email : String, $bookPropertyName : String){
        TravelerBooking(email: $email, bookPropertyName: $bookPropertyName){
            email
            bookPropertyName
        }
    }
`;

export {travelerSignupMutation, ownerSignupMutation, travelerProfileMutation, HomePageSearchMutation, TravelerBookingMutation};