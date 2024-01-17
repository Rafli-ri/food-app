// api/orders.js

import { readFile, writeFile } from "node:fs/promises";

export default async (req, res) => {
  if (req.method === "POST") {
    const orderData = req.body.order;

    if (!orderData || !orderData.items || orderData.items.length === 0) {
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
  } else {
    res.status(404).json({ message: "Not found" });
  }
};
