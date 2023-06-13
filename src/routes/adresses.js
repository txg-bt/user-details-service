const { pool } = require("../database/database");
const router = require("express").Router();
const { logger } = require("../utils/logger");
const authorization = require("../utils/authValidator");

router.get("/", authorization, async (req, res) => {
  const { user_id } = req;

  try {
    const result = await pool.query(
      "SELECT * FROM adresses WHERE user_id = $1",
      [user_id]
    );

    logger({
      route: "/adresses",
      statusCode: 200,
      message: "Adresses listed",
      userId: user_id,
    });

    return res.status(200).json(result.rows);
  } catch (err) {
    logger({
      route: "/adresses",
      statusCode: 500,
      message: "Internal server error",
      userId: user_id,
    });

    return res.status(500).send("Internal server error");
  }
});

router.post("/", authorization, async (req, res) => {
  const { user_id } = req;
  const { country, city, street, house_number } = req.body;

  // user_id uuid NOT NULL,
  // country varchar(255) NOT NULL,
  // city varchar(255) NOT NULL,
  // street varchar(255) NOT NULL,
  // house_number varchar(255) NOT NULL,

  try {
    await pool.query(
      "INSERT INTO adresses (user_id, country, city, street, house_number) VALUES ($1, $2, $3, $4, $5)",
      [user_id, country, city, street, house_number]
    );

    logger({
      route: "/adresses",
      statusCode: 201,
      message: "Adress created",
      userId: user_id,
    });

    return res.status(201).send("Adress created");
  } catch (err) {
    logger({
      route: "/adresses",
      statusCode: 500,
      message: "Internal server error",
      userId: user_id,
    });

    return res.status(500).send("Internal server error");
  }
});

router.put("/:id", authorization, async (req, res) => {
  const { user_id } = req;
  const { id } = req.params;
  const { country, city, street, house_number } = req.body;

  try {
    // default values
    const result = await pool.query(
      "SELECT * FROM adresses WHERE id = $1 AND user_id = $2",
      [id, user_id]
    );

    if (result.rows.length === 0) {
      logger({
        route: "/adresses",
        statusCode: 404,
        message: "Adress not found",
        userId: user_id,
      });

      return res.status(404).send("Adress not found");
    }

    const {
      country: countryDefault,
      city: cityDefault,
      street: streetDefault,
      house_number: house_numberDefault,
    } = result.rows[0];

    await pool.query(
      "UPDATE adresses SET country = $1, city = $2, street = $3, house_number = $4 WHERE id = $5 AND user_id = $6",
      [
        country || countryDefault,
        city || cityDefault,
        street || streetDefault,
        house_number || house_numberDefault,
        id,
        user_id,
      ]
    );

    logger({
      route: "/adresses",
      statusCode: 200,
      message: "Adress updated",
      userId: user_id,
    });

    return res.status(200).send("Adress updated");
  } catch (err) {
    logger({
      route: "/adresses",
      statusCode: 500,
      message: "Internal server error",
      userId: user_id,
    });

    return res.status(500).send("Internal server error");
  }
});

router.delete("/:id", authorization, async (req, res) => {
  const { user_id } = req;
  const { id } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM adresses WHERE id = $1 AND user_id = $2",
      [id, user_id]
    );

    if (result.rows.length === 0) {
      logger({
        route: "/adresses",
        statusCode: 404,
        message: "Adress not found",
        userId: user_id,
      });

      return res.status(404).send("Adress not found");
    }

    await pool.query("DELETE FROM adresses WHERE id = $1 AND user_id = $2", [
      id,
      user_id,
    ]);

    logger({
      route: "/adresses",
      statusCode: 200,
      message: "Adress deleted",
      userId: user_id,
    });

    return res.status(200).send("Adress deleted");
  } catch (err) {
    logger({
      route: "/adresses",
      statusCode: 500,
      message: "Internal server error",
      userId: user_id,
    });

    return res.status(500).send("Internal server error");
  }
});

module.exports = router;
