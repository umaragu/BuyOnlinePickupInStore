### This is the React Starter

To view the Vue starter, click [here](https://github.com/aws-samples/aws-amplify-auth-starters/tree/vue).

To view the React Native starter, click [here](https://github.com/aws-samples/aws-amplify-auth-starters/tree/react-native).

# AWS Amplify React Authentication Starter

![](hero.png)

## This project includes:    
- User sign up
- User sign in
- 2 factor authentication
- Real world auth flow using React Router
- Protected routes
- Redirects for unauthorized users
- Time-based one time password (TOTP)    

## Getting started    

#### Initial setup

1. Make sure you are on a new version of the AWS Amplify CLI to be sure you have multiple environment support.

```sh
npm install -g @aws-amplify/cli
```

2. clone the project    

```sh
git clone https://github.com/aws-samples/aws-amplify-auth-starters.git
```

3. Check out the React branch

```sh
git checkout react
```

4. install dependencies using npm or yarn    

```sh
npm install
```

5. Start project    

```sh
npm start
```

#### Setting up back end AWS services

If you do not have your AWS services already created, follow these steps. If you already have your services set up, just configure your aws-exports.js file.    

1. From the root of the project, initialize the Amplify project    

```sh
amplify init
```

2. Create the resources in your account

```sh
amplify push
```

#### Enabling MFA

1. Visit the [Amazon Cognito User Pool Dashboard](https://console.aws.amazon.com/cognito/users) & click on your user pool.

```sh
amplify console auth
```

2. Click on MFA & verifications

3. Do you want to enable Multi-Factor Authentication (MFA)? __Optional__

 What do you want to do? Walkthrough all the auth configurations
 Select the authentication/authorization services that you want to use: User Sign-Up & Sign-In only (Best used with a cloud API only)
 Do you want to add User Pool Groups? No
 Do you want to add an admin queries API? No
 Multifactor authentication (MFA) user login options: OFF
 Email based user registration/forgot password: Enabled (Requires per-user email entry at registration)
 Please specify an email verification subject: Your verification code
 Please specify an email verification message: Your verification code is {####}
 Do you want to override the default password policy for this User Pool? No
 Specify the app's refresh token expiration period (in days): 30
 Do you want to specify the user attributes this app can read and write? Yes
 Specify read attributes: Email, Family Name, Given Name, Phone Number
 Specify write attributes: Family Name, Given Name, Phone Number
 Do you want to enable any of the following capabilities? 
 Do you want to use an OAuth flow? No
Warning! Your existing IdentityPool: retailui86a5c6d0_identitypool_86a5c6d0 will be deleted upon the next “amplify push”!
? Do you want to configure Lambda Triggers for Cognito? No