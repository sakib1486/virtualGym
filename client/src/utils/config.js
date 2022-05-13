// productionAddress and clientId should be moved to environment file (.env)

// productionAddress - will make the API calls from your production server
export const productionAddress =
  "http://[2605:fd00:4:1001:f816:3eff:fe53:946f]";

// devaddress - will make the API calls from your local server
export const devAddress = "http://localhost:8000";

// Change this variable 'address' to change where the API calls within the frontend components are made to either productionAddress or devAddress
export const address = devAddress;

export const clientId =
  "852077641439-ghu49h1v79ce6b16sbj1le65fquv1tp6.apps.googleusercontent.com";
