import { JsonObject } from 'swagger-ui-express';

export const swaggerDocument: JsonObject = {
  openapi: '3.0.0',
  info: {
    title: 'API de Películas, Directores y Categorías',
    version: '1.0.0',
    description:
      'API REST con Express, Prisma y MySQL con operaciones CRUD completas para las tablas Películas, Directores y Categorías.',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Servidor Local',
    },
  ],
  tags: [
    { name: 'Películas', description: 'CRUD de la tabla Películas' },
    { name: 'Directores', description: 'CRUD de la tabla Directores' },
    { name: 'Categorías', description: 'CRUD de la tabla Categorías' },
  ],
  paths: {
    '/api/peliculas': {
      get: {
        tags: ['Películas'],
        summary: 'Listar todas las películas',
        description: 'Obtiene el listado de películas con filtros opcionales.',
        parameters: [
          {
            name: 'categoria',
            in: 'query',
            description: 'Filtrar por IDCategoria',
            required: false,
            schema: { type: 'integer' },
          },
          {
            name: 'director',
            in: 'query',
            description: 'Filtrar por IDDirector',
            required: false,
            schema: { type: 'integer' },
          },
          {
            name: 'search',
            in: 'query',
            description: 'Buscar por título',
            required: false,
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': {
            description: 'Lista de películas obtenida con éxito',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    count: { type: 'integer', example: 1 },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/PeliculaResponse' },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Películas'],
        summary: 'Crear una nueva película',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/PeliculaInput' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Película creada exitosamente',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Película creada exitosamente' },
                    data: { $ref: '#/components/schemas/PeliculaResponse' },
                  },
                },
              },
            },
          },
          '400': { $ref: '#/components/responses/ValidationError' },
          '404': { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/api/peliculas/{id}': {
      get: {
        tags: ['Películas'],
        summary: 'Obtener detalle de una película por Identificador',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Identificador de la película',
            schema: { type: 'integer' },
          },
        ],
        responses: {
          '200': {
            description: 'Película encontrada',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/PeliculaResponse' },
                  },
                },
              },
            },
          },
          '404': { $ref: '#/components/responses/NotFound' },
        },
      },
      put: {
        tags: ['Películas'],
        summary: 'Actualizar una película',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Identificador de la película',
            schema: { type: 'integer' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  Titulo: { type: 'string' },
                  IDDirector: { type: 'integer' },
                  Duracion: { type: 'integer' },
                  IDCategoria: { type: 'integer' },
                  Sinopsis: { type: 'string' },
                  ImagenUrl: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Película actualizada correctamente' },
          '404': { $ref: '#/components/responses/NotFound' },
        },
      },
      delete: {
        tags: ['Películas'],
        summary: 'Eliminar una película',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Identificador de la película',
            schema: { type: 'integer' },
          },
        ],
        responses: {
          '200': { description: 'Película eliminada correctamente' },
          '404': { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/api/directores': {
      get: {
        tags: ['Directores'],
        summary: 'Listar todos los directores',
        responses: {
          '200': {
            description: 'Lista de directores obtenida con éxito',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    count: { type: 'integer', example: 5 },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/DirectorResponse' },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Directores'],
        summary: 'Crear un nuevo director',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/DirectorInput' },
            },
          },
        },
        responses: {
          '201': { description: 'Director creado exitosamente' },
          '400': { $ref: '#/components/responses/ValidationError' },
        },
      },
    },
    '/api/directores/{id}': {
      get: {
        tags: ['Directores'],
        summary: 'Obtener detalle de un director por IDDirector',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'IDDirector',
            schema: { type: 'integer' },
          },
        ],
        responses: {
          '200': { description: 'Director encontrado con sus películas' },
          '404': { $ref: '#/components/responses/NotFound' },
        },
      },
      put: {
        tags: ['Directores'],
        summary: 'Actualizar un director',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'IDDirector',
            schema: { type: 'integer' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/DirectorInput' },
            },
          },
        },
        responses: {
          '200': { description: 'Director actualizado exitosamente' },
        },
      },
      delete: {
        tags: ['Directores'],
        summary: 'Eliminar un director',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'IDDirector',
            schema: { type: 'integer' },
          },
        ],
        responses: {
          '200': { description: 'Director eliminado exitosamente' },
        },
      },
    },
    '/api/categorias': {
      get: {
        tags: ['Categorías'],
        summary: 'Listar todas las categorías',
        responses: {
          '200': {
            description: 'Lista de categorías obtenida con éxito',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    count: { type: 'integer', example: 5 },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/CategoriaResponse' },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Categorías'],
        summary: 'Crear una nueva categoría',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CategoriaInput' },
            },
          },
        },
        responses: {
          '201': { description: 'Categoría creada exitosamente' },
          '400': { $ref: '#/components/responses/ValidationError' },
        },
      },
    },
    '/api/categorias/{id}': {
      get: {
        tags: ['Categorías'],
        summary: 'Obtener detalle de una categoría por Identificador',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Identificador de la categoría',
            schema: { type: 'integer' },
          },
        ],
        responses: {
          '200': { description: 'Categoría encontrada con sus películas' },
          '404': { $ref: '#/components/responses/NotFound' },
        },
      },
      put: {
        tags: ['Categorías'],
        summary: 'Actualizar una categoría',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Identificador de la categoría',
            schema: { type: 'integer' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CategoriaInput' },
            },
          },
        },
        responses: {
          '200': { description: 'Categoría actualizada exitosamente' },
        },
      },
      delete: {
        tags: ['Categorías'],
        summary: 'Eliminar una categoría',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Identificador de la categoría',
            schema: { type: 'integer' },
          },
        ],
        responses: {
          '200': { description: 'Categoría eliminada exitosamente' },
        },
      },
    },
  },
  components: {
    schemas: {
      PeliculaInput: {
        type: 'object',
        required: ['Titulo', 'IDDirector', 'Duracion', 'IDCategoria', 'Sinopsis'],
        properties: {
          Titulo: { type: 'string', example: 'Interstellar' },
          IDDirector: { type: 'integer', example: 1 },
          Duracion: { type: 'integer', description: 'Duración en minutos', example: 169 },
          IDCategoria: { type: 'integer', example: 1 },
          Sinopsis: {
            type: 'string',
            example: 'Un grupo de exploradores viaja a través de un agujero de gusano.',
          },
          ImagenUrl: {
            type: 'string',
            example: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800',
          },
        },
      },
      PeliculaResponse: {
        type: 'object',
        properties: {
          Identificador: { type: 'integer', example: 1 },
          Titulo: { type: 'string', example: 'Interstellar' },
          IDDirector: { type: 'integer', example: 1 },
          Director: { type: 'string', example: 'Christopher Nolan' },
          Duracion: { type: 'integer', example: 169 },
          DuracionFormateada: { type: 'string', example: '2h 49m' },
          IDCategoria: { type: 'integer', example: 1 },
          Categoria: { type: 'string', example: 'Ciencia Ficción' },
          Sinopsis: { type: 'string', example: 'Un grupo de exploradores...' },
          ImagenUrl: { type: 'string', example: 'https://images.unsplash.com/...' },
        },
      },
      DirectorInput: {
        type: 'object',
        required: ['Director'],
        properties: {
          Director: { type: 'string', example: 'Christopher Nolan' },
        },
      },
      DirectorResponse: {
        type: 'object',
        properties: {
          IDDirector: { type: 'integer', example: 1 },
          Director: { type: 'string', example: 'Christopher Nolan' },
          totalPeliculas: { type: 'integer', example: 2 },
        },
      },
      CategoriaInput: {
        type: 'object',
        required: ['Categoria'],
        properties: {
          Categoria: { type: 'string', example: 'Ciencia Ficción' },
        },
      },
      CategoriaResponse: {
        type: 'object',
        properties: {
          Identificador: { type: 'integer', example: 1 },
          Categoria: { type: 'string', example: 'Ciencia Ficción' },
          totalPeliculas: { type: 'integer', example: 3 },
        },
      },
    },
    responses: {
      NotFound: {
        description: 'Recurso no encontrado',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                success: { type: 'boolean', example: false },
                message: { type: 'string', example: 'El registro solicitado no fue encontrado' },
              },
            },
          },
        },
      },
      ValidationError: {
        description: 'Error en la validación de los datos enviados',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                success: { type: 'boolean', example: false },
                message: { type: 'string', example: 'Error de validación en los datos enviados' },
                errors: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      campo: { type: 'string', example: 'Titulo' },
                      mensaje: { type: 'string', example: 'El título es obligatorio' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};
