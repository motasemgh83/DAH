const Roles = {
  SUPERADMIN: 'SUPERADMIN',
  MANAGER: 'MANAGER',
  SUPERVISOR: 'SUPERVISOR',
  TECHNICIAN: 'TECHNICIAN'
};

const RequestStatus = {
  NEW: 'NEW',
  AWAITING_APPROVAL: 'AWAITING_APPROVAL',
  APPROVED: 'APPROVED',
  IN_PROGRESS: 'IN_PROGRESS',
  ON_HOLD: 'ON_HOLD',
  COMPLETED: 'COMPLETED',
  REOPENED: 'REOPENED',
  CANCELLED: 'CANCELLED'
};

const WorkOrderStatus = {
  OPEN: 'OPEN',
  SCHEDULED: 'SCHEDULED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CLOSED: 'CLOSED'
};

const permissionsByRole = {
  SUPERADMIN: ['*'],
  MANAGER: [
    'dashboard:view', 'requests:view', 'requests:create', 'requests:approve', 'requests:reopen',
    'workorders:view', 'workorders:create', 'workorders:schedule', 'assets:view',
    'inventory:view', 'inventory:update', 'reports:view', 'settings:view', 'settings:update',
    'users:view', 'sla:view', 'escalation:view', 'comments:create', 'attachments:create'
  ],
  SUPERVISOR: [
    'dashboard:view', 'requests:view', 'requests:create', 'requests:approve', 'requests:reopen',
    'workorders:view', 'workorders:create', 'workorders:schedule', 'assets:view', 'inventory:view',
    'reports:view', 'users:view', 'comments:create', 'attachments:create'
  ],
  TECHNICIAN: [
    'dashboard:view', 'requests:view', 'workorders:view', 'workorders:update-self',
    'comments:create', 'attachments:create'
  ]
};

module.exports = { Roles, RequestStatus, WorkOrderStatus, permissionsByRole };
