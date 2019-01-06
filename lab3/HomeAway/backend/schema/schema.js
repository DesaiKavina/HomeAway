const graphql = require('graphql');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
var {Users} = require('../models/userinfo');
var {mongoose} = require('../db/mongoose');
var express = require('express')
var app = express();
app.set('view-engine','ejs')
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull
} = graphql;

const PropertyBookingType = new GraphQLObjectType({
    name: 'PropertyBookings',
    fields : ( ) => ({
        travelerEmail : {type: GraphQLString},
        bookedStartDate : {type: GraphQLString},
        bookedEndDate : {type: GraphQLString}
    })
})

// const BookedPropertyType = new GraphQLObjectType({
//     name: 'BookedProperty',
//     fields : ( ) => ({
//         pCountry : {type: GraphQLString},
//         pAddress : {type: GraphQLString},
//         pCity : {type: GraphQLString},
//         pState : {type: GraphQLString},
//         pZipcode : {type: GraphQLString},
//         pName : {type: GraphQLString},
//         pDescription : {type: GraphQLString},
//         pType : {type: GraphQLString},
//         pBedrooms : {type: GraphQLString},
//         pBathrooms : {type: GraphQLString},
//         pAccomodates : {type: GraphQLString},
//         blockStartDate : {type: GraphQLString},
//         blockEndDate : {type: GraphQLString},
//         pPricePerNight : {type: GraphQLString},
//         pOwner : {type: GraphQLString},
//         guests : {type: GraphQLString}
//     })
// })

const PropertyType = new GraphQLObjectType({
    name: 'Property',
    fields : ( ) => ({
        pCountry : {type: GraphQLString},
        pAddress : {type: GraphQLString},
        pCity : {type: GraphQLString},
        pState : {type: GraphQLString},
        pZipcode : {type: GraphQLString},
        pName : {type: GraphQLString},
        pDescription : {type: GraphQLString},
        pType : {type: GraphQLString},
        pBedrooms : {type: GraphQLString},
        pBathrooms : {type: GraphQLString},
        pAccomodates : {type: GraphQLString},
        pAvailableStart : {type: GraphQLString},
        pAvailableEnd : {type: GraphQLString},
        pPricePerNight : {type: GraphQLString},
        pOwner : {type: GraphQLString},
        bookingInfo : {type: new GraphQLList(PropertyBookingType)},
        blockStartDate : {type: GraphQLString},
        blockEndDate : {type: GraphQLString},
        guests : {type: GraphQLString}
    })
})

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: ( ) => ({
        firstname: { type: GraphQLString },
        lastname: { type: GraphQLString },
        email: { type: GraphQLString },
        password : {type: GraphQLString},
        userflag : {type: GraphQLString},
        aboutme : {type: GraphQLString},
        city : {type: GraphQLString},
        country : {type: GraphQLString},
        company : {type: GraphQLString},
        school : {type: GraphQLString},
        hometown : {type: GraphQLString},
        languages : {type: GraphQLString},
        gender : {type: GraphQLString},
        phoneno : {type: GraphQLString},
        bookPropertyName : {type: GraphQLString},
        propertyDetails : {type: new GraphQLList(PropertyType)},
        bookedPropertyDetails : {type: new GraphQLList(PropertyType)}
    })
});


const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {

        addTraveler: {
            type: UserType,
            args: {
                firstname: { type: GraphQLString },
                lastname: { type: GraphQLString },
                email: { type: GraphQLString },
                password : {type: GraphQLString},
                userflag : {type: GraphQLString}
            },
            async resolve(parent, args){
                var salt = bcrypt.genSaltSync(10);
                var hash = bcrypt.hashSync(args.password, salt);

                var newTraveler = new Users({
                    firstname: args.firstname,
                    lastname: args.lastname,
                    email: args.email,
                    password : hash,
                    userflag: 'T'
                })
                console.log("----- Signup query -----");
                console.log("Printing the newTraveler : "+JSON.stringify(newTraveler));
                var result = await newTraveler.save()
                // newTraveler.save()
                console.log("The obtained result is : ",result);
                return newTraveler;
            }
        },

        addOwner: {
            type: UserType,
            args: {
                firstname: { type: GraphQLString },
                lastname: { type: GraphQLString },
                email: { type: GraphQLString },
                password : {type: GraphQLString},
                userflag : {type: GraphQLString}
            },
            async resolve(parent, args){
                var salt = bcrypt.genSaltSync(10);
                var hash = bcrypt.hashSync(args.password, salt);

                var newOwner = new Users({
                    firstname: args.firstname,
                    lastname: args.lastname,
                    email: args.email,
                    password : hash,
                    userflag: 'O'
                })
                console.log("----- Owner Signup query -----");
                console.log("Printing the newOwner : \n"+JSON.stringify(newOwner));
                // var result = await newTraveler.save()
                var result = await newOwner.save()
                console.log("The obtained result is : ",result);
                return newOwner;
            }
        },

        TravelerProfile: {
            type: UserType,
            args: {
                firstname: { type: GraphQLString },
                lastname: { type: GraphQLString },
                email: { type: GraphQLString },
                city : {type: GraphQLString},
                aboutme : {type: GraphQLString},
                country : {type: GraphQLString},
                company : {type: GraphQLString},
                school : {type: GraphQLString},
                hometown : {type: GraphQLString},
                languages : {type: GraphQLString},
                gender : {type: GraphQLString},
                phoneno : {type: GraphQLString}
            },
            async resolve(parent, args){
                console.log("\nBefore the mongo query for traveler profile updation");
                console.log("The email whose updation requires to be done is : "+args.email)
                var result = await Users.update(
                    {email: args.email},
                    {
                        firstname: args.firstname,
                        lastname: args.lastname,
                        aboutme: args.aboutme,
                        city: args.city,
                        country: args.country,
                        company: args.company,
                        school: args.school,
                        hometown: args.hometown,
                        languages: args.languages,
                        phoneno: args.phoneno,
                        gender: args.gender,
                    },
                    { upsert: true }
                )

                console.log(" ------ Printing the result ------ ");
                console.log(result)
                return result;
                // if (result){
                //     console.log("Some result was obtained after traveler profile update mutation");
                //     console.log(" ------ Printing the result ------ ");
                //     console.log(result)
                //     return result;
                // }
                // else {
                //     console.log("Some error occured in updating traveler profile information");
                //     return "Some error occured in updating traveler profile information";
                // }
            }
        },

        TravelerBooking : {
            type: UserType,
            args : {
                email: { type: GraphQLString },
                bookPropertyName : { type: GraphQLString }
            },
            async resolve(parent, args){
                console.log("\nThe property whose booking needs to be done is : "+args.bookPropertyName);
                console.log("\nThe set email is : "+args.email)
                const searchdata = app.get('searchdata')
                console.log("\n^^^^^^^^^^^^^^^^^^ app.get search data ^^^^^^^^^^^^^^^^^^^");
                console.log(JSON.stringify(searchdata));

                const result = await Users.aggregate([
                    { $unwind :'$propertyDetails'},
                    { $match : {'propertyDetails.pName': args.bookPropertyName}},
                    { $project : { _id: 0, propertyDetails: 1, email: 1 } }
                    ],
                    function(err,result){
                        if(err){
                            console.log("\nSome error occured in the first query ");
                        }
                        else{
                            console.log("Found property details based on property names");
                            Users.updateOne(
                                // { email: req.session.emailT },
                                { email: args.email },
                                {
                                    $push: {
                                        bookedPropertyDetails: {
                                            pCountry: result[0].propertyDetails.pCountry,
                                            pAddress: result[0].propertyDetails.pAddress,
                                            pCity: result[0].propertyDetails.pCity,
                                            pState: result[0].propertyDetails.pState,
                                            pZipcode: result[0].propertyDetails.pZipcode,
                                            pName: result[0].propertyDetails.pName,
                                            pDescription: result[0].propertyDetails.pDescription,
                                            pType: result[0].propertyDetails.pType,
                                            pBedrooms: result[0].propertyDetails.pBedrooms,
                                            pBathrooms: result[0].propertyDetails.pBathrooms,
                                            pAccomodates: result[0].propertyDetails.pAccomodates,
                                            pImageFiles: result[0].propertyDetails.pImageFiles,
                                            pPricePerNight: result[0].propertyDetails.pPricePerNight,
                                            blockStartDate : searchdata.startDate,
                                            blockEndDate : searchdata.endDate,
                                            guests : searchdata.guests,
                                            pOwner : result[0].email, 
                                        }
                                    }
                                },
                                { upsert: true },
                                function( err, result1 ) 
                                {
                                    if ( err ) {
                                        console.log("Some error occured in handle_request of travelerprofile_post.js of kafka-backend");
                                        return "Some error occured"; 
                                    }
                                    else{
                                        // res.writeHead(200,{
                                        //     'Content-Type' : 'text/plain'
                                        // })
                                        
                                        console.log("\n--------------- Success ---------------");
                                        console.log("Booking data for this traveler added to his/her database"); 
                                        
                                        Users.updateOne(
                                            { $and : [{email : result[0].email},{'propertyDetails.pName': result[0].propertyDetails.pName}] },
                                            {
                                                $push: {
                                                    'propertyDetails.$.bookingInfo': {
                                                                travelerEmail : args.email,
                                                                bookedStartDate : searchdata.startDate,
                                                                bookedEndDate : searchdata.endDate
                                                    }
                                                }
                                            },
                                            { upsert: true },
                                            function( err1, result ) 
                                            {
                                                if ( err1 ) {
                                                    console.log("\nPrinting err1 : "+err1);
                                                    console.log(" - - - - - - - Some error occured - - - - - - -");
                                                }
                                                else{
                                                    console.log(" \n- - - - - - - Traveler booking data also added in the owner's database - - - - - - - ");
                                                    // callback(null,result);
                                                }
                                            }
                                        );
                                        // res.end('Booking data for this user added to the database');
                                    }
                                }
                            );
            
                        }
                    }
                );
                ////////////////////////////////////////////////////////////////////////////////////////
                if(result)
                {
                    console.log("Successfully made the booking and updated the database respectively");
                    return result;
                }
                else
                {
                    console.log("\nOops, there was some error");
                    return "Oops, there was some error"
                }
            }
        }
    }
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {

        loginUser : {
            type: UserType,
            args: {
                email : {type: GraphQLString},
                password : {type : GraphQLString}
            },
            async resolve(parent, args) {
                const validuser = await Users.findOne({
                    email : args.email
                })
                if (validuser && bcrypt.compareSync(args.password, validuser.password) && validuser.userflag=="O")
                {
                    console.log("Printing the result obtained after successful owner login")
                    console.log(validuser);
                    return validuser;
                    
                }
                else
                {
                    return "This owner does not exist"
                }
            }
        },

        loginTraveler : {
            type: UserType,
            args: {
                email : {type: GraphQLString},
                password : {type : GraphQLString}
            },
            async resolve(parent, args) {
                const validuser = await Users.findOne({
                    email : args.email
                })
                if (validuser && bcrypt.compareSync(args.password, validuser.password) && validuser.userflag=="T")
                {
                    console.log("Successfully logged in");
                    console.log(validuser)
                    return validuser;
                }
                else
                {
                    console.log("This traveler does not exist");
                    return "This traveler does not exist"
                }
            }
        },

        travelerProfile : {
            type: UserType,
            args: {
                email : {type: GraphQLString},
            },
            async resolve(parent, args) {
                const result = await Users.findOne({
                    email : args.email
                })
                if (result)
                {
                    console.log("\nResult is obtained for traveler profile info")
                    console.log(result)
                    return result;
                }
                else
                {
                    console.log("Some error occured in getting traveler profile info")
                    return "Some error occured in getting traveler profile info";
                }
            }
        },

        ownerDashboard : {
            type: UserType,
            args: {
                email : {type: GraphQLString},
            },
            async resolve(parent, args) {
                console.log("____________ The email whose properties needs to be fetched : ________________ "+args.email);
                const result = await Users.find(
                    {email : args.email},
                    { propertyDetails: 1, _id: 0, email: 1 }
                )
                // return result;
                if (result)
                {
                    console.log("Result is obtained for owner's property details");
                    console.log("Printing the result : \n");
                    console.log(result[0]);
                    console.log("Printing the pCountry");

                    // return JSON.stringify(result);
                    return result[0];
                }
                else
                {
                    console.log("Some error occured in getting property details for owner's dashboard")
                    return "Some error occured in getting property details for owner's dashboard";
                }
            }
        },

        homePageSearch : {
            type: PropertyType,
            args: {
                email : {type: GraphQLString},
                pCity : {type: GraphQLString},
                pAvailableStart : {type: GraphQLString},
                pAvailableEnd : {type: GraphQLString},
                pAccomodates : {type: GraphQLString}
            },
            async resolve(parent, args) {
                const searchdata = {
                    "location" : args.pCity,
                    "startDate" : args.pAvailableStart,
                    "endDate" : args.pAvailableEnd,
                    "guests" : args.pAccomodates
                }
                app.set('searchdata', searchdata)
                const result = await Users.aggregate([
                    { $unwind :'$propertyDetails'},
                    { $match : {'propertyDetails.pCity': args.pCity , 'propertyDetails.pAccomodates': { $gte : args.pAccomodates} }},
                    { $project : { _id: 0, propertyDetails: 1, email: 1 } }
                ])
                if(result){
                    // console.log("\n======================= Printing the result before date filtering =====================");
                    // console.log(JSON.stringify(result));
                    myarr = []
                    for(let i=0; i<result.length;i++){
                        console.log();
                        // console.log(JSON.stringify(result[i]))
                        var obtainedStart = Date.parse(result[i].propertyDetails.pAvailableStart);
                        var obtainedEnd = Date.parse(result[i].propertyDetails.pAvailableEnd);
                        var searchedStartDate = Date.parse(args.pAvailableStart);
                        var searchedEndDate = Date.parse(args.pAvailableEnd)
                        // console.log("Obtained start date posted by owner: "+obtainedStart);
                        // console.log("Obtained start date posted by owner: "+obtainedEnd);
                        // console.log("Queried start date on homepage: "+searchedStartDate)
                        // console.log("Queried end date on homepage: "+searchedEndDate)
                        if(obtainedStart<=searchedStartDate && obtainedEnd>=searchedEndDate)
                        {
                            myarr.push(result[i])
                        }
                    }
                    // console.log("\n======================= Printing the result after date filtering =====================");
                    // for(let j=0; j<myarr.length; j++)
                    // {
                    //     console.log(JSON.stringify(myarr[j]))
                    //     console.log()
                    // }
                    app.set('QueriedSearchResults', myarr)
                    return myarr
                }
                else
                {
                    console.log("Some error occured in search results");
                    return "Some error occured in search results";
                }
            }
        },

        searchResults : {
            type : UserType,
            args: {
                email : {type: GraphQLString},
            },
            async resolve(parent, args) {
                // console.log("_ _ _ _ _ _ _ _ _ _ _  The set email id is : _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ "+args.email);
                var searched_properties = app.get('QueriedSearchResults')
                var myResponse = {
                    "propertyDetails" : []
                }
                for(let k=0; k<searched_properties.length; k++)
                {
                    myResponse.propertyDetails.push(searched_properties[k].propertyDetails)
                    myResponse.propertyDetails[k].pOwner = searched_properties[k].email
                }
                console.log("\nPrinting the response for search results");
                console.log(JSON.stringify(myResponse));
                return myResponse
            }
        },

        travelerTrips : {
            type: UserType,
            args: {
                email : {type: GraphQLString},
            },
            async resolve(parent, args) {
                console.log("____________ The email whose trips needs to be fetched is : ________________ "+args.email);
                const result = await Users.aggregate([
                    // { email : setEmail},
                    { $unwind :'$bookedPropertyDetails'},
                    { $match : {'email': args.email}},
                    { $project : { _id: 0, bookedPropertyDetails: 1, email: 1 } }
                    ]);
                if (result)
                {
                    // console.log("\n>>>>>>> Result obtained for traveler trips");
                    // console.log(JSON.stringify(result));
                    const myResponse = {
                        "bookedPropertyDetails" : []
                    }
                    for(let i=0;i<result.length;i++)
                    {
                        myResponse.bookedPropertyDetails.push(result[i].bookedPropertyDetails)
                        myResponse.email = result[i].email;
                    }
                    console.log("\nPrinting myResponse : ");
                    console.log(JSON.stringify(myResponse));
                    return myResponse;
                }
                else
                {
                    console.log("\n>>>>>>> There was some error in traveler trips query");
                    return "There was some error in traveler trips query";
                }
            }
        },  
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});