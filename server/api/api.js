export default async function api(app) {
  app.get("/", (req, res) => {
    console.log("home");
  });
}
