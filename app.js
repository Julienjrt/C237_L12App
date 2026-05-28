// Import required modules
const express = require('express');

// Create an Express application
const app = express();

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Middleware to parse request bodies
app.use(express.urlencoded({ extended: true }));

// Declare any necessary variables or in-memory data structures here
let trains = [

        {
            id: 1,
            name: 'North South Line',
            departure: '10:00 AM',
            arrival: '10:30 AM',
            platform: '1',
            status: 'On Time',
            price:   '2.50'
        },
        {   
            id: 2,
            name: 'East West Line',
            departure: '10:15 AM',
            arrival: '10:45 AM',
            platform: '2',
            status: 'Delayed',
            price:   '3.00'
        },
        {
            id: 3,
            name: 'Circle Line',
            departure: '10:20 AM',
            arrival: '10:50 AM',
            platform: '3',
            status: 'On Time',
            price:   '5.00'
        },
        {
            id: 4,
            name: 'Downtown Line',
            departure: '10:30 AM',
            arrival: '11:00 AM',
            platform: '4',
            status: 'On Time',
            price:   '6.00'
        }
    ];

  let bookings = [];

// TASK: Define appropriate routes below
// ---------------------------------------------------

//Define a route to render the index page
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/trainviewtiming', (req, res) => {
    res.render('trainviewtiming', { trains });
});


app.get("/viewtraintickets", (req, res) => {
    res.render("viewtraintickets", { trains });
});


app.post("/buyticket", (req, res) => {
    const id = req.body.id;

    const train = trains.find(t => t.id == id);

    if (!train) {
        return res.send("Ticket not found");
    }

    res.render("buyticket", { train });
});


app.post("/confirmbuy", (req, res) => {
    let { id, quantity } = req.body;

    id = Number(id);
    quantity = Number(quantity);

    let train = trains.find(t => t.id === id);

    if (!train) {
        return res.send("Train not found!");
    }

    let total = Number(train.price) * quantity;

    // create booking (IMPORTANT for editing later)
    let booking = {
        bookingId: Date.now(), // simple unique id
        trainId: train.id,
        train,                // 👈 still keep train object
        quantity,
        total
    };

    bookings.push(booking);

    res.render("confirmbuy", {
        train,      // still usable in EJS
        booking     // for future editing system
    });
});
// add ticket page//
app.get("/addticket", (req, res) => {
    res.render("addticket");
});


app.post("/addticket", (req, res) => {
    let { name, departure, arrival, platform, status, price } = req.body;

    // create new train object
    let newTrain = {
        id: trains.length + 1,
        name,
        departure,
        arrival,
        platform,
        status,
        price: Number(price)
    };

    // add into array
    trains.push(newTrain);

    // go back to train list
    res.redirect("/viewtraintickets");
});


app.get("/edit/:id", (req, res) => {
    let train = trains.find(t => t.id == req.params.id);

    if (!train) {
        return res.send("Train not found!");
    }

    res.render("edit", { train });
});

app.post("/edit/:id", (req, res) => {
    let { name, departure, arrival, platform, status, price } = req.body;

    let train = trains.find(t => t.id == req.params.id);

    if (!train) {
        return res.send("Train not found!");
    }

    // update values
    train.name = name;
    train.departure = departure;
    train.arrival = arrival;
    train.platform = platform;
    train.status = status;
    train.price = Number(price);

    res.redirect("/viewtraintickets");
});


app.get("/delete/:id", (req, res) => {
    let train = trains.find(t => t.id == req.params.id);

    if (!train) {
        return res.send("Train not found!");
    }

    train.status = "Deleted";

    res.redirect("/viewtraintickets");
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});