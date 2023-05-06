const Development = {
    ApiEndpoint: "http://localhost:8000",
    FrontendHost: "http://localhost",
};

const Production = {
    ApiEndpoint: "http://localhost:8000",
    FrontendHost: "http://localhost",
};

let exportedEnv: { ApiEndpoint: string; FrontendHost: string };

switch (process.env.REACT_APP_ENVIRONMENT) {
    case "DEV":
        exportedEnv = Development;
        break;
    case "PROD":
        exportedEnv = Production;
        break;
    default:
        exportedEnv = Development;
        break;
}

export default exportedEnv;
