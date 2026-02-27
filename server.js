// Import the required modules
const express = require("express");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

// Create an instance of an Express application
const app = express();

// Define the port the server will listen on
const PORT = 3004;

// Middleware to parse incoming JSON requests
app.use(express.json());

// TODO:  Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Define the path to the JSON file
const dataFilePath = path.join(__dirname, "data.json");

// Function to read data from the JSON file
const readData = () => {
  if (!fs.existsSync(dataFilePath)) {
    return [];
  }
  const data = fs.readFileSync(dataFilePath);
  return JSON.parse(data);
};

// Function to write data to the JSON file
const writeData = (data) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};

// TODO: Handle GET request at the root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.htm"));
});

// Handle GET request to retrieve stored data
app.get("/data", (req, res) => {
  const data = readData();
  res.json(data);
});

// Backward-compatible API route for older client URLs
app.get("/public/data", (req, res) => {
  const data = readData();
  res.json(data);
});

// Handle POST request to save new data with a unique ID
app.post("/data", (req, res) => {
  const newData = { id: uuidv4(), ...req.body };
  const currentData = readData();
  currentData.push(newData);
  writeData(currentData);
  res.json({ message: "Data saved successfully", data: newData });
});

// Backward-compatible API route for older client URLs
app.post("/public/data", (req, res) => {
  const newData = { id: uuidv4(), ...req.body };
  const currentData = readData();
  currentData.push(newData);
  writeData(currentData);
  res.json({ message: "Data saved successfully", data: newData });
});


//Put request
app.put("/data/put/:id", (req, res) => {
  const data = readData();
  const item = data.find((item) => item.id === req.params.id);

  if (!item) {
    return res.status(404).json({ message: "Data not found" });
  }

  if (typeof req.body.text !== "string" || req.body.text.trim() === "") {
    return res.status(400).json({ message: "Text is required" });
  }

  item.text = req.body.text.trim();
  writeData(data);

  res.json({
    message: "Data updated",
    data: item,
  });
});

//delete

app.delete("/data/delete/:id", (req, res) => {
  const data = readData();
  const item = data.find((item) => item.id === req.params.id);
  const index = data.findIndex((item) => item.id === req.params.id);
  
  if (!item) 
    {
    return res.status(404).json({ message: "Data not found" });
  }

  //item
 
  const deletedItem = data[index];
  //  
 data.splice(index, 1);
 writeData(data);
  // currentData.splice(newData);

  // writeData(currentData);
  //res.json({ message: "Data to save", data: newData , oldData: currentData});
  res.json({
    message: "Data deleted",
    data: item,
  });

  // item.message = req.body.welcome  + " " + item.welcome;
 // res.json({ received: req.body.welcome });
 // res.json({ id: item.id, message: item.message});
});

// Handle POST request at the /echo route
app.post("/echo", (req, res) => {
  // Respond with the same data that was received in the request body
  res.json({ received: req.body });
});

// Wildcard route to handle undefined routes
app.all("*", (req, res) => {
  res.status(404).send("Route not found");
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
