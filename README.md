# Welcome to Therify

Our app was built by Group 3 at the UC Berkeley Extension Coding Boot Camp March 2018 consisting of: 
Vaibhav Tank, Denis Wu, Nick Wactor, Yusuf Mekias, Hillari Malle, and Mike Thompson

The purpose of our app is to verify that a photo or video submitted by a user has been verified as authentic. Our app will verify that the photo or video was actually captured at the location and time the user claims by verifying that the metadata and Google Maps gps location and timestamps match. This prevents a user from claiming that a submitted photo was taken from a different location or time. For example, if a user witnesses an act of violence or a weather phenomena, the exact location and time of the event will be posted with the photo or video and the submission will be marked 'Therified'. This app would be extremely useful for anyone who wishes to documents events without the authenticity being questioned. The app also does not provide the location from which the photo or video was uploaded, protecting the users identity. This would be useful if, for example, a user captures illegal activity or simply wishes to remain an anonymous witness.

Technology Used:
React Native, Expo XDE, npm packages, AWS

## Use

To use Therify, you will need to download the Expo client app for your smart phone. Once you have it installed, on Android you can check out Therify by visiting https://expo.io/@vtank/therify and scanning the QR code there with your Expo app. iOS users ~~are SOL~~ will need to clone this repo and run it locally through Expo XDE in order to use the app.

Therify requires the user to login with a Google account.

## Install App Locally

Requirements: You will need node.js installed in your terminal and Expo XDE, which can be found here: https://docs.expo.io/versions/latest/introduction/installation 

1. Navigate to the directory where you would like to download Therify's files and run `git clone https://github.com/v-tank/therify.git`

2. `cd therify` `npm install` `yarn add`

### To Run:

1. Open Expo XDE and click `Open existing project...`, then give it the directory to which you cloned this repository.

2. Expo XDE will start the app. Once it has completed, hit the `share` button to send the app to your phone.

## Backend Installation (local server and database)

Keep reading if you'd like to run your own instance of the Therify server (you will have your own private photo and user database).

1. Create a new directory separate from the Therify app and run `git clone https://github.com/nwactor/therifybackend.git`
  (repository for backend code can be found here: https://github.com/nwactor/therifybackend)

2. `cd therifybackend` `npm install`

3.  Create a local mongoDB database called "therify"

4. Navigate to line 19 of server.js (located in the project's root directory) and replace the string in `mongoose.connect("<string>")` with `mongodb://localhost/therify`

5. Go into your Therify app directory, and change the connection IP addresses to your local IP address (search for the keyword 'heroku') in the following files: 

6. `node start` in your therifybackend directory (the one that contains server.js)

![screenshot](assets/images/splash.png)
![screenshot](assets/images/icon.png)
