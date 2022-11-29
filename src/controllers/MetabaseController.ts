import { Request, Response } from "express";

export const getMetabaseData = async (request: Request, response: Response) => {
  var jwt = require("jsonwebtoken");

  // var METABASE_SITE_URL = "http://localhost:3000";
  // var METABASE_SECRET_KEY =
  //   "8a2c251afb81549d040c3bb1f830aadd25b60b5a6d7d5f8b7cc8d83166e9e2fe";

  var payload = {
    resource: { dashboard: 1 },
    params: {},
    exp: Math.round(Date.now() / 1000) + 10 * 60, // 10 minute expiration
  };
  var token = jwt.sign(payload, process.env.METABASE_SECRET_KEY);

  var iframeUrl =
    process.env.METABASE_SITE_URL +
    "/embed/dashboard/" +
    token +
    "#bordered=false&titled=false";

  return response.json(iframeUrl);
};
