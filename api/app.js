import { readFile, writeFile } from "node:fs/promises";
import bodyParser from "body-parser";
import express from "express";

const app = express();

app.use(bodyParser.json());
app.use(express.static("public"));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.get("/", (req, res) => {
  res.send("Hey this is my API running 🥳");
});

app.get("/meals", async (req, res) => {
  const meals = await readFile("./data/available-meals.json", "utf8");
  res.json(JSON.parse(meals));
});

app.post("/orders", async (req, res) => {
  const orderData = req.body.order;

  if (
    orderData === null ||
    orderData.items === null ||
    orderData.items.length === 0
  ) {
    return res.status(400).json({ message: "Missing data." });
  }

  const requiredFields = ["email", "name", "street", "postal-code", "city"];

  const missingFields = requiredFields.filter(
    (field) => !orderData.customer[field]
  );

  if (missingFields.length > 0) {
    return res.status(400).json({
      message: `Missing data: ${missingFields.join(", ")} is required.`,
    });
  }

  const newOrder = {
    ...orderData,
    id: (Math.random() * 1000).toString(),
  };

  try {
    const orders = await readFile("./data/orders.json", "utf8");
    const allOrders = JSON.parse(orders);
    allOrders.push(newOrder);

    await writeFile("./data/orders.json", JSON.stringify(allOrders));

    res.status(201).json({ message: "Order created!", order: newOrder });
  } catch (error) {
    console.error("Error writing to orders file:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.use((req, res) => {
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  res.status(404).json({ message: "Not found" });
});

// app.listen(3000);

export default app;
