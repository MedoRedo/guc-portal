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
	* Request body :{"email" : "anything@example.com", "password" : "password"}
	* Response : Text indicating whether the user logged in successfully or not
***
* #### Log out from the system.
	* Functionality : logging out from the system
	* Route : /logout
	* Request type : GET
	* Response : Text indicating that the user has logged out successfully
***
* #### View their profile.

	* Functionality : viewing profile information
	* Route : /profile
	* Request type : GET
	* Response : Staff member object. Example of staff member object : 
{"id": "ac-1",
  "name": "Ahmed",
  "email": "anything@example.com",
  "gender": "male",
  "salary": 15000,
  "dayOff": 5,
  "leaves": 4,
  "password": "anything",
  "officeLoc": "c6.303" }
***
* #### Update their profile except for the id and the name. Academic members can't update their salary, faculty and department.
	* Functionality : updating profile information
	* Route : /updateProfile
	* Request type : POST
	* Request body : 
	{"email": "anything@example.com",
  "gender": "female" }
	 * Response : Text indicating whether the profile was updated successfully or not.
***
* #### Reset their passwords.
	* Functionality : change password
	* Route : /changePassword
	* Request type : POST
	* Request body :
	* { "oldPass": "old",
  "newPass": "new" }
	* Response : Text indicating whether tha password was changed successfully or not
***
* #### Sign in. This should simulate a staff signing in(entering the campus).
	* Functionality : signing in the user
	* Route : /signin
	* Type : GET
	* Response : Text indicating that the user has signed in successfully
***
* #### Sign out. This should simulate a staff signing out(leaving the campus).
	* Functionality : signing out the user
	* Route : /signout
	* Type : GET
	* Response : Text indicating that the user has signed out successfully
***
* #### View all their attendance records, or they can specify exactly which month to view.
	* Functionality : viewing all attendance records
	* Route : /attendance
	* Type : GET
	* Response : Array of attendance objects. Example attendance object :
	{ "signIn": "2020-12-25T12:52:51.344Z",
  "SignOut": "2020-11-25T12:52:51.344Z" } 
  ***
  	* Functionality : viewing all attendance records in a specific month
	* Route : /attendance/:year/:month
	* Type : GET
	* Response : Array of attendance objects. Example attendance object :
	{ "signIn": "2020-12-25T12:52:51.344Z",
  "SignOut": "2020-11-25T12:52:51.344Z" } 
 ***
 * #### View if they have missing days. Missing days are days where the staff member don't have any attendance record, is not a Friday nor his/her day off, and there is no accepted leave for this day.
 
	 * Functionality : viewing missing days
	 * Route : /missingDays
	 * Type : GET
	 * Response : Array of Dates. Example :
	 [ "2020-12-25T12:52:51.344Z",
  "2020-11-25T12:52:51.344Z" ]
  ***
  * #### View if they are having missing hours or extra hours.
	* Functionality : viewing missing hours
	 * Route : /missingHours
	 * Type : GET
	 * Response : missing hours object. Example : { "missingHours": 12 }
***
### 3. HR Functionalities :
* #### View any staff member attendance record.
	* Functionality : View any staff member attendance record
	* Route : /HR/attendance/:year/:month/:staffId
	* Type : GET
	* Parameters : staffId is the ID of the staff member we are getting his attendance record
	* Response : Array of attendance objects. Example attendance object :
	{ "signIn": "2020-12-25T12:52:51.344Z",
  "SignOut": "2020-11-25T12:52:51.344Z" } 
***

* #### View staff members with missing hours/days.
	* Functionality : View staff members with missing hours
	* Route : /HR/StaffMembersWithMissingHours
	* Type : GET
	* Response : Array of objects {id: member.id, name: member.name, missingHours: hours}
  ***
	* Functionality : View staff members with missing days
	* Route : /HR/StaffMembersWithMissingDays
	* Type : GET
	* Response : Array of objects {id: member.id, name: member.name, missingDays: days}
***

* #### Update the salary of a staff member.
	* Functionality : Update the salary of a staff member
	* Route : /HR/updateSalary
	* Type : PUT
	* Request body : {"newSalary" : 7000, "staffId" : "ac-2"}
	* Response : Text indicating that the salary has been updated successfully
***

### 4. HOD Functionalities:
* #### Assign/delete/update a course instructor for each course in his department.
	* Functionality : Assign a course instructor for a course
	* Route : /HOD/assignInstructor
	* Type : POST
	* Request body : {"courseId": "CSEN 703", "instructorId": "ac-2"}
	* Response : A course model object with the new instructor added to its instructors array.
  ***
	* Functionality : delete a course instructor for a course
	* Route : /HOD/deleteInstructor
	* Type : DELETE
	* Request body : {"courseId": "CSEN 703", "instructorId": "ac-2"}
	* Response : A course model object with the instructor reomoved from its instructors array.
  ***
  	* Functionality : update a course instructor for a course
	* Route : /HOD/updateInstructor
	* Type : PUT
	* Request body : {"courseId": "CSEN 703", "instructorId1": "ac-2", "instructorId2": "ac-10"}
	* Response : A course model object with instructor1 removed from its instructors array and instructor2 added to it.
***

* #### View all the staff in his/her department or per course along with their profiles.
	* Functionality : view staff members in the HOD department 
	* Route : /HOD/viewStaff
	* Type : GET
	* Request body :  {"courseId": "CSEN 703"}(to view the staff of a single course) 
	* Response : Array of objects (represents the staff of this single course) {id: member.id, name: member.name, email: member.email,
        gender: member.gender, salary: member.salary, officeLoc: member.officeLoc,
         dayOff: member.dayOff, department: member.department}
	OR	Array of objects {'courseId': course.id, 'staff': staff}(all the staff in the department)
***

* #### View the day off of all the staff/ a single staff in his/her department.
	* Functionality : View the day off of all the staff/ a single staff
	* Route : /HOD/viewDayOff
	* Type : GET
	* Request body : {"staffId" : "ac-2"}(to view the day off of a single staff)
	* Response : Object {name: staffMember.name, id: staffMember.id, dayOff: staffMember.dayOff} (a single staff)
	OR Array of objects (all the staff in the department)
***
* #### View all the requests "change day off/leave" sent by staff members in his/her department.
	* Functionality : view all change day off requests 
	* Route : /HOD/viewChangeDayOffRequests
	* Type : GET
	* Response : Array of request model objects
  ***
	* Functionality : view all leave requests 
	* Route : /HOD/viewLeaveRequests
	* Type : GET
	* Response : Array of request model objects
***

* #### Accept a request. if a request is accepted, appropriate logic should be executed to handle this request.
	* Functionality : accept a request 
	* Route : /HOD/request
	* Type : POST
	* Request body : {"requestId": 'req-1', status : "Accepted"}
	* Response : Text indicating that the request has been accepted successfully
***

* #### Reject a request, and optionally leave a comment as to why this request was rejected.
	* Functionality : reject a request
	* Route : /HOD/request
	* Type : POST
	* Request body : {"requestId": 'req-1', status : "Rejected"} 
	* Response : Text indicating that the request has been rejected successfully
***

* #### View the coverage of each course in his/her department.
	* Functionality : View the coverage of each course in the department of that HOD
	* Route : /HOD/viewCoverage
	* Type : GET
	* Response : Array of objects {courseId: course.id, name: course.name, coverage: coverage}
***

* #### View teaching assignments (which staff members teach which slots) of course ordered byhis department.
	* Functionality : View teaching assignments
	* Route : /HOD/viewTeachingAssignments/:courseId
	* Type : GET
	* Parameters : courseId is the id of the course we want to get its teaching assignments 
	* Response : Array of objects {staffId: member.id, name: member.name, course: slot.course, period: slot.period, day: slot.day, location: slot.location}
***