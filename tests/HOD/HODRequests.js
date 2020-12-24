const app = require('../../server/app.js').app;
const supertest = require('supertest');
const request = supertest(app);
const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');
const memberModel = require('../../server/models/StaffMember.js');
const CourseModel = require('../../server/models/Course.js');
const departmentModel = require('../../server/models/Department.js');
const bcrypt = require('bcrypt');


try {
    (async () => {await mongoose.connect(process.env.DB_URL_TEST, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })})();
}
catch(err) {
    console.log(err);
}

beforeEach(async () => {
    await memberModel.deleteMany();
    await CourseModel.deleteMany();
    await departmentModel.deleteMany();
    await createCourse(course, 'analysis');
    await createDepartment();
    await createStaffMembers();
});


// afterAll(async()=>{
//     await memberModel.deleteMany();
//     await CourseModel.deleteMany();
//     await departmentModel.deleteMany();
// })

async function createCourse(courseId, courseName){
    const courseA = new CourseModel({
        id: courseId,
        name: courseName,
        mainDepartment : 'd-1',
    });
    
    await courseA.save();
}
var course = 'CSEN 703';

async function createDepartment(){
    const department = new departmentModel({
        id: 'd-1',
        name: 'Computer Science',
        HOD: 'ac-1'
    })

    await department.save();
}

async function createStaffMembers(){
    let staff = [];
    for(let i=2;i<10;i+=2){
        const curDate = new Date(), curYear = curDate.getFullYear(), curMonth = curDate.getMonth(), curDay = curDate.getDate();
        attendance = [];
        for(let i = 11; i < curDay - 2; i++)
            attendance[attendance.length] = {signIn : new Date(curYear, curMonth, i, 8), signOut : new Date(curYear, curMonth, i, 10)};
 
        const memberA = new memberModel({
            id: 'ac-'+i,
            email: 'ac-'+i+'@guc.edu.eg',
            name: 'ac-'+i,
            department: 'd-1',
            dayOff: i%7,
            attendance: attendance
        });
        staff.push(memberA);
        await memberA.save();
    }
    return staff;
}

async function createHR() {
    const hr = new memberModel({
        id: 'hr-1',
        email: 'moreda@guc.edu.eg',
        password: 'kcsckcsk',
        name: 'Mahmoud Reda',
        dayOff: 6,
        loggedIn: false
    })
    const plainTextPassword = hr.password;
    const salt = await bcrypt.genSalt();
    const hashedPass = await bcrypt.hash(hr.password, salt);
    hr.password = hashedPass;

    await hr.save();
    return {
        hr,
        plainTextPassword
    };
}

describe('testing view staff with missing days/hours', ()=>{
    test('testing view staff with missing days', async()=>{
        const{hr, plainTextPassword}= await createHR();
        const response = await request.post('/login').send({email : hr.email, password : plainTextPassword});
        const token = response.headers.auth_token;
        const res = await request.get('/HR/StaffMembersWithMissingDays').set('auth_token', token);
        console.log(res.body);
        expect(200);
    })
})