// Ensure that you have initialized the database with the database.sql file

const SERVER_URL = "http://localhost:4000";

// Get the nearest washrooms to a given location (latitude, longitude) within a set radius
test("GET /nearbywashrooms - radius test", async () => {
    const latitude = 43.772901;
    const longitude = -79.254044;
    const expectedResponse = [
        {
            "washroomid": 6,
            "washroomname": "Basic Washroom",
            "longitude": "-79.25403390014448",
            "latitude": "43.774044700506856",
            "address1": "202 Some Lane",
            "address2": null,
            "city": "Scarborough",
            "province": "ON",
            "postalcode": "M0A 4R5",
            "distance": 127,
            "email": "mock@business.com",
            "sponsorship": 0
        },
        {
            "washroomid": 1,
            "washroomname": "Bronze Washroom",
            "longitude": "-79.255925",
            "latitude": "43.773509",
            "address1": "123 Mock Street",
            "address2": null,
            "city": "Scarborough",
            "province": "ON",
            "postalcode": "M0C 0K1",
            "distance": 165,
            "email": "bronze@business.com",
            "sponsorship": 1
        },
        {
            "washroomid": 4,
            "washroomname": "Public Washroom 4",
            "longitude": "-79.25275149516722",
            "latitude": "43.77147621079455",
            "address1": "101 Mock Avenue",
            "address2": null,
            "city": "Scarborough",
            "province": "ON",
            "postalcode": "M0E 0K4",
            "distance": 189,
            "email": null,
            "sponsorship": 0
        },
        {
            "washroomid": 5,
            "washroomname": "Ruby Washroom",
            "longitude": "-79.25100578778502",
            "latitude": "43.77270892981182",
            "address1": "202 Mock Lane",
            "address2": null,
            "city": "Scarborough",
            "province": "ON",
            "postalcode": "M0F 0K5",
            "distance": 245,
            "email": "ruby@business.com",
            "sponsorship": 4
        },
        {
            "washroomid": 3,
            "washroomname": "Gold Washroom",
            "longitude": "-79.25136341839746",
            "latitude": "43.77406336459605",
            "address1": "789 Mock Hallway",
            "address2": null,
            "city": "Scarborough",
            "province": "ON",
            "postalcode": "M0D 0K3",
            "distance": 251,
            "email": "gold@business.com",
            "sponsorship": 3
        },
        {
            "washroomid": 2,
            "washroomname": "Silver Washroom",
            "longitude": "-79.258508",
            "latitude": "43.777109",
            "address1": "456 Mock Drive",
            "address2": null,
            "city": "Scarborough",
            "province": "ON",
            "postalcode": "M0C 0K2",
            "distance": 589,
            "email": "silver@business.com",
            "sponsorship": 2
        }
    ];

    const response = await fetch(`${SERVER_URL}/nearbywashrooms?latitude=${latitude}&longitude=${longitude}`);
    const responseData = await response.json();

    expect(response.status).toBe(200);
    expect(responseData).toEqual(expectedResponse);
});
