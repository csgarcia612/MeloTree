import gql from 'graphql-tag';


export const GET_USER = gql` 
query getUser($auth0_id: String) {
    user(auth0_id: $auth0_id) {
      username
      first_name
      last_name
      email
      image_url
      address{
        address_id
        address_one
        address_two
        city
        state
        zipcode
      }
      
    }
  }`

export const NEW_ADDRESS = gql`
  mutation updateAddress($input: updateAddress! ){
    addressUpdate(input: $input){
      address_one
      address_two
      city
      state
      zipcode
    }
  }
`
export const DELETE_ADDRESS = gql`
mutation deleteAddress($address_id: ID!) {
  deleteAddress(address_id: $address_id){
    address_id
  }
  } `

export const DELETE_USER = gql`
mutation deleteUser($auth0_id: String!) {
  deleteUser(auth0_id: $auth0_id){
    auth0_id
  }
  } `

export const UPDATE_USER = gql`
  mutation updateUser($input: updateUser! ){
    userUpdate(input: $input){
      username
      first_name
      last_name
      email
      image_url
    }
  }
`


  

    
  