
$(document).ready(function () {

    // Initialize Firebase

    var firebaseConfig = {
        apiKey: "AIzaSyDqUuhA2Iae6Pbon3oXanjPrqOqWwy8Nfs",
        authDomain: "my-project1-4ca85.firebaseapp.com",
        databaseURL: "https://my-project1-4ca85.firebaseio.com",
        projectId: "my-project1-4ca85",
        storageBucket: "my-project1-4ca85.appspot.com",
        messagingSenderId: "384934565142",
        appId: "1:384934565142:web:021f71f97241894686ac37",
        measurementId: "G-P6527RH1KT"
    };

    firebase.initializeApp(firebaseConfig);

    // Create a variable to reference the database

    var fireDatabase = firebase.database();

    //Defining Global Variables

    var inputTrainName;
    var inputDestination;
    var inputFirstTime;
    var inputFrequence;
    var inputActualTime;

    //Variables to be used by moment.js

    var nextArrival;
    var minutesAway;

    // three functions

    function estMinElapsed() {
        var convertedFirstTrainTime = moment(inputFirstTime, "HH:mm").subtract(1, "years");
        return moment().diff(moment(convertedFirstTrainTime), "minutes");
    }

    function estMinAway(minutesElapsed, inputFrequence) {
        return parseInt(inputFrequence) - parseInt(minutesElapsed) % parseInt(inputFrequence);
    }

    function estNextArrival(minutesAway) {
        return moment().add(minutesAway, "m").format("hh:mm A");
    }



    // Capture button click

    $("#submit").on("click", function (event) {

        // prevent form from trying to submit/refresh the page
        event.preventDefault();

        // input for each field and store into variable.
        inputTrainName = $("#trainName").val().trim();
        inputDestination = $("#destination").val().trim();
        inputFirstTime = $("#firstTrainTime").val().trim();
        inputFrequence = $("#frequency").val().trim();
        inputActualTime = new Date();

        //Estimate the amount of minutes elapsed since the first train's arrival
        var minutesSinceFirstTrane = estMinElapsed();
        console.log("Total minutes elapsed since the first train arrived: " + minutesSinceFirstTrane);

        // Estimate how many minutes away from the Next train
        minutesAway = estMinAway(minutesSinceFirstTrane, inputFrequence);
        console.log("The next train will be in: " + minutesAway + " minutes.");

        //Whenever current time matches next arrival time
        if (minutesAway === parseInt(inputFrequence)) {
            minutesAway = 0;
        }

        //Calculate the next arrival's time
        nextArrival = estNextArrival(minutesAway);
        console.log("The next train will be at: " + nextArrival);

        //Create a new local "temporary" object for holding train data
        var newTrain = {
            dataTrainName: inputTrainName,
            dataDestination: inputDestination,
            dataFirstTrainTime: inputFirstTime,
            dataFrequency: inputFrequence,
            dataTimeAdded: inputActualTime,
            dataNextArrival: nextArrival,
            dataMinutesAway: minutesAway
        };

        //Adding information to the Firebase database
        firebase.database().ref().push(newTrain);

    });

    // Firebase watcher + initial loader HINT: This code behaves similarly to .on("value")

    firebase.database().ref().on("child_added", function (childSnapshot) {

        //Store  that's coming out of snapshot
        var name = childSnapshot.val().dataTrainName;
        var dest = childSnapshot.val().dataDestination;
        var freq = childSnapshot.val().dataFrequency;
        var first = childSnapshot.val().dataFirstTrainTime;
        var now = childSnapshot.val().dataTimeAdded;
        var next = childSnapshot.val().dataNextArrival;
        var away = childSnapshot.val().dataMinutesAway;

        //new variable that create the new row
        var newRow = $("<tr><td>" + name + "</td><td>" + dest + "</td><td>" + freq + "</td><td>" + next + "</td><td>" + away + "</td></tr>");

        // add new row to table
        $("table tbody").append(newRow);

    });

}); 