const { pool } = require("../database/database");
const router = require("express").Router();
const { logger } = require("../utils/logger");
const authorization = require("../utils/authValidator");

router.get("/:user_id", async (req, res) => {
  const { user_id } = req.params;

  try {
    const result = await pool.query("SELECT * FROM users WHERE user_id = $1", [
      user_id,
    ]);

    logger({
      route: "/userDetails",
      statusCode: 200,
      message: "User details listed",
      userId: user_id,
    });

    return res.status(200).json(result.rows);
  } catch (err) {
    logger({
      route: "/userDetails",
      statusCode: 500,
      message: "Internal server error",
      userId: user_id,
    });

    return res.status(500).send("Internal server error");
  }
});

router.post("/", authorization, async (req, res) => {
  const { user_id } = req;
  const { first_name, last_name, email, phone_number, username } = req.body;

  try {
    await pool.query(
      "INSERT INTO users (user_id, first_name, last_name, email, phone_number, username) VALUES ($1, $2, $3, $4, $5, $6)",
      [user_id, first_name, last_name, email, phone_number, username]
    );

    logger({
      route: "/userDetails",
      statusCode: 201,
      message: "User created",
      userId: user_id,
    });

    return res.status(201).send("User created");
  } catch (err) {
    logger({
      route: "/userDetails",
      statusCode: 500,
      message: "Internal server error",
      userId: user_id,
    });

    return res.status(500).send("Internal server error");
  }
});

router.put("/:user_id", authorization, async (req, res) => {
  const { user_id } = req.params;
  const { user_id: user_id_from_token } = req;
  const { first_name, last_name, email, phone_number, username } = req.body;

  if (user_id !== user_id_from_token) {
    logger({
      route: "/userDetails",
      statusCode: 401,
      message: "Unauthorized",
      userId: user_id,
    });

    return res.status(401).send("Unauthorized");
  }

  try {
    // default values
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE user_id = $1",
      [user_id]
    );

    if (existingUser.rows.length === 0) {
      logger({
        route: "/userDetails",
        statusCode: 404,
        message: "User not found",
        userId: user_id,
      });

      return res.status(404).send("User not found");
    }

    const {
      first_name: first_nameDefault,
      last_name: last_nameDefault,
      email: emailDefault,
      phone_number: phone_numberDefault,
      username: usernameDefault,
    } = existingUser.rows[0];

    await pool.query(
      "UPDATE users SET first_name = $1, last_name = $2, email = $3, phone_number = $4, username = $5 WHERE user_id = $6",
      [
        first_name || first_nameDefault,
        last_name || last_nameDefault,
        email || emailDefault,
        phone_number || phone_numberDefault,
        username || usernameDefault,
        user_id,
      ]
    );

    logger({
      route: "/userDetails",
      statusCode: 200,
      message: "User details updated",
      userId: user_id,
    });

    return res.status(200).send("User details updated");
  } catch (err) {
    logger({
      route: "/userDetails",
      statusCode: 500,
      message: "Internal server error",
      userId: user_id,
    });

    return res.status(500).send("Internal server error");
  }
});

router.delete("/:user_id", authorization, async (req, res) => {
  const { user_id } = req.params;

  try {
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE user_id = $1",
      [user_id]
    );

    if (existingUser.rows.length === 0) {
      logger({
        route: "/userDetails",
        statusCode: 404,
        message: "User not found",
        userId: user_id,
      });

      return res.status(404).send("User not found");
    }

    await pool.query("DELETE FROM users WHERE user_id = $1", [user_id]);

    logger({
      route: "/userDetails",
      statusCode: 200,
      message: "User deleted",
      userId: user_id,
    });

    return res.status(200).send("User deleted");
  } catch (err) {
    logger({
      route: "/userDetails",
      statusCode: 500,
      message: "Internal server error",
      userId: user_id,
    });

    return res.status(500).send("Internal server error");
  }
});

module.exports = router;
