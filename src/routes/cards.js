const { pool } = require("../database/database");
const router = require("express").Router();
const { logger } = require("../utils/logger");
const authorization = require("../utils/authValidator");

router.get("/", authorization, async (req, res) => {
  const { user_id } = req;

  try {
    const result = await pool.query("SELECT * FROM cards WHERE user_id = $1", [
      user_id,
    ]);

    logger({
      route: "/cards",
      statusCode: 200,
      message: "Cards listed",
      userId: user_id,
    });

    // filter the result to remove the cvv from the response
    const filteredResult = result.rows.map((card) => {
      const { cvv, ...rest } = card;

      return rest;
    });

    return res.status(200).json(filteredResult);
  } catch (err) {
    logger({
      route: "/cards",
      statusCode: 500,
      message: "Internal server error",
      userId: user_id,
    });

    return res.status(500).send("Internal server error");
  }
});

router.post("/", authorization, async (req, res) => {
  const { user_id } = req;
  const { card_number, cvv, card_holder, expiration_date } = req.body;

  try {
    await pool.query(
      "INSERT INTO cards (user_id, card_number, cvv, card_holder, expiration_date) VALUES ($1, $2, $3, $4, $5)",
      [user_id, card_number, cvv, card_holder, expiration_date]
    );

    logger({
      route: "/cards",
      statusCode: 201,
      message: "Card created",
      userId: user_id,
    });

    return res.status(201).send("Card created");
  } catch (err) {
    logger({
      route: "/cards",
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
    await pool.query("DELETE FROM cards WHERE id = $1 AND user_id = $2", [
      id,
      user_id,
    ]);

    logger({
      route: "/cards",
      statusCode: 200,
      message: "Card deleted",
      userId: user_id,
    });

    return res.status(200).send("Card deleted");
  } catch (err) {
    logger({
      route: "/cards",
      statusCode: 500,
      message: "Internal server error",
      userId: user_id,
    });

    return res.status(500).send("Internal server error");
  }
});

module.exports = router;