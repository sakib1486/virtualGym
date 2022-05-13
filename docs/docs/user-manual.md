# User Manual

This is a user manual for CMPUT 401 Virtual Gym web project.

## Web Access

To access the application, use the url http://virtual-gym-dashboard.herokuapp.com/.

## Sign up 

There are two ways for users to sign up: entering in their information or signing up with a valid Google account.
![image](https://user-images.githubusercontent.com/56741509/161399601-5c5f938f-fe94-4471-bda7-76b1d799ffc2.png)

### Signing up by creating an account

1. Click the "Sign Up" button in the header.

2. Enter in a valid email, first name, last name, username, and password inside the textboxes. Passwords must contain an uppercase and lower case letters, at least one number and at least one symbol. The users password will need to be entered twice for additional confirmation. Remember to enter the same username as the associated profile on the Oculus device. 

3. Click the "Sign up" confirmation button. A popup should appear indicating that successful account creation.

### Signing up with a Google account

1. Click the "Sign Up" button in the header.

2. Click the "Sign Up With Google" button.

3. Choose the Google account to sign in with. 

4. A popup will appear that requires the user to enter a username. Remember to select the same username as the associated profile on the Oculus device. Click the "Click To Submit" button after entering a username. 

5. A popup should appear indicating successful account creation.

## Login

Note: After signing up, the user will be unapproved. An unapproved user will not be able to log in until the administrator of the website approves the user.  See Approve User section below

![image](https://user-images.githubusercontent.com/56741509/161399788-d79507eb-f901-4b1d-8546-f5cd2c62d312.png)

### Login with email and password

1. Enter in a valid email and password.

2. Select the "Log In" button. 

3. On a successful login, the user will be directed to the main dashboard.

### Login with Google account
1. Select "Log in with Google" to log in with a google account

## Password Reset
1. Select the "Forget Password" at the top

2. Enter in the email used to sign up into the system and click the "Request Password Reset" button
![image](https://user-images.githubusercontent.com/56741509/161403043-e4d0f1a4-e82d-4e39-9d05-b4059ab75720.png)

3. If the email is valid, the user will receive an email with a text token.

4. Copy the text token from the email and paste the token into the text field and select "Validate Token" button

5. In the text fields, enter in a new password. The password should contain uppercase and lowercase letters, at least one number and at least one symbol

6. Select "Request Password Reset" button to reset the password.



### Main Progress Dashboard

Upon successful login, a list of sessions will be displayed on the right and options for searching sessions will appear on the left. Each item in the list represents a played VirtualGym game from the Oculus device that shows the name of the game, the username of the player and the start and end times of the session. Users are able to search sessions by game name, version and date. The "Clear Search" button clears the search query. The "Logout" button and user profile button is always available  wherever the user navigates to.

![image](https://user-images.githubusercontent.com/56741509/161400000-619c5fbc-14fc-4d7b-99ad-3aaa6a75cf28.png)

## User Profile

![image](https://user-images.githubusercontent.com/56741509/161404006-89f0cbfa-afa4-4f5b-b598-eca1c83c9926.png)  

This icon will take the user to their user profile page that displays their username, first and last name and email. Users are also able to change their password from this page.  

![image](https://user-images.githubusercontent.com/56741509/161404029-f57b6271-3d4e-44a9-9e02-fcf48e9a070c.png)


### Change Password

![image](https://user-images.githubusercontent.com/56741509/161404108-efa6b881-f445-41a4-a1fa-97f256efd140.png)

1. Select the "Change Password" button on the user profile page.

2. Enter in a new password. The password should have uppercase and lower case letters and at least one number and at least one symbol

3. Select "Request Change Password" to reset the password

## Session Details Page
When users select a session from the session list, they will be re-directed to the session details page where more details of the game session are displayed as text and graph visualizations. The tab at the top allows the user to navigate to different sections of the session such as: game performance, functional mobility and compare progress. The back button at the top left will redirect the user back to the main progress dashboard page.

### Viewing game performance
The game performance tab is the first page the user will see after selecting a session from the session list on the main dashboard page .

This page displays the performance table, hits and misses, and target time metrics. Each component can be toggled to show or hide the metric using the switches at the top of each box. Beside each title header, hovering the cursor over the question mark icon will display a textbox describing each metric.
![image](https://user-images.githubusercontent.com/56741509/161400187-b27f2cc9-c480-4b28-b0f3-5a2253566f5a.png)


### Viewing functional mobility
The functional mobility for the selected session can be view by selecting the "Functional Mobility" button in the tab at the top. 

This page displays the average joint speed, individual joint speed, and space coverage metrics. Similar to the game perofrmance page, each metric box has a toggle switch to show or hide the metric and a question mark icon that describes the metric when a cursor hovers over it.
![image](https://user-images.githubusercontent.com/56741509/161400387-6797fdf4-5885-42ae-a81c-31d77f183065.png)

![image](https://user-images.githubusercontent.com/56741509/161400393-ddb735af-e8f2-459a-9f63-c77439138ea0.png)


### Viewing compare progress

The comparison page can be viewed by selecting the "Compare Progress" button in the tab at the top.  
This page displays the current session metric in the white box on the left and the average of all previously dated session from the current date metrics displayed in the white box on the right. In the previous sessions box, the user is able to select a specific game version using the "Version" dropdown menu. Filtering a specific version will recalculate the averages of all previous sessions. In the current sessions box, users will see colored text indicators that show whether the user preformed above or below the average of the previous session statistics on the right.

![image](https://user-images.githubusercontent.com/56741509/161400870-d6fbb786-17d8-4f9b-9e75-044ed8112b30.png)



## Admin Tasks

![image](https://user-images.githubusercontent.com/56741509/161403231-47669997-470d-4a94-bc42-d3be4daaf6d2.png)  
An administrator of the website will see two more icons on the top right header after logging into the website. These icons are only available to a user with an administrative role. On the right icon, the administrative user may see a red circled number indicating the number of unapproved users that need to be approved by the administrator

Additionally, the sessions lists will display the sessions for all users of the system and are able to search for specific players on the search bar in the white box on the left side. 

![image](https://user-images.githubusercontent.com/56741509/161403153-41f93ae7-44d0-4b31-85d7-f8a71394f546.png)


### Notification Page

![image](https://user-images.githubusercontent.com/56741509/161403372-b7a4a17f-1bb9-483f-9403-590740edd491.png)  
This icon will navigate the administrative user to the admin approval page, also called the notification page.

On this page, the admin is able to view a list of all users on the server and approve users. On the left inside the white box, the "Approved" and "Disapproved" buttons are filter buttons to filter the table on the right.

![image](https://user-images.githubusercontent.com/56741509/161403391-6e99a6d7-3b74-4247-b69c-be91973fe1f4.png)

## Approve Users

Admins are able to verify the username, email and names of the users to confirm the account matches the username made on the Oculus device. The posting of the session data to the website checks to see if the username already exists in the server. Please ensure that the username used in the Oculus device matches exactly with the username made on the website. After approving a user, the approved user will be able to successfully log into the website to view their sessions.

![image](https://user-images.githubusercontent.com/56741509/161403673-42b4a91f-c9ef-42cf-b467-654b65285d87.png)

1. Select a user from the table to approve using the checkbox on the left. Admins are also able to select multiple users to approve.

2. On the left, select "Approve Selected" button to approve the selected users or "Clear Selection" button to clear the selected users

3. After clicking "Approve Selected" button, the user will be set to approved.


### Django Admin Page

![image](https://user-images.githubusercontent.com/56741509/161403358-22960f95-04fa-4df2-8b40-05aba3753feb.png)  

This icon will navigate the administrative user to the django admin page where they are able to edit and delete users or sessions.  

![image](https://user-images.githubusercontent.com/56741509/161404310-edce4da3-74b3-4afb-8197-fa16583e00df.png)

Selecting the "Sessions" will show a list of sessions. Admins are able to search for a specific session by username and game type and be able to select a session to edit or delete.  

Selecting the "Users" will show a list of users. Admins are able to search for users by email and username.  

Administrators are also able to create new admin users by selecting a user from the user list and changing the "Role" to "admin"
![image](https://user-images.githubusercontent.com/56741509/161404657-2e782241-bf7c-4ce3-8783-47fde979e2fe.png)




## Posting session data

You can send new session data via an HTTP POST request to the `/sessions` endpoint. We recommend using [Postman](https://www.postman.com/) to do this.  

Once you have Postman open, create a new request and set the request method to POST. You'll need to attach these headers from the "headers" section. All the headers besides the `application/json` one should have been auto generated. It should look like this:

![image](https://user-images.githubusercontent.com/43189616/161354900-261051d7-e088-4154-b6ba-68478ec14ed0.png)

The user will also need to attach two files to the body of the request. One will be the session data `.vg` file generated by the Oculus device, attach this file with the key `data`. The second file will be the template `.tvg` file that was used for the game session, attach this file with the key `template`. The user will need to make sure that the body type is set as `form-data`. It should look like this in Postman:

![image](https://user-images.githubusercontent.com/43189616/161354925-3f904828-7579-4d6e-889d-fab54ae7febf.png)


The user can also use another method to send the POST request. But the headers and body specified above are required. 


