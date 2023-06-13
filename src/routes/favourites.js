const { pool } = require("../database/database");
const router = require("express").Router();
const { logger } = require("../utils/logger");
const authorization = require("../utils/authValidator");

// get all favourites for a list of product_ids for a user

router.get("/", authorization, async (req, res) => {
  const { user_id } = req;

  try {
    const result = await pool.query(
      "SELECT * FROM favourites WHERE user_id = $1",
      [user_id]
    );

    logger({
      route: "/favourites",
      statusCode: 200,
      message: "Favourites listed",
      userId: user_id,
    });

    return res.status(200).json(result.rows);
  } catch (err) {
    logger({
      route: "/favourites",
      statusCode: 500,
      message: "Internal server error",
      userId: user_id,
    });

    return res.status(500).send("Internal server error");
  }
});

router.post("/products", authorization, async (req, res) => {
  const { user_id } = req;
  const { product_ids } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM favourites WHERE user_id = $1 AND product_id IN ($2)",
      [user_id, product_ids]
    );

    logger({
      route: "/favourites",
      statusCode: 200,
      message: "Favourites listed",
      userId: user_id,
    });

    const favourites = {};
    product_ids.forEach((productId) => {
      favourites[productId] = false;
    });

    result.rows.forEach((row) => {
      favourites[row.product_id] = true;
    });

    return res.status(200).json(favourites);
  } catch (err) {
    logger({
      route: "/favourites",
      statusCode: 500,
      message: "Internal server error",
      userId: user_id,
    });

    return res.status(500).send("Internal server error");
  }
});

router.put("/:product_id", authorization, async (req, res) => {
  const { user_id } = req;
  const { product_id } = req.params;

  try {
    // check if the product is already in favourites

    const result = await pool.query(
      "SELECT * FROM favourites WHERE user_id = $1 AND product_id = $2",
      [user_id, product_id]
    );

    if (result.rows.length > 0) {
      // remove the product from favourites

      await pool.query(
        "DELETE FROM favourites WHERE user_id = $1 AND product_id = $2",
        [user_id, product_id]
      );
    }

    await pool.query(
      "INSERT INTO favourites (user_id, product_id) VALUES ($1, $2)",
      [user_id, product_id]
    );

    logger({
      route: "/favourites",
      statusCode: 201,
      message: "Favourite created",
      userId: user_id,
    });

    return res.status(201).send("Favourite created");
  } catch (err) {
    logger({
      route: "/favourites",
      statusCode: 500,
      message: "Internal server error",
      userId: user_id,
    });

    return res.status(500).send("Internal server error");
  }
});

module.exports = router;
