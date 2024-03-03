// Ensure that you have initialized the database with the database.sql file

const SERVER_URL = "http://localhost:4000";

// Get the nearest washrooms to a given location (latitude, longitude) within a set radius
test("GET /nearbywashrooms - radius test", async () => {
    const latitude = 43.772901;
    const longitude = -79.254044;
    const expectedResponse = [
        {
            washroomid: 1,
            washroomname: "Mock Washroom 1",
            longitude: "-79.255925",
            latitude: "43.773509",
            address1: "123 Mock Street",
            address2: null,
            city: "Scarborough",
            province: "ON",
            postalcode: "M0C 0K1",
            distance: 165,
        },
        {
            washroomid: 3,
            washroomname: "Mock Washroom 3",
            longitude: "-79.257084",
            latitude: "43.772374",
            address1: "789 Mock Hallway",
            address2: null,
            city: "Scarborough",
            province: "ON",
            postalcode: "M0D 0K3",
            distance: 251,
        },
        {
            washroomid: 2,
            washroomname: "Mock Washroom 2",
            longitude: "-79.258508",
            latitude: "43.777109",
            address1: "456 Mock Drive",
            address2: null,
            city: "Scarborough",
            province: "ON",
            postalcode: "M0C 0K2",
            distance: 589,
        },
        {
            washroomid: 4,
            washroomname: "Mock Washroom 4",
            longitude: "-79.260508",
            latitude: "43.780709",
            address1: "101 Mock Avenue",
            address2: null,
            city: "Scarborough",
            province: "ON",
            postalcode: "M0E 0K4",
            distance: 1011,
        },
        {
            washroomid: 5,
            washroomname: "Mock Washroom 5",
            longitude: "-79.264308",
            latitude: "43.794309",
            address1: "202 Mock Lane",
            address2: null,
            city: "Scarborough",
            province: "ON",
            postalcode: "M0F 0K5",
            distance: 2519,
        },
    ];

    const response = await fetch(`${SERVER_URL}/nearbywashrooms?latitude=${latitude}&longitude=${longitude}`);
    const responseData = await response.json();

    expect(response.status).toBe(200);
    expect(responseData).toEqual(expectedResponse);
});
