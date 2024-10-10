
import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import IncidentsApiService from "../services/snow_incidents";
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
  
  // Initialize response.
  const res: HttpResponseInit = {
    status: 200,
    jsonBody: {
      results: [],
    },
  };

  try {
      // Get input parameters.
      //const assignedTo = req.query.get("assignedTo");

      console.log(`➡️ GET /api/incidents: `);

      // Fetch the latest incidents from the ServiceNow API.
      const incidents = await IncidentsApiService.getIncidents();
      res.jsonBody.results = incidents ?? [];
      console.log(`   ✅ GET /api/incidents: response status ${res.status}; ${incidents.length} incidents returned`);
      return res;

  }
  catch (error) {
    console.error(`   ❌ GET /api/incidents: ${error}`);
    res.status = 500;
    res.jsonBody = { error: error.message };
    return res;
  }

}

app.http("incidents", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "incidents/{*command}",
  handler: incidents,
});
