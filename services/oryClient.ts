import { MOCK_USERS, KETO_TUPLES } from './mockData';
import { User, RelationTuple } from '../types';

// This service simulates calling the backend which connects to Ory Kratos (Postgres) and Keto (Postgres)
// In a real app, this would use fetch() or @ory/client

export const OryClient = {
  // Kratos
  identity: {
    list: async (): Promise<User[]> => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return [...MOCK_USERS];
    },
    get: async (id: string): Promise<User | undefined> => {
      await new Promise(resolve => setTimeout(resolve, 300));
      return MOCK_USERS.find(u => u.id === id);
    }
  },

  // Keto
  permission: {
    listTuples: async (): Promise<RelationTuple[]> => {
      await new Promise(resolve => setTimeout(resolve, 600));
      return [...KETO_TUPLES];
    },
    check: async (namespace: string, object: string, relation: string, subjectId: string): Promise<boolean> => {
        // Logic to check tuple existence (simplified)
        return KETO_TUPLES.some(t => 
            t.namespace === namespace && 
            t.object === object && 
            t.relation === relation && 
            t.subject_id === subjectId
        );
    }
  }
};
