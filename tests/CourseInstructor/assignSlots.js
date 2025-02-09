const app = require('../../server/app.js').app;
const supertest = require('supertest');
const request = supertest(app);
const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');
const memberModel = require('../../server/models/StaffMember.js');
const courseModel = require('../../server/models/Course.js');
const slotModel = require('../../server/models/Slot.js');
const createCourse = require('./helper.js').createCourse;
const createSlot =  require('./helper.js').createSlot;
const createStaffMamber = require('./helper.js').createStaffMember;
beforeAll(()=>{
try {
    (async () => {await mongoose.connect(process.env.DB_URL_TEST, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })})();
}
catch(err) {
    console.log(err);
}});

beforeEach(async () => {
    await memberModel.deleteMany();
    await courseModel.deleteMany();
    await slotModel.deleteMany();
});
describe('Testing Assigning Slots route',()=>{
    it('A case where the member we are assigning doesn\'t exist in the database',
    async ()=>{
        const member2 =await createStaffMamber('Ashry19','ashry@yahoo.com','ashduia','Nermeen Ashry','male',7000,3,'C6.305',6,[],undefined,false,[],true,'dep1');

        const response = await request.post('/login').send({email : member2.email, password :'ashduia' });
        const token = response.headers.auth_token;
        const course1 = createCourse('course1','Advanced Computer Lab','Mervat22',['Hany5'],['Ashry19'],6,'dep1',['dep1','dep2']);
        const slot1 = createSlot('slot1',1,1,'C7.304','Lab','course1');
        await course1.save();
        await slot1.save();        

        const output =  await(await request.patch('/academic-members/Nermeen2/slots/slot1').set('auth_token',token).send({courseID:'course1'})).text;
        console.log(output);
        expect(output).toBe('The member you are trying to assign is not found!!');
    },10000)
    ,it('A case where the member trying to assign is not a course instructor',async ()=>{
        const member = await createStaffMamber('Nermeen2','huisadhashry@yahoo.com','ashduia','Nermeen Ashry','male',7000,3,'C6.305',6,[],undefined,false,[],true,'dep1');
        const member2 =await createStaffMamber('Ashry19','ashry@yahoo.com','ashduia','Nermeen Ashry','male',7000,3,'C6.305',6,[],undefined,false,[],true,'dep1');
        const response = await request.post('/login').send({email : member2.email, password :'ashduia' });
        const token = response.headers.auth_token;
        const course1 = createCourse('course1','Advanced Computer Lab','Mervat22',['Ayman2'],['Hany5'],6);
        const slot1 = createSlot('slot1',2,1,'C7.301','Lab','course1');
        await course1.save();
        await slot1.save();
        const output =  await(await request.patch('/academic-members/Nermeen2/slots/slot1').set('auth_token',token).send({courseId:"course1"})).text;
        expect(output).toBe('You are not allowed to assign a slot to an academic member!!');
    },10000)
    ,it('A case where the member is not assigned to the course',async ()=>{
        const member =await createStaffMamber('Nermeen2','bajskdbashry@yahoo.com','ashduia','Nermeen Ashry','male',7000,3,'C6.305',6,[],undefined,false,[],true,'dep1');
        const member2 =await createStaffMamber('Ashry19','ashry@yahoo.com','ashduia','Nermeen Ashry','male',7000,3,'C6.305',6,[],undefined,false,[],true,'dep1');

        const response = await request.post('/login').send({email : member2.email, password :'ashduia' });
        const token = response.headers.auth_token;

        const course1 = createCourse('course1','Advanced Computer Lab','Mervat22',['Ayman2'],['Ashry19'],6);
        const slot1 = createSlot('slot1',2,1,'C7.301','Lab','course1');
        await course1.save();
        await slot1.save();
        const output =  await(await request.patch('/academic-members/Nermeen2/slots/slot1').set('auth_token',token).send({courseId:"course1"})).text;
        expect(output).toBe('This academic member can\'t be assigned to this course');
    },10000),
    it('A case where the academic member is assigned to the slot',async ()=>{
        const member =await createStaffMamber('Nermeen2','bjkasdbjkashry@yahoo.com','ashduia','Nermeen Ashry','male',7000,3,'C6.305',6,[],undefined,false,[],true,'dep1');
        const member2 =await createStaffMamber('Ashry19','ashry@yahoo.com','ashduia','Nermeen Ashry','male',7000,3,'C6.305',6,[],undefined,false,[],true,'dep1');

        const response = await request.post('/login').send({email : member2.email, password :'ashduia' });
        const token = response.headers.auth_token;
        const course1 = createCourse('course1','Advanced Computer Lab','Mervat22',['Nermeen2'],['Ashry19'],6);
        const slot1 = createSlot('slot1',2,1,'C7.301','Lab','course1');
        await course1.save();
        await slot1.save();
        const output =  await(await request.patch('/academic-members/Nermeen2/slots/slot1').set('auth_token',token).send({courseId:"course1"})).text;
        expect(output).toBe('The Slot was modified correctly');
        expect((await slotModel.findOne({'id':'slot1'})).instructor).toBe('Nermeen2');
    },10000)
})