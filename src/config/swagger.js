const swaggerJsdoc = require("swagger-jsdoc");
const packageInfo = require("../../package.json");

// Swagger definition
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Hệ thống Quản lý Điểm Thưởng",
      version: packageInfo.version || "1.0.0",
      description: "Tài liệu API cho hệ thống quản lý điểm thưởng",
      contact: {
        name: "Admin",
        email: "admin@example.com",
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
    },
    servers: [
      {
        url: "/api",
        description: "API Server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      responses: {
        UnauthorizedError: {
          description: "Yêu cầu xác thực để truy cập",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: false,
                  },
                  message: {
                    type: "string",
                    example: "Không có quyền truy cập",
                  },
                },
              },
            },
          },
        },
        ServerError: {
          description: "Lỗi máy chủ",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: false,
                  },
                  message: {
                    type: "string",
                    example: "Lỗi máy chủ nội bộ",
                  },
                },
              },
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.js", "./src/models/*.js"], // Đường dẫn đến các file chứa API documentation
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

module.exports = swaggerSpec;
