
import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

import incidentRecords from "../incidents_data.json";

/**
 * This function handles the HTTP request and returns the incidents information.
 *
 * @param {HttpRequest} req - The HTTP request.
 * @param {InvocationContext} context - The Azure Functions context object.
 * @returns {Promise<Response>} - A promise that resolves with the HTTP response containing the incident information.
 */
export async function incidents(
  req: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log("HTTP trigger function processed a request.");

  // Initialize response.
  const res: HttpResponseInit = {
    status: 200,
    jsonBody: {
      results: incidentRecords,
    },
  };

  // Get the assignedTo query parameter.
  const assignedTo = req.query.get("assignedTo");

  // If the assignedTo query parameter is not provided, return the response.
  if (!assignedTo) {
    console.log(`   ✅ GET /api/incidents: ${incidentRecords.length} incidents returned`);
    return res;
  }

  // Filter the incident information by the assignedTo query parameter.
  const incidents = incidentRecords.filter((item) => {
    const fullName = item.assignedTo.toLowerCase();
    const query = assignedTo.trim().toLowerCase();
    const [firstName, lastName] = fullName.split(" ");
    return fullName === query || firstName === query || lastName === query;
  });

  // Return filtered incident records, or an empty array if no records were found.
  res.jsonBody.results = incidents ?? [];
  console.log(`   ✅ GET /api/incidents/assignedTo: ${incidents.length} returned`);

  return res;
}

app.http("incidents", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "incidents/{*command}",
  handler: incidents,
});
