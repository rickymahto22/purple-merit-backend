import express from 'express';
import { createServer } from 'http';
import dotenv from 'dotenv';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';

// Import Configs
import { connectDB } from './config/db';
import { initSockets } from './sockets/socketService';

// Import Routes
import authRoutes from './routes/authRoutes';
import jobRoutes from './routes/jobRoutes';
import projectRoutes from './routes/projectRoutes';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// --- SWAGGER CONFIGURATION (INLINE) ---
const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Purple Merit Backend Assessment',
    version: '1.0.0',
    description: 'Real-time collaborative workspace backend with Async Job Processing.'
  },
  servers: [{ url: `http://localhost:${PORT}` }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  },
  security: [{ bearerAuth: [] }],
  paths: {
    '/api/auth/register': {
      post: {
        summary: 'Register a new user',
        tags: ['Auth'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string' },
                  password: { type: 'string' },
                  role: { type: 'string', enum: ['owner', 'collaborator', 'viewer'] }
                }
              }
            }
          }
        },
        responses: { '201': { description: 'User created' } }
      }
    },
    '/api/auth/login': {
      post: {
        summary: 'Login user',
        tags: ['Auth'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string' },
                  password: { type: 'string' }
                }
              }
            }
          }
        },
        responses: { '200': { description: 'Login successful' } }
      }
    },
    '/api/projects': {
      post: {
        summary: 'Create a Project',
        tags: ['Projects'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  description: { type: 'string' }
                }
              }
            }
          }
        },
        responses: { '201': { description: 'Project created' } }
      }
    },
    '/api/jobs/execute': {
      post: {
        summary: 'Execute code (Async Job)',
        tags: ['Jobs'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  language: { type: 'string' },
                  code: { type: 'string' }
                }
              }
            }
          }
        },
        responses: { '202': { description: 'Job Queued' } }
      }
    }
  }
};

// Serve Swagger Docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Register Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/projects', projectRoutes);

const startServer = async () => {
  try {
    await connectDB();
    initSockets(httpServer);
    console.log('✅ Sockets initialized');

    httpServer.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📄 Documentation available at http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
};

startServer();