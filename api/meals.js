// api/meals.js

import { readFile } from "node:fs/promises";

export default async (req, res) => {
  if (req.method === "GET") {
    try {
      const meals = await readFile("./data/available-meals.json", "utf8");
      res.json(JSON.parse(meals));
    } catch (error) {
      console.error("Error reading available meals file:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.status(404).json({ message: "Not found" });
  }
};
