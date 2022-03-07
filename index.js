const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const config = require("./config");
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//functoin for checking data is not null
function isSet(obj) {
  if (
    obj &&
    obj != "null" &&
    obj != undefined &&
    obj !== "" &&
    obj != "[]" &&
    obj != [] &&
    obj != {} &&
    obj !== "" &&
    obj != "undefined"
  ) {
    if (typeof obj != "undefined") {
      return true;
    }
  }
}

app.post("/api/add-event", async (req, res) => {
  var { event_name, duration, start_time } = req.body;

  //validation for event_name, start_time language and duration
  if (!isSet(event_name)) {
    return res.json({
      status: 400,
      success: false,
      message: "Event Name is Missing",
    });
  }

  if (!isSet(start_time)) {
    return res.json({
      status: 400,
      success: false,
      message: "Event Starting Time is Missing",
    });
  }

  if (!isSet(duration)) {
    return res.json({
      status: 400,
      success: false,
      message: "Event Duration is Missing",
    });
  }
  MongoClient.connect(config.db_url, async function (err, db) {
    try {
      if (err) {
        console.log(err);
        return res.json({
          status: 500,
          success: false,
          message: err.message,
        });
      } else {
        console.log("Mongo connected");
        let dbase = db.db(config.database);
        let collection = dbase.collection(config.collection);
        await collection.insertOne({
          event_name: event_name,
          start_time: new Date(start_time),
          duration: duration,
        });
        console.log(`Record inserted!`);
        db.close();
        return res.json({
          status: 200,
          success: true,
          message: "Event Created Successfully",
        });
      }
    } catch (err) {
      db.close();
      console.log("Response sent to the client");
      return res.json({ status: 500, success: false, message: err.message });
    }
  });
});

app.get("/api/get-events", async (req, res) => {
  MongoClient.connect(config.db_url, async function (err, db) {
    try {
      if (err) {
        console.log(err);
        console.log("Response sent to the client");
        return res.json({
          status: 500,
          success: false,
          message: err.message,
        });
      } else {
        console.log("Mongo connected");
        let dbase = db.db(config.database);
        let collection = dbase.collection(config.collection);

        let now = new Date();

        let next = new Date(now.getTime() + 600000);
        next.setMinutes(next.getMinutes() - next.getTimezoneOffset());
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());

        let liveEvents = await collection
          .find({
            $and: [
              { start_time: { $gt: now } },
              { start_time: { $lte: next } },
            ],
          })
          .toArray();

        let upComingEvent = await collection
          .find({
            start_time: { $gt: next },
          })
          .toArray();

        db.close();
        return res.json({
          status: 200,
          success: true,
          data: { upComingEvent: upComingEvent, liveEvents: liveEvents },
        });
      }
    } catch (err) {
      db.close();
      console.log("Response sent to the client");
      return res.json({ status: 500, success: false, message: err.message });
    }
  });
});

app.listen(3000, async () => {
  console.log("Server successfully started on port 3000");
});
