# guc-portal

## Team Members

* Abdelaziz Adel

* Ahmed Abdulkareem

* Mahmoud Reda

* Mazen Ashraf

* Ziad Tamer

  

## Start file

server/index.js

  

## port

3000


## Routes

### 1. GUC Staf Members Functionalities :

* ####  Log in with a unique email and a password.
	* Functionality : logging in with email and password
	* Route : /login
	* Request type : POST
	* Request body :{
    "email": "anything@example.com",
    "password": "password"
}
	* Response : Text indicating whether the user logged in successfully or not

### 4.2 Course Instructor Functionalities
* #### View the coverage of course(s) he/she is assigned to.
    * Functionality : view the percentage of slots assigned to academic members relative to the total number of slots.
    * Route : /instructors/:instructorId/coverage
    * Request type : **GET**
    * Response : an object containing attributes the courses this instructor is assigned to as the key and the percentage is given as the value.
    * Example: {"Advanced Computer Lab":50,"Software Engineering":25}
* #### View the slots' assignment of course(s) he/she is assigned to.
    * Routes:
        * 1st route name : instructors/:id/courses
            * Functionality : returns the Ids and Names for the courses  this instructor is responsible for
            * Request type : **GET**
            * Parameters : id refers to the instructor's Id
            * Response : an array of objects where each object has 2 attributes courseId and course name which indicates the courses this instructor was originally assigned to.
            * Example: {"courses":[{"courseId":"course1","courseName":"Advanced Computer Lab"}]}
        * 2nd route name : /courses/:courseId/slots-assignment
            * Functionality : returns Information about all the slots for this course 
            * Request type : **GET**
            * Parameters : courseId refers to the course that is intended to view its slots
            * Request body : { "instructorId" : "value"}. 
            * Response : an array of information of all slots given in this course
            * Example : { "slotsInformation" : [{"slotDay":1, "slotPeriod" : 4, "slotLocation" : "C7.305", "instructor" : "Not Assigned yet", "course" : "Advanced Computer Lab"}, {"slotDay":3, "slotPeriod" : 2, "slotLocation" : "C7.301", "instructor" : "Mohammed Ashry", "course" : "Advanced Computer Lab"}]}
* #### View all the staff in his/her department along with their profiles
