const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(cors());

const PROJECTS_DIR = "C:\\Repositories\\bdsol\\bo"; //ruta de donde se ubican los proyectos

app.get("/projects", (req, res) => {
  const projects = fs
    .readdirSync(PROJECTS_DIR)
    .filter((dir) =>
      fs.existsSync(path.join(PROJECTS_DIR, dir, "config", "microfronts.js"))
    );

  const result = projects.map((project) => {
    const microfrontPath = path.join(
      PROJECTS_DIR,
      project,
      "config",
      "microfronts.js"
    );
    const config = require(microfrontPath);
    const permissions = new Set();

    config.permissionsByAPIs?.forEach((item) => {
      if (item.permission) permissions.add(item.permission);
    });

    if (config.permissionOfModule) {
      permissions.add(config.permissionOfModule);
    }

    return {
      name: project,
      permissions: [...permissions],
    };
  });

  res.json(result);
});

app.listen(4000, () => {
  console.log("Backend corriendo en http://localhost:4000");
});
