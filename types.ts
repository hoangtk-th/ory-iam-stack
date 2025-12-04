export interface User {
  id: string;
  email: string; // primary identifier for many
  phone?: string; // for OTP
  traits: {
    firstName?: string;
    lastName?: string;
    email: string;
    phone?: string;
  };
  metadata_public?: any;
  metadata_admin?: any;
  state: 'active' | 'inactive';
  created_at: string;
}

export interface RelationTuple {
  namespace: string;
  object: string;
  relation: string;
  subject_id?: string;
  subject_set?: {
    namespace: string;
    object: string;
    relation: string;
  };
}

export interface AppConfig {
  id: string;
  name: string;
  description: string;
  domain: string;
  themeColor: string;
  redirectUrl: string;
}

export enum LoginMethod {
  PASSWORD = 'password',
  OTP = 'otp', // Phone
  OIDC = 'oidc'
}

export interface FileNode {
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  content?: string;
  language?: string;
}

export interface AuditLog {
  id: string;
  time: string;
  action: string;
  actor: string;
  target: string;
  status: 'success' | 'failure';
  context?: string;
}