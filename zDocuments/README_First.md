# AngularStudy

Angular Material Site : https://v15.material.angular.io/
Primeng Site : https://www.primefaces.org/primeng-v15-lts/#/

** Use PrimeNG or Angular Material for the interface.

NodeJS site : https://nodejs.org/en/download/current

First, install NodeJS because of npm
Then, install Angular CLI
>> npm install -g @angular/cli

Assignment 01 : Login Page
1. Decorate the Login page to look as similar as possible to the Login-page.jpg
2. add custom logo in login page
3. show error message if username or password is empty in app.login.component.ts
ex) if the user enters only the username and clicks the login button, expect to display an error message under the username & password input field.

Assignment 02 : User Registration
1. Create the user registration page to look as similar as possible to 02.UserRegistration.png
** use this.authenticationService.registerNewUser for user creation
2. first name and last name is required feild.
3. display 02-01.UserRegistration-Success.png page when created new user
4. show duplicate user error message as 02-02.UserRegistration-DupError.png

Assignment 03 : User Management
1. Create the user registration page to look as similar as possible to 03.UserManagement.png
** use  this.userService.getAllUsers() to pull the userlist
2. Update the user info ( refer to 03-01.UserManagement-User_Selected & 03-01.UserManagement-User_Selected )
** use this.userService.updateUserInfo() for updating the user info