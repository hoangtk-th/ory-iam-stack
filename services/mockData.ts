import { AppConfig, FileNode, RelationTuple, User } from '../types';

export const APPS: AppConfig[] = [
  {
    id: 'gpass',
    name: 'GPass',
    description: 'General consumer access portal',
    domain: 'gpass.any',
    themeColor: 'blue',
    redirectUrl: 'https://gpass.any/dashboard'
  },
  {
    id: 'propass',
    name: 'ProPass',
    description: 'Enterprise professional suite',
    domain: 'propass.any',
    themeColor: 'emerald',
    redirectUrl: 'https://propass.any/workspace'
  }
];

// Mocking "Real" DB Data for Simulation
export const MOCK_USERS: User[] = [
  {
    id: '6481177e-2820-4101-83c8-7c8702951711',
    email: 'alice@propass.any',
    traits: { email: 'alice@propass.any', firstName: 'Alice', lastName: 'Admin', phone: '+15550101' },
    state: 'active',
    created_at: '2023-10-01T10:00:00Z'
  },
  {
    id: '7291177e-2820-4101-83c8-7c8702951722',
    email: 'bob@gpass.any',
    traits: { email: 'bob@gpass.any', firstName: 'Bob', lastName: 'User', phone: '+15550102' },
    state: 'active',
    created_at: '2023-10-02T11:30:00Z'
  },
  {
    id: '8301177e-2820-4101-83c8-7c8702951733',
    email: 'carol@gpass.any',
    traits: { email: 'carol@gpass.any', firstName: 'Carol', lastName: 'Guest' },
    state: 'inactive',
    created_at: '2023-10-05T09:15:00Z'
  },
  {
    id: '9411177e-2820-4101-83c8-7c8702951744',
    email: 'admin@system.local',
    traits: { email: 'admin@system.local', firstName: 'Super', lastName: 'Admin' },
    state: 'active',
    created_at: '2023-09-01T00:00:00Z'
  }
];

export const KETO_TUPLES: RelationTuple[] = [
  // GPass Files
  { namespace: 'gpass_files', object: 'report-2024.pdf', relation: 'owner', subject_id: '6481177e-2820-4101-83c8-7c8702951711' }, // Alice
  { namespace: 'gpass_files', object: 'report-2024.pdf', relation: 'viewer', subject_id: '7291177e-2820-4101-83c8-7c8702951722' }, // Bob
  
  // ProPass Projects
  { namespace: 'propass_projects', object: 'project-skynet', relation: 'admin', subject_id: '6481177e-2820-4101-83c8-7c8702951711' }, // Alice
  
  // Groups / Inheritance
  { namespace: 'groups', object: 'engineers', relation: 'member', subject_id: '7291177e-2820-4101-83c8-7c8702951722' }, // Bob is engineer
  { namespace: 'propass_projects', object: 'project-skynet', relation: 'editor', subject_set: { namespace: 'groups', object: 'engineers', relation: 'member' } },
  
  // Global Roles
  { namespace: 'roles', object: 'super_admin', relation: 'member', subject_id: '9411177e-2820-4101-83c8-7c8702951744' },
];

export const PROJECT_STRUCTURE: FileNode[] = [
  {
    name: 'root',
    type: 'folder',
    children: [
      {
        name: 'be',
        type: 'folder',
        children: [
          {
            name: 'gpass',
            type: 'folder',
            children: [
              { name: 'main.go', type: 'file', language: 'go', content: `package main

import (
    "fmt"
    "net/http"
    "os"
)

func main() {
    port := os.Getenv("PORT")
    if port == "" {
        port = "8081"
    }

    http.HandleFunc("/api/gpass/greet", func(w http.ResponseWriter, r *http.Request) {
        // Authenticated user ID injected by Oathkeeper
        userID := r.Header.Get("X-User-Id")
        fmt.Fprintf(w, "Welcome to GPass, user %s!", userID)
    })

    http.ListenAndServe(":"+port, nil)
}` },
              { name: 'Dockerfile', type: 'file', language: 'dockerfile', content: `FROM golang:1.21-alpine
WORKDIR /app
COPY . .
RUN go build -o gpass
CMD ["./gpass"]` }
            ]
          },
          {
            name: 'propass',
            type: 'folder',
            children: [
              { name: 'main.go', type: 'file', language: 'go', content: `package main

import (
    "fmt"
    "net/http"
    "os"
)

func main() {
    port := os.Getenv("PORT")
    if port == "" {
        port = "8082"
    }

    http.HandleFunc("/api/propass/dashboard", func(w http.ResponseWriter, r *http.Request) {
        userID := r.Header.Get("X-User-Id")
        // Check database for specific ProPass data
        fmt.Fprintf(w, "ProPass Enterprise Dashboard for %s", userID)
    })

    http.ListenAndServe(":"+port, nil)
}` }
            ]
          }
        ]
      },
      {
        name: 'fe',
        type: 'folder',
        children: [
          { name: 'src', type: 'folder', children: [{ name: 'App.tsx', type: 'file', language: 'typescript', content: '// Frontend Source Code...' }] },
          { name: 'package.json', type: 'file', language: 'json', content: '{}' }
        ]
      },
      {
        name: 'ory-iam-stack',
        type: 'folder',
        children: [
          {
            name: 'config',
            type: 'folder',
            children: [
              {
                name: 'kratos',
                type: 'folder',
                children: [
                  { name: 'kratos.yml', type: 'file', language: 'yaml', content: `version: v0.13.0
dsn: postgres://kratos:secret@postgresd:5432/kratos?sslmode=disable&max_conns=20&max_idle_conns=4

serve:
  public:
    base_url: https://auth.ory-iam.com/
  admin:
    base_url: http://kratos:4434/

selfservice:
  methods:
    password:
      enabled: true
    code:
      enabled: true # For OTP
    oidc:
      enabled: true

identity:
  default_schema_id: default
  schemas:
    - id: default
      url: file:///etc/config/kratos/identity.schema.json` },
                  { name: 'identity.schema.json', type: 'file', language: 'json', content: `{
  "$id": "https://schemas.ory.sh/presets/kratos/identity.schema.json",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Person",
  "type": "object",
  "properties": {
    "traits": {
      "type": "object",
      "properties": {
        "email": {
          "type": "string",
          "format": "email",
          "title": "E-Mail",
          "minLength": 3,
          "ory.sh/kratos": {
            "credentials": {
              "password": { "identifier": true },
              "code": { "identifier": true, "via": "email" }
            },
            "recovery": { "via": "email" },
            "verification": { "via": "email" }
          }
        },
        "phone": {
          "type": "string",
          "title": "Phone",
          "ory.sh/kratos": {
            "credentials": {
              "code": { "identifier": true, "via": "sms" }
            }
          }
        },
        "firstName": { "type": "string" },
        "lastName": { "type": "string" }
      },
      "required": ["email"],
      "additionalProperties": false
    }
  }
}` }
                ]
              },
              {
                name: 'keto',
                type: 'folder',
                children: [
                  { name: 'keto.yml', type: 'file', language: 'yaml', content: `dsn: postgres://keto:secret@postgresd:5432/keto?sslmode=disable
namespaces:
  - name: gpass_files
  - name: propass_projects
  - name: groups
  - name: roles` },
                  { name: 'namespaces.ts', type: 'file', language: 'typescript', content: `import { Namespace, SubjectSet, Context } from "@ory/keto-namespace-types"

class User implements Namespace {}
class Group implements Namespace {
  related: {
    members: User[]
  }
}

class GPassFile implements Namespace {
  related: {
    parents: GPassFile[]
    owners: (User | Group)[]
    viewers: (User | Group)[]
  }

  permits = {
    view: (ctx: Context): boolean => 
      this.related.viewers.includes(ctx.subject) ||
      this.related.owners.includes(ctx.subject)
  }
}` }
                ]
              },
              {
                name: 'oathkeeper',
                type: 'folder',
                children: [
                  { name: 'access-rules.yml', type: 'file', language: 'yaml', content: `- id: "gpass-redirect"
  upstream:
    url: "http://gpass:8081"
  match:
    url: "https://auth.ory-iam.com/gpass/<.*>"
    methods: ["GET", "POST"]
  authenticators:
    - handler: cookie_session
  mutators:
    - handler: header
      config:
        headers:
          X-User-Id: "{{ print .Subject }}"
  authorizers:
    - handler: allow

- id: "propass-redirect"
  upstream:
    url: "http://propass:8082"
  match:
    url: "https://auth.ory-iam.com/propass/<.*>"
    methods: ["GET", "POST"]
  authenticators:
    - handler: cookie_session
  mutators:
    - handler: header
  authorizers:
    - handler: remote_json
      config:
        remote: http://keto:4466/check
        payload: |
          {
            "namespace": "propass_projects",
            "object": "global_access",
            "relation": "access",
            "subject": "{{ print .Subject }}"
          }` }
                ]
              }
            ]
          },
          {
            name: 'deploy',
            type: 'folder',
            children: [
              {
                name: 'compose',
                type: 'folder',
                children: [
                  { name: 'docker-compose.yml', type: 'file', language: 'yaml', content: `version: '3.9'
services:
  postgresd:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=ory
      - POSTGRES_PASSWORD=secret
      - POSTGRES_DB=ory
    volumes:
      - ./pg-data:/var/lib/postgresql/data

  kratos:
    image: oryd/kratos:v1.0.0
    depends_on:
      - postgresd
    environment:
      - DSN=postgres://ory:secret@postgresd:5432/kratos?sslmode=disable
    command: serve -c /etc/config/kratos/kratos.yml
    volumes:
      - ../config/kratos:/etc/config/kratos

  # ... Keto, Oathkeeper, Hydra services

  gpass:
    build: ../../be/gpass
    environment:
      - PORT=8081

  propass:
    build: ../../be/propass
    environment:
      - PORT=8082` }
                ]
              },
              { name: 'helm', type: 'folder', children: [{ name: 'values.yaml', type: 'file', language: 'yaml', content: '# Helm chart values...' }] }
            ]
          }
        ]
      },
      {
        name: 'scripts',
        type: 'folder',
        children: [
          { name: 'seed-db.sql', type: 'file', language: 'sql', content: `-- Seed initial users
INSERT INTO identities (id, traits) VALUES 
('6481177e...', '{"email": "alice@propass.any"}');` },
          { name: 'test-flows.sh', type: 'file', language: 'bash', content: `#!/bin/bash
# Test GPass Login
curl -X POST https://auth.ory-iam.com/self-service/login/api \
  -d '{"identifier":"alice@propass.any","password":"password123"}'` }
        ]
      },
      {
        name: 'doc',
        type: 'folder',
        children: [
          { name: 'architecture.md', type: 'file', language: 'markdown', content: '# System Architecture\n\nThis monorepo contains...' }
        ]
      }
    ]
  }
];
