const express = require("express");
const User = require("../models/User");
const Area = require("../models/Area");
const Slot = require("../models/Slot");
const Review = require("../models/Review");
const Device = require("../models/Device");
const fetchuser = require('../middleware/fetchuser');
const router = express.Router();
const { body, validationResult } = require("express-validator");
// const bcrypt = require("bcryptjs");
// var jwt = require("jsonwebtoken");
// var fetchuser = require("../middleware/fetchuser")

router.get("/getareas", async (req, res)=>{
    // No login is required
    const allAreas = await Area.find();
    res.json(allAreas);
})

router.post("/getslots", async(req, res)=>{
    // No login is required
    // only id of area will be given
    
    const areaID = req.body.areaID;
    const allSlots = await Slot.find({whichArea: areaID});
    res.json(allSlots);
})

router.post("/auth/bookslot",fetchuser, async(req, res)=>{
    // login and authentication is required
    const userID = req.user.id;
    const slotNum = req.body.slotnumber;
    const areaID = req.body.areaID;
    const selectedArea = await Area.findOne({_id: areaID});
    const slotToBeBooked = await Slot.findOne({whichArea: areaID, number: slotNum});
    const loggedInUser = await User.findOne({_id: userID});
    console.log("Logged in user: ", loggedInUser);
    // const currDate = Date.
    // console.log(selectedArea);
    // console.log(slotToBeBooked);
    if(slotToBeBooked.isBooked==true){
        return res.json({success: false, messase: "Slot is already booked, kindly pick another slot.."})
    }
    // Check if this user has already booked 2 slots
    // One user can only book atmost 2 slots
    let count = 0;
    const allSlots = await Slot.find({whichArea: areaID});
    // console.log("allSlots: ", allSlots);
    for (let index = 0; index < allSlots.length; index++) {
        const slot = allSlots[index];
        if(String(slot.user)===String(userID)){
            count++;
        }
    }
    if(count>=2){
        return res.json({success:false, msg: "Cannot book more than 2 slots"})
    }
    try {
        const areaaa = await Area.findOneAndUpdate({_id: areaID}, {totalBookedSlots: selectedArea.totalBookedSlots+1}, {new: true})
        const slotToBeBooked1 = await Slot.findOneAndUpdate({whichArea: areaID, number: slotNum}, {isBooked: true, user: userID, date: Date.now()}, {new: true});
        return res.json({success: true, msg: "Slot is booked successfully"});
        
    } catch (error) {
        res.json(error);
    }
})

// Login and authentication is required
router.post("/auth/addarea",fetchuser, [
    body("name", "Name of the area must be atleast 4 characters long").isLength({min:3}),
    body("address", "Address of the area must be atleast 10 characters long").isLength({min: 10}),
    body("totalslots", "Enter valid number of slots").isNumeric({min: 2})
], async (req, res)=>{
    // Only admin has the privilege to add the area 
    const userID = req.user.id;
    const loggedInUser = await User.findOne({_id: userID});
    // console.log("here1", loggedInUser);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
        if(loggedInUser.role==="user"){
            res.status(401).send({ error: "Access denied, please login with correct credentials" })
        }
        else{
            // Check whether the area with this name exists already
            let area = await Area.findOne({ name: req.body.name });
            if (area) {
                return res
                .status(400)
                .json({ error: "Sorry an area with this name already exists" });
            }
            const newArea = await Area.create({
                name: req.body.name,
                address: req.body.address,
                totalSlots: req.body.totalslots,
                totalBookedSlots: 0
            })
    
            const totalSlots = Number(req.body.totalslots);
            let temp = 1;
            let veggies = Math.floor(totalSlots*50/100);
            let fruits = Math.floor(totalSlots*30/100);
            let grains = Math.floor(totalSlots*20/100);
            for (let i = 0; i < veggies; i++) {
                let slot1 = await Slot.create({
                    number: temp++,
                    whichArea: newArea._id,
                    type: "vegitable"
                })
            }
            for (let i = 0; i < fruits; i++) {
                let slot1 = await Slot.create({
                    number: temp++,
                    whichArea: newArea._id,
                    type: "fruit"
                })
            }
            for (let i = 0; i < grains; i++) {
                let slot1 = await Slot.create({
                    number: temp++,
                    whichArea: newArea._id,
                    type: "grain"
                })
            }

            res.json(newArea);

        }
    } catch (error) {
        console.error("error name: ", error.message);
      res.status(500).send("Internal Server Error");
    }

})


//  IMPLEMENT HOW MUCH IS THE AVERAGE RATING OF A PARTICULAR AREA 


// Login is required
router.post("/auth/review", fetchuser,[
    body("rating", "Rating should be in range of 1 to 5").isNumeric({max: 5}),
    body("review", "Review of the area should be atleast 4 characters long").isLength({min: 4})
], async (req, res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
        const areaID = req.body.areaid;
        const userID = req.user.id;
        const foundArea = await Area.findOne({_id: areaID});

            if(req.body.rating<1 || req.body.rating>5){
                res.status(400).json({message: "Rating should be between 1 and 5"})
            }
            else{

                // change the average rating of this found area
                let totalratings = foundArea.totalReviews;
                if(totalratings==null){
                    totalratings = 0;
                }
                let currAvgRating = foundArea.avgRating;
                if(currAvgRating==null){
                    currAvgRating = 0;
                }
                // IMPLEMENT-- IF SAME USER GIVE RATING TO SAME AREA again THAN ONLY UPDATE THE REVIEW
                // Implementing above
                // const oldReview = Review.findOne({whichArea: areaID, user: userID});
                // if(oldReview!==null){
                //     console.log(oldReview);
                //     console.log("This user has already reviewed the area");
                // }


                let newAvgRating = (currAvgRating*totalratings + req.body.rating)/(totalratings+1);
                newAvgRating = Math.round(newAvgRating * 10) / 10
                // console.log("new avg rating for this area is: ", newAvgRating);
                const foundAreaForUpdate = await Area.findOneAndUpdate({_id: areaID}, {avgRating: newAvgRating, totalReviews: totalratings+1}, {new: true, runValidators: true, setDefaultsOnInsert: true});
                // console.log("new area", foundAreaForUpdate);

                const userName = await User.findOne({_id: userID});

                const newReview = await Review.create({
                    rating: req.body.rating,
                    review: req.body.review,
                    user: userID,
                    whicharea: areaID,
                    userName: userName.name
                })
                res.json(newReview);
            }
        // }
    } catch (error) {
        // console.log(error);
        console.error("error name: ", error.message);
        res.status(500).send("Internal Server Error");
    }
})

router.post("/getreviews", async(req, res)=>{
    // Login is not required
    const areaID = req.body.areaid;
    // const userID = req.user.id;

    const allReviews = await Review.find({whicharea: areaID});
    res.json(allReviews);
})

// DELETING AREA WITH ITS SLOTS
router.delete("/auth/removearea",fetchuser, async(req, res)=>{
    const areaID = req.body.areaID;
    const userID = req.user.id;
    const loggedInUser = await User.findOne({_id: userID});
    // console.log("here1", loggedInUser);
    if(loggedInUser.role==="user"){
        res.status(401).send({ error: "Access denied, please login with correct credentials" })
    }
    else{
        await Slot.deleteMany({whichArea: areaID});
        await Area.deleteOne({_id: areaID})
        res.json({success: true, msg: "Area and its slots area deleted successfully"})
    }

})

// Edit user profile
router.post("/auth/editprofile", fetchuser, async (req, res)=>{
    const userID = req.user.id;
    const updatedUser = await User.findOneAndUpdate({_id: userID}, {name: req.body.name, email: req.body.email, phone: req.body.phone}, {new:true}) ;
    res.json({success: true, msg:"User updated successfully", updatedUser});
})


// Delete a user
router.delete("/auth/deleteuser", fetchuser, async(req, res)=>{
    const userID = req.body.userID;
    const loggedInUser = await User.findOne({_id: req.user.id});

    if(loggedInUser.role==="user"){
        res.status(401).send({ error: "Access denied, please login with correct credentials" })
    }
    else{
        await User.deleteOne({_id: userID});
        res.json({success: true, msg: "User deleted successfully"})
    }
})

// Make user admin
router.post("/auth/makeadmin",fetchuser, async(req, res)=>{
    // login and authentication is required
    const userID = req.body.userID;
    const loggedInUser = await User.findOne({_id: req.user.id});

    const userr = await User.findOne({_id: userID});

    if(loggedInUser.role==="user"){
        res.status(401).send({ error: "Access denied, please login with correct credentials" })
    }
    else{
        let makeuseradmin;
        if(userr.role==='user'){
            makeuseradmin = await User.findOneAndUpdate({_id: userID}, {role: "admin"}, {new: true});
        }
        else{
            makeuseradmin = await User.findOneAndUpdate({_id: userID}, {role: "user"}, {new: true});
        }
        res.json(makeuseradmin)
    }
})

router.get("/auth/emptyslots",  fetchuser, async(req, res)=>{
    // login and authentication is required
    const userID = req.body.userID;
    const loggedInUser = await User.findOne({_id: req.user.id});
    if(loggedInUser.role==="user"){
        return res.status(401).send({ error: "Access denied, please login with correct credentials" })
    }

    await Slot.updateMany({}, {isBooked: false, user: null})
    await Area.updateMany({}, {totalBookedSlots: 0});
    res.json({success: true, msg: "All slots are deallocated successfully"});
    
})

router.get("/auth/getrevenue", fetchuser, async (req, res)=>{
    const userID = req.user.id;
    const loggedInUser = await User.findOne({_id: userID});
    // console.log("here1", loggedInUser);
    if(loggedInUser.role==="user"){
        return res.status(401).send({ error: "Access denied" })
    }
    let revenue = 0;
    let pricePerSlot = 10;
    const areas = await Area.find();
    console.log("area:", areas);
    areas.forEach((area)=>{
        revenue += (area.totalBookedSlots*pricePerSlot);
    })
    console.log("revenue is", revenue);
    res.json(revenue);
})


//------------------------------- FOR ADMIN ---------------------------
router.get("/auth/admin", fetchuser, async (req, res)=>{
    // Only admin can access this route
    const userID = req.user.id;
    const loggedInUser = await User.findOne({_id: userID});
    // console.log("here1", loggedInUser);
    if(loggedInUser.role==="user"){
        res.status(401).send({ error: "Access denied, please login with correct credentials" })
    }
    else{
        const allUsers = await User.find();
        const allAreas = await Area.find();
        res.json({allUsers, allAreas});
    }
})

// SMART DUSTBIN ROUTES
router.get("/device/:data", async(req, res)=>{
    console.log(req.params.data);
    const time = new Date();

    // Time for heroku
    let total_seconds = time.getHours()*3600 + time.getMinutes()*60 + time.getSeconds();
    total_seconds += 1900000;

    let t = new Date(Date.UTC(2022, 0, 1)); // Epoch
    t.setUTCSeconds(total_seconds);
    t = t.toLocaleString();
    t = t.substr(9);

    const distance = req.params.data;
    const d = parseInt(distance, 10);
    let filled2 = false;
    if(d<=12){
        filled2 = true;
    }
    // const t = time.getHours()+":"+time.getMinutes()+":"+time.getSeconds();
    console.log("time is: ", t);
    const newResponse = await Device.findOneAndUpdate({_id: "6301f56b0a2c0ea8622d06ff"}, {time: t, filled: filled2, msg: distance}, {new:true})
    
    res.json({success: true, newResponse});

    // const data = req.body;

    // // data is in the form:
    // //   data = {dustbinID: "", filled: true/false}

    // // Find maximum number of any dustbin
    // const allBins = await Device.find();
    // let maxx = 0;
    // for (let index = 0; index < allBins.length; index++) {
    //     const element = allBins[index];
    //     maxx = Math.max(maxx, element.number);
    // }

    // const findBin = await Device.findOne({binID: data.dustbinID});
    // // console.log("findBin: ", findBin);
    // const time = new Date();
    // const t = time.getHours()+":"+time.getMinutes()+":"+time.getSeconds();
    // if(!findBin){
    //     const newBin = await Device.create({
    //         number: (maxx+1),
    //         filled: data.filled,
    //         binID: data.dustbinID,
    //         time: t,
    //     })
    //     return res.json({success: true, msg: "New bin created: ", newBin});
    // }
    // const updatedBin = await Device.findOneAndUpdate({binID: data.dustbinID}, {filled: data.filled, time: t}, {new:true});
    // res.json({success: true, msg:"Bin updated successfully: ", updatedBin});
})

router.get('/getdevices', async(req, res)=>{
    const allDevices = await Device.findOne();
    res.json({success: true, allDevices});
})

module.exports = router;
