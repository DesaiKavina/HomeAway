import { gql } from 'apollo-boost';

const loginQuery = gql`
    query loginUser($email: String, $password: String){
        loginUser(email : $email, password: $password){
            email
            firstname
            lastname
         }
    }
`;

const TravelerLoginQuery = gql`
    query loginTraveler($email: String, $password: String){
        loginTraveler(email : $email, password: $password){
            email
            firstname
            lastname
         }
    }
`;

const TravelerProfileQuery = gql`
    query travelerProfile($email: String){
        travelerProfile(email : $email){
            email
            firstname
            lastname
            aboutme
            city
            country
            company
            school
            hometown
            languages
            gender
            phoneno
        }
    }
`;

const OwnerDashboardQuery = gql`
    query ownerDashboard($email: String){
        ownerDashboard(email : $email){
            email,
            propertyDetails {
                pCountry
                pAddress
                pCity
                pState
                pZipcode
                pName
                pDescription
                pType
                pBedrooms
                pBathrooms
                pAccomodates
                pAvailableStart
                pAvailableEnd
                pPricePerNight
                bookingInfo {
                    travelerEmail
                    bookedStartDate
                    bookedEndDate
                }
            }
        }
    }
`;

const homePageSearchQuery = gql`
    query homePageSearch($pCity: String, $pAvailableStart: String, $pAvailableEnd: String, $pAccomodates: String, $email: String){
        homePageSearch(pCity: $pCity, pAvailableStart: $pAvailableStart, pAvailableEnd: $pAvailableEnd, pAccomodates: $pAccomodates, email: $email){
            pCountry
            pAddress
            pCity
            pState
            pName
            pDescription
        }
    }
`;

const travelerSearchResultsQuery = gql`
    query searchResults($email: String){
        searchResults(email: $email){
            email,
            propertyDetails {
                pCountry
                pAddress
                pCity
                pState
                pZipcode
                pName
                pDescription
                pType
                pBedrooms
                pBathrooms
                pAccomodates
                pAvailableStart
                pAvailableEnd
                pPricePerNight
                pOwner
            }
        }
    }
`;

const travelerTripsQuery = gql`
    query travelerTrips($email: String){
        travelerTrips(email: $email){
            email,
            bookedPropertyDetails {
                pCountry
                pAddress
                pCity
                pState
                pZipcode
                pName
                pDescription
                pType
                pBedrooms
                pBathrooms
                pAccomodates
                blockStartDate
                blockEndDate
                pPricePerNight
                guests
                pOwner
            }
        }
    }
`;

export { loginQuery, TravelerLoginQuery, TravelerProfileQuery, OwnerDashboardQuery, homePageSearchQuery, travelerSearchResultsQuery, travelerTripsQuery };