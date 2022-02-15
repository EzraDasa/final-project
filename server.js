console.log("app is loading");
import express from "express";
import dotenv from "dotenv";
dotenv.config();
import path from "path";
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);

import { 
  registration,
  login,
  add_a_ride,
  addUserRide,
  getHitchhiking, 
  deleteRide, 
  deleteRideFromUsers,
  updateUserDetails,
  addHitchhiker,
  userHitchhiking,
  deleteHitchhiker,
  getUser,
  sendMessage
 } from './utils';

const __dirname = path.dirname(__filename);

const app = express();



// used for json inside body
app.use(express.json());

app.get("/userHitchhiking/:id",(req, res) => {
  userHitchhiking(req, res)
});

app.post("/sendMessage/:id",(req, res) => {
  sendMessage(req, res)
});

app.get("/chat/:id",(req, res) => {
  getUser(req, res)
});

app.post("/registration", (req, res) => {
  registration(req, res);
});

app.post("/login", (req, res) => {
  login(req, res)
});

app.post("/addDrive", (req, res) => {
  add_a_ride(req,res);
});

app.post("/hitchhiking", (req, res) => {
  getHitchhiking(req, res)
});

app.patch("/updateUserDetails/:id", (req, res) => {
  updateUserDetails(req,res)
});

app.patch(`/addUserDrive/:id`, (req, res) => {
  addUserRide(req,res)
});

app.delete(`/deleteRide/:id`, (req, res) => {
  deleteRide(req,res)
});

app.patch(`/deleteRideUser/:id`, (req, res) => {
  deleteRideFromUsers(req,res)
});
app.post(`/addHitchhiker/:id`, (req, res) => {
  addHitchhiker(req,res)
});
app.patch(`/deleteHitchhiker/:id`, (req, res) => {
  deleteHitchhiker(req,res)
});

app.use(express.static(path.join(__dirname, "catch_a_ride", "build")));
app.get("*", (req, resp) => {
  resp.sendFile(path.join(__dirname, "catch_a_ride", "build", "index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});