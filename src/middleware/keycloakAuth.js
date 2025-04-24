// Thêm dotenv để đọc file .env
require("dotenv").config();

const jwt = require("jsonwebtoken");
const jwkToPem = require("jwk-to-pem");

const keycloakConfig = {
  baseUrl: process.env.KEYCLOAK_BASE_URL || "http://localhost:8080/auth",
  realm: process.env.KEYCLOAK_REALM || "master",
  clientId: process.env.KEYCLOAK_CLIENT_ID || "nodejs-app",
  clientSecret: process.env.KEYCLOAK_CLIENT_SECRET || "",
};
// Cấu hình Keycloak - cần được cung cấp thông qua môi trường hoặc file cấu hình
class KeycloakAuth {
  constructor() {
    this.publicKey = null;
    this.fetchPublicKey();
  }

  async fetchPublicKey() {
    try {
      const url = `${keycloakConfig.baseUrl}/realms/${keycloakConfig.realm}/protocol/openid-connect/certs`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch public key: ${response.statusText}`);
      }

      const data = await response.json();
      const key = data.keys.find((k) => k.alg === "RS256");

      if (!key) {
        throw new Error("No RS256 key found in JWKS");
      }

      // Convert JWK to PEM format
      this.publicKey = jwkToPem(key);
    } catch (error) {
      console.error(`Failed to fetch public key: ${error.message}`);
    }
  }

  extractTokenFromHeader(req) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return undefined;

    const [type, token] = authHeader.split(" ");
    return type === "Bearer" ? token : undefined;
  }

  async validateToken(token) {
    try {
      if (!this.publicKey) {
        await this.fetchPublicKey();
        if (!this.publicKey) {
          throw new Error("Public key not available");
        }
      }
      // console.log("this.publicKey", this.publicKey);
      // Verify token using public key
      const decoded = jwt.verify(token, this.publicKey, {
        algorithms: ["RS256"], // Keycloak uses RS256 by default
        issuer: `${keycloakConfig.baseUrl}/realms/${keycloakConfig.realm}`,
      });
      // console.log("decoded", decoded);

      return !!decoded;
    } catch (error) {
      console.error(`Token verification failed: ${error.message}`);
      return false;
    }
  }

  // Middleware function cho Express
  middleware() {
    return async (req, res, next) => {
      try {
        const token = req.token;

        if (!token) {
          return res.status(401).json({ message: "Access token not found" });
        }

        console.log({ token });

        const isValid = await this.validateToken(token);
        // console.log("isValid", isValid);
        if (!isValid) {
          return res.status(401).json({ message: "Invalid token" });
        }

        // Token hợp lệ, tiếp tục xử lý request
        next();
      } catch (error) {
        console.error(`Token validation failed: ${error.message}`);
        return res.status(401).json({ message: "Invalid token" });
      }
    };
  }
}

module.exports = new KeycloakAuth();
