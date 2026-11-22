export const PERMISSIONS = {
  PROFILE_READ: 'profile:read',
  PROFILE_UPDATE: 'profile:update',

  USERS_READ: 'users:read',
  USERS_UPDATE: 'users:update',
  USERS_DELETE: 'users:delete',

  ROLES_READ: 'roles:read',
  ROLES_ASSIGN: 'roles:assign',

  SESSIONS_READ: 'sessions:read',
  SESSIONS_REVOKE: 'sessions:revoke',
} as const;

export type PermissionCode = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export interface PermissionDefinition {
  code: PermissionCode;
  description: string;
}

export const PERMISSION_CATALOG: PermissionDefinition[] = [
  {
    code: PERMISSIONS.PROFILE_READ,
    description: 'Read own profile',
  },
  {
    code: PERMISSIONS.PROFILE_UPDATE,
    description: 'Update own profile',
  },
  {
    code: PERMISSIONS.USERS_READ,
    description: 'Read users',
  },
  {
    code: PERMISSIONS.USERS_UPDATE,
    description: 'Update users',
  },
  {
    code: PERMISSIONS.USERS_DELETE,
    description: 'Delete users',
  },
  {
    code: PERMISSIONS.ROLES_READ,
    description: 'Read roles and user assignments',
  },
  {
    code: PERMISSIONS.ROLES_ASSIGN,
    description: 'Assign and remove roles',
  },
  {
    code: PERMISSIONS.SESSIONS_READ,
    description: 'Read sessions',
  },
  {
    code: PERMISSIONS.SESSIONS_REVOKE,
    description: 'Revoke sessions',
  },
];

export const SYSTEM_ROLES = {
  USER: 'user',
  MODERATOR: 'moderator',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin',
} as const;

export type SystemRole = (typeof SYSTEM_ROLES)[keyof typeof SYSTEM_ROLES];

export const DEFAULT_ROLE_PERMISSIONS: Record<SystemRole, PermissionCode[]> = {
  user: [
    PERMISSIONS.PROFILE_READ,
    PERMISSIONS.PROFILE_UPDATE,
    PERMISSIONS.SESSIONS_READ,
    PERMISSIONS.SESSIONS_REVOKE,
  ],

  moderator: [PERMISSIONS.PROFILE_READ, PERMISSIONS.USERS_READ],

  admin: [
    PERMISSIONS.PROFILE_READ,
    PERMISSIONS.PROFILE_UPDATE,
    PERMISSIONS.USERS_READ,
    PERMISSIONS.USERS_UPDATE,
    PERMISSIONS.USERS_DELETE,
    PERMISSIONS.ROLES_READ,
    PERMISSIONS.ROLES_ASSIGN,
    PERMISSIONS.SESSIONS_READ,
    PERMISSIONS.SESSIONS_REVOKE,
  ],

  super_admin: PERMISSION_CATALOG.map((item) => item.code),
};
