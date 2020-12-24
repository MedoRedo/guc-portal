const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const express = require('express');
const memberModel = require('../models/StaffMember');
const requestModel = require('../models/Request');
const {authentication} = require('./middleware');
const superagent = require('superagent');
const StaffMember = require('../models/StaffMember');
const Joi = require('joi');
const router = express.Router();
const day_ms = 86400000; // number of milliseconds in a day


// function which checks for valid year
function isYearValid(year) {
    return /^\d{4}$/.test(year);
}

// function which checks for valid month
function isMonthValid(month) {
    return /^(0[0-9]|1[0-1])$/.test(day);
}

function isValidStaffId(id) {
    return new RegExp('ac-[1-9]\d*').test(id);
}

router.get('/attendance/:year/:month/:staffId', [authentication], (req, res)=>{

    const {year, month, staffId} = req.params;
    if(!isYearValid(year))
        return res.send('this is not a valid year');
    if(!isMonthValid(month))
        return res.send('this is not a valid month');
    if(!isValidStaffId(staffId))
        return res.send('this is not a valid staffmember');
    const{attendance} = StaffMember.findOne({id: staffId});
    year = Number(year);
    month = Number(month);
    let result = [];
    const curDate = Date.now(), curYear = curDate.getFullYear(), curMonth = curDate.getMonth(), curDay = curDate.getDate();
    if(year === curYear && month === curMonth) {
        if(curDay >= 11) {
            const start = new Date(year, month, 11).getTime(), end = new Date(year, month, curDay).getTime() + day_ms - 1;
            result = attendance.filter((elem) => {
                const signIntime = elem.signIn === undefined ? -1 : elem.signIn.getTime();
                const signOutTime = elem.signOut === undefined ? -1 : elem.signOut.getTime();
                return (signIntime >= start && signIntime <= end) || (signOutTime >= start && signOutTime <= end); 
            });
        }
    }
    else if(year <= curYear && month <= curMonth) {
        const nextYear = month == 11 ? year + 1 : year;
        const nextMonth = month == 11 ? 0 : month + 1;
        const tenthDayNextMonth = new Date(nextYear, nextMonth, 10);
        let start = new Date(year, month, 11).getTime(), end;
        if(curDate.getTime() >= tenthDayNextMonth.getTime())
            end = tenthDayNextMonth.getTime() + day_ms - 1;
        else
            end = new Date(curYear, curMonth, curDay).getTime() + day_ms - 1;
        result = attendance.filter((elem) => {
            const signIntime = elem.signIn === undefined ? -1 : elem.signIn.getTime();
            const signOutTime = elem.signOut === undefined ? -1 : elem.signOut.getTime();
            return (signIntime >= start && signIntime <= end) || (signOutTime >= start && signOutTime <= end); 
        });
    }
    res.send(result);
})

async function getAttendanceRecords(token, id) {
    const curDate = Date.now(), curYear = curDate.getFullYear(), curMonth = curDate.getMonth(), curDay = curDate.getDate();
    let year, month;
    if(curDay >= 11) {
        year = curYear;
        month = curMonth;
    }
    else {
        year = curMonth == 0 ? curYear - 1 : curYear;
        month = curMonth == 0 ? 11 : curMonth - 1;
    }
    const records = await superagent.get(`httP://localhost:3000/${year}/${month}/${id}`).set('auth_token', token);
    return {
        records,
        startYear : year,
        startMonth : month
    };
}

// function for determining if the attendance record is valid or not
function isValidRecord(record) {
    let ans = true;
    const{signIn, signOut} = record;
    if(signIn == undefined || signOut == undefined)
        ans = false;
    const year = signIn.getFullYear(), month = signIn.getMonth(), day = signIn.getDate();
    const min = new Date(year, month, day, 7).getTime(), max = new Date(year, month, day, 19).getTime();
    if(signIn.getTime() > max || signOut.getTime() < min)
        ans = false;
    return ans;
}

// function for determining the number of days passed in the current month (GUC month)
function numOfDays(startYear, startMonth) {
    const curDate = Date.now(), curDay = curDate.getDate();
    let numDays;
    if(curDay >= 11)
        numDays = curDay - 11 + 1;
    else {
        const numDaysStartMonth = new Date(startYear, startMonth, 0).getDate();
        numDays = curDay + numDaysStartMonth - 11 + 1;
    }
    return numDays;
}

// function which creates an object of days given first day and the number of days
function createDays(firstDay, numDays) {
    let days = {};
    for(let i = 0; i < numDays; i++)
        days[String(firstDay + i * day_ms)] = true;
    return days;
}

router.get('/missingDays/:staffId', [authentication], async(req, res)=>{
    const {dayoff, id} = await StaffMember.findOne({id: req.params.staffId});
    const {records, startYear, startMonth} = await getAttendanceRecords(req.headers.auth_token, id);
    const numDays = numOfDays(startYear, startMonth);
    const firstDay = new Date(startYear, startMonth, 11).getTime();
    const days = createDays(firstDay, numDays);
    for(let i = 0; i < records.length; i++) {
        if(!isValidRecord(records[i]))
            continue;
        const year = records[i].signIn.getFullYear(), month = records[i].signIn.getMonth(), day = records[i].signIn.getDate();
        days[String(new Date(year, month, day).getTime())] = false;
    }
    const requests = await requestModel.find({sender : id, status : 'accepted'}).or([
        {type : 'annual'}, {type : 'accidental'}, {type : 'sick'}, {type : 'maternity'}
    ]);
    for(let i = 0; i < numDays; i++) {
        let date = new Date(firstDay + i * day_ms);
        if(date.getDay() == 5 || date.getDay() == dayoff)
            days[String(date.getTime())] = false;
        else {
            let acceptedRequests = requests.filter((elem) => {
                let low = elem.startDate.getTime();
                let offset = elem.duration == undefined ? 1 : elem.duration;
                let high = low + offset * day_ms;
                return date.getTime() >= low && date.getTime() < high;
            })
            if(acceptedRequests.length > 0)
                days[String(date.getTime())] = false;
        }
    }
    let result = [];
    for(let i = 0 ; i < numDays; i++) {
        let date = new Date(firstDay + i * day_ms);
        if(days[String(date.getTime())] == true)
            result[result.length] = date;
    }
    res.send(result);  
})

router.put('updateSalary', [authentication], async(req, res)=>{
    const schema = Joi.object({
        newSalary: Joi.number().required(),
        staffId: Joi.string().min(4).pattern(new RegExp('ac-[1-9]\d*'))
    })
    
    const{error, value} = schema.validate(req.body);
    if(!error){
        try{
            await StaffMember.findOneAndUpdate({id: value.id}, {salary: newSalary});
            res.status(200).send('Salary updated successfully');    
        }catch(e){
            res.status(404).send(e);
        }
    }else{
        res.status(403).send('invalid data');
    }
})