const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio"); // Cheerio con require, sin destructurar
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3001;

// Usa cors middleware
app.use(cors());

app.get("/scrape-eurodreams", async (req, res) => {
  try {
    const { data } = await axios.get(
      "https://sorteoseurodreams.com/resultados/"
    );
    const $ = cheerio.load(data);
    const resultados = [];

    // Adaptación de los selectores para extraer la fecha y los números ganadores
    $(".lastResults__card").each((i, el) => {
      const date = $(el)
        .find(".lastResults__textBlock__text--date")
        .text()
        .trim();

      const numbers = $(el)
        .find(".lastResults__textBlock__text--result ul:first-of-type li")
        .map((i, el) => $(el).text().trim())
        .get();

      const extraNumber = $(el).find(".lastNumbers.numdrms li").text().trim();

      resultados.push({ date, numbers, extraNumber });
    });

    res.json(resultados);
  } catch (error) {
    console.error("Error al obtener los datos: ", error);
    res.status(500).send("Error al obtener los datos");
  }
});

app.listen(PORT, () => {
  console.log(`Servidor de scraping corriendo en http://localhost:${PORT}`);
});
