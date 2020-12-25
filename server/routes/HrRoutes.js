const express= require('express');
const router= express.Router();

const DepartmentModel = require('../models/Department.js');
const MemberModel = require('../models/StaffMember.js');
const RequestModel = require('../models/Request.js');
const SlotModel = require('../models/Slot.js');
const CourseModel = require('../models/Course.js');
const FacultyModel = require('../models/Faculty.js');
const LocationModel = require('../models/Location.js');
const metaData = require('../models/metaData');
const auth = require('../routes/middleware.js').authentication;

router.use(express.json());
//router.use(auth)



//* Add Update or Delete a Location 
//* Update or delete
router.route("/opLocation/:id",auth)
.delete(async(req,res)=>{
    if(!isHR(req.body.member.id)){
        res.status(405).send("Error Invalid Credentials")
        return
    }
  
    LocationModel.findOneAndDelete({"id":id},req.params.id, (err,doc)=>{
        if(err) {
            
            res.status(400).send("Couldnt Find a Location");
            
            return}
        else{
            res.status(200).send("Deleted Successfully");

        }
    })

})
.post(async(req,res) =>{
    if(!isHR(req.body.member.id)){
        res.status(405).send("Error Invalid Credentials")
        return
    }

    var body = req.body
    try {
        LocationModel.findByOneAndUpdate({"id":id},req.params.id,req.body,(err,doc) =>{
            if(err) {
                res.status(400).send("Couldnt Add Location, try again !");
                return
            }
            else{
                res.status(200).send("Location Added Successfully");
            }
        })
    
        
    } catch (error) {
        res.status(400).send("Couldnt Add Location, Data is invalid !");
        
    }
})

router.route("/addLocation",auth)
.post(async(req,res) =>{

    if(!isHR(req.body.member.id)){
        res.status(405).send("Error Invalid Credentials")
        return
    }

    var body = req.body
    try {
        const location  = new LocationModel({
            "name": body.name,
            "capacity": body.capacity,
            "type": body.type
        })
        location.save((err,doc)=>{
            if(err) {
            res.status(400).send("Couldnt Add Location, try again !");
            return
        }
        else{
            res.status(200).send("Location Added Successfully");
        }
        })
        
    } catch (error) {
        
    }
   
})

// * update or delete a Faculty
router.route("/opFaculty/:id",auth)
.delete(async(req, res)=>{
    if(!isHR(req.body.member.id)){
        res.status(405).send("Error Invalid Credentials")
        return
    }

    var FacultyID = req.body.id
    FacultyModel.findOneAndRemove({"id":id},req.params.id,(err,doc)=>{
        if(err){ 
            res.status(400).send("Error Deleting Faculty");
            return console.log(err);
        }
        console.log('Faculty  Deleted Successfully');
        res.status(200).send('Faculty Deleted Successfully'); 
    });
    })

.post(async(req, res)=>{
    if(!isHR(req.body.member.id)){
        res.status(405).send("Error Invalid Credentials")
        return
    }
const faculty = new FacultyModel({
    "id": req.body.id,
    "name": req.body.name,
    "departments": req.body.departments
})

FacultyModel.findOneAndUpdate({"id":req.params.id},req.body,(err,doc)=>{
    if(err){ 
        res.status(400).send('Faculty failed to update');
         return console.log(err);}

    else{
            res.status(200).send('Faculty updated Successfully');
        }
    })
        })

// * Add a faculty
router.route("/addFaculty",auth)
.post(async(req, res)=>{
    if(!isHR(req.body.member.id)){
        res.status(405).send("Error Invalid Credentials")
        return
    }
const body = req.body

const id = await metaData.find({"sequenceName": 'fa'})[0].lastId;
if(id === undefined){
    id = 1;
}
id++;
await metaData.updateOne({"sequenceName": 'fa'},{'lastId' : id});

const faculty = new FacultyModel({
    "id": id,
    "name": body.name,
    "departments": body.departments
})
faculty.save((err,doc) =>{
    if(err) {
        res.status(400).send("Failed to add Course")
        return
    }
    else{
        res.status(200).send("Addd Course Successfully")
    }

})
})

//* Add Delete Update a Department under a faculty

// * Add A Dept under a faculty 
router.route("/addDepartment",auth)
.post( async(req,res)=>{
    // Faculty ID
    // A course Object 

    if(!isHR(req.body.member.id)){
        res.status(405).send("Error Invalid Credentials")
        return
    }
    const body = req.body
    try {
        const id = await metaData.find({"sequenceName": 'dp'})[0].lastId;
        if(id === undefined){
            id = 1;
        }
        id++;
       await metaData.updateOne({"sequenceName": 'dp'},{'lastId' : id});
        const Dept = new DepartmentModel({
            "id": id,
            "name": body.name,
            "HOD": body.HOD
        });
        FacultyModel.find({"id":faculyId},(err,doc) => {
            if(err){
                res.status(400).send("Error Locating the department")
                return
            }
            else{
                Dept.save((err,doc) => {
                    if(err) return console.log(err);
                    console.log("Added Successfully");
                    res.status(200).send('Added');
                    doc.departments.push(course.id)
                }); 
            }
        })
    } catch (error) {
        res.status(400).send("Error in Input Data")
        return
    }
})
// * Delete Update a Department under a faculty
router.route("/opDepartment/:id",auth)
.post(
    
    async(req, res) =>{
        if(!isHR(req.body.member.id)){
            res.status(405).send("Error Invalid Credentials")
            return
        }
        DepartmentModel.findOneAndUpdate({"id":req.params.id},req.body,(err,doc)=>{
            if(err){ 
                res.status(400).send('Department failed to update');
                 return console.log(err);}
        
            else{
                    res.status(200).send('Department updated Successfully');
                }

        })
})
.delete(
    async(req, res) =>{
        if(!isHR(req.body.member.id)){
            res.status(405).send("Error Invalid Credentials")
            return
        }
        DepartmentModel.findOneAndDelete({"id":req.params.id},(err,doc) => {
            if (err){
                res.status(400).send("Failed to Delete Department")
                return
            }
            else{
                console.log('Department Deleted Successfully');
                res.status(200).send('Department Deleted Successfully');
            }
        })
    }
)

// * Add update or delete a course

router.route("/opCourse/:id",auth)
.delete(async(req, res)=>{
    if(!isHR(req.body.member.id)){
        res.status(405).send("Error Invalid Credentials")
        return
    }
    CourseModel.findOneAndDelete({"id":req.params.id},(err,doc)=>{
        if(err) return console.log(err);
        console.log('Course Deleted Successfully');
        res.status(200).send('Course Deleted Successfully');  
    });
    })

.post(async(req, res)=>{
    if(!isHR(req.body.member.id)){
        res.status(405).send("Error Invalid Credentials")
        return
    }
CourseModel.findOneAndUpdate({"id":req.params.id},req.body,(err,doc) => {
    if(err){
        res.status(400).send("Couldn't Update Course");
    }
    else{
        res.status(200).send("Updated Course Successfully");
    }
})
});
// * AddCourse
router.route("/addCourse",auth)
.post(async(req, res)=>{
    if(!isHR(req.body.member.id)){
        res.status(405).send("Error Invalid Credentials")
        return
    }
    const id = await metaData.find({"sequenceName": 'co'})[0].lastId;
    if(id === undefined){
        id = 1;
    }
    id++;
   await metaData.updateOne({"sequenceName": 'co'},{'lastId' : id});

    const body = req.body
    const course = new CourseModel({
        "id":id,
        "name":body.name,
        "coordinator": req.body.coordinator,
        "TAs":body.TAs,
        "instructors":body.instructors,
        "numSlots": body.numSlots,
        "mainDepartment":body.mainDepartment,
        "teachingDepartments" : body.teachingDepartments
    }
    )
    course.save((err,doc) => {
        if(err){   
            res.status(400).send('Course Deleted Successfully');
            return console.log(err);}
        else
        { 
        console.log("Updated Successfully");
        res.status(200).send('Course updated Successfully');
        }
    
    })
})
//* Update / Delete Staff Members
router.route("/opStaffMemeber/:id",auth)
.post(async(req, res)=>{
    if(!isHR(req.body.member.id)){
        res.status(405).send("Error Invalid Credentials")
        return
    }

    MemberModel.findOneAndUpdate({"id":req.params.id},req.body, (err,doc)=>{
        if(err){
            res.status(400).send("Error Updating Staff Member");
            return ;
        }
        else{
            res.status(200).send("Staff Memebr Updated Successfully")
        }
    })

})

.delete(async(req, res)=>{
    MemberModel.findOneAndDelete({"id":req.params.id},(err,doc)=>{
        if(err){
            res.status(400).send("Error Deleteing Staff Member! It might Not Exist");
            return ;
        }
        else{
            res.status(200).send("Staff Memebr Deleted Successfully")
        }
    })
}
)

// * Add a New Staff Member 
router.route("/addMember",auth)
.post(async(req,res)=>{
    if(!isHR(req.body.member.id)){
        res.status(405).send("Error Invalid Credentials")
        return
    }
   // ! Unique Emails

   // ! Unique IDs

   //! Default 123456 Password

   //! NO Full office Locations & NO COURSE ASSIGNMENT

   
  
   const body  = req.body
   if(body.officeLoc != undefined){

    LocationModel.findOne({"id":officeLoc},body.officeLoc, (err,doc)=>{
        var newCapacity = 0;
        if(err){
            res.status(400).send("Room Doesnt exist")
            return ;
        }
        
        else{
            if (doc.capacity > 0 && doc.type == "office"){
                try {
                    newCapacity = doc.capacity -- ;

                    const id = await metaData.find({"sequenceName": 'ac'})[0].lastId;
                    if(id === undefined){
                        id = 1;
                    }
                    id++;
                   await metaData.updateOne({"sequenceName": 'ac'},{'lastId' : id});
                    
                    const StaffMember = new StaffMemberSchema({
                        "id":id,
                        "email":body.email,
                        "name":body.id,
                        "gender":body.gender,
                        "salary":body.salary,
                        "dayOff": body.dayOff,
                        "officeLoc": Stribody.officeLocng,
                        "leaves": body.leaves, // indicates the number of leaves the staff member has taken
                        "attendance":body.attendance,
                        "startDay":body.startDay,    // The day on which the Staff member started his job at the University
                        "loggedIn": body.loggedIn, // determines if this user is logged in or not (has a valid token)
                        "notifications" : [],
                        "firstLogin" : body.firstLogin,
                        "department" : body.department
                       })
                
                       StaffMember.save((err,doc)=>{
                           if(err){
                               res.status(400).send("Error in Adding The Member")
                           }
                           else{
                            LocationModel.updateOne({"id":officeLoc},{"capacity":newCapacity},(err,doc)=>{
                                if(err){
                                    res.status(400).send("Error in Adding The Member")
                                }
                                else{
                                    res.status(200).send("Successfully Added The Member")
                                   }
                           })
                            
                           }
                       })
                       
                       
                       
                   } catch (error) {
                       res.status(400).send("Error In Data Form, please check again")
                   } 
            }

        }
    })
   }
}) 

router.route("/addSignIn/:id",auth)
.post(async(req,res)=>{
    // body{
// signInDate: Date
  //  }
  if(!isHR(req.body.member.id)){
    res.status(405).send("Error Invalid Credentials")
    return
}

  if(req.body.member.id == req.params.id){
    res.status(405).send("Error Invalid Credentials")
    return
}

  MemberModel.findOne({"id":req.params.id},(err,doc)=>{
      if(err){
          res.status(400).send("Error Finidng the Member")
          return
      }
      else{
        doc.attendance.push({
            signIn: req.body.signIn,
            signOut: undefined
           })
           doc.attendance.sort((a,b)=>{
              return a.signIn < a.signIn
           });
           res.status(200).send("Added SignIn Record")
      }
  }) 
})

router.route("/addSignOut/:id",auth)
.post(async(req,res)=>{
    if(!isHR(req.body.member.id)){
        res.status(405).send("Error Invalid Credentials")
        return
    }

    if(req.body.member.id == req.params.id){
        res.status(405).send("Error Invalid Credentials")
        return
    }

    MemberModel.findOne({"id":req.params.id},(err,doc)=>{
        if(err){
            res.status(400).send("Error Finidng the Member")
            return
        }
        else{
          doc.attendance.push({
              signIn: undefined,
              signOut: req.body.signOut       
             });

             doc.attendance.sort((a,b)=>{
                return a.signIn < a.signIn
             });
             res.status(200).send("Added SignIn Record")
        }
    })

})

router.route("/addAttendance/:id",auth)
.post(async(req,res)=>{
    // body{
// signInDate: Date
//Singout: Date
  //  }
    if(!isHR(req.body.member.id)){
        res.status(405).send("Error Invalid Credentials")
        return
    }
 
    if(req.body.member.id == req.params.id){
        res.status(405).send("Error Invalid Credentials")
        return
    }
  MemberModel.findOne({"id":req.params.id},(err,doc)=>{
      if(err){
          res.status(400).send("Error Finidng the Member")
          return
      }
      else{
        doc.attendance.push({
            signIn: req.body.signIn,
            signOut: req.body.signOut
           })
           doc.attendance.sort((a,b)=>{
              return a.signIn < a.signIn
           });
           res.status(200).send("Added SignIn Record")
      }
  }) 
})

function isHR(ID) {
    if(ID.includes("hr")){
        return true;
    }
    return false;
}

module.exports = router;
