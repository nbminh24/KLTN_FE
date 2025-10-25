// Order status state machine

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

// Valid status transitions
const STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: [], // Final state - no transitions
  cancelled: [], // Final state - no transitions
};

// Check if status transition is valid
export function canTransitionTo(currentStatus: OrderStatus, newStatus: OrderStatus): boolean {
  return STATUS_TRANSITIONS[currentStatus].includes(newStatus);
}

// Get allowed next statuses
export function getAllowedNextStatuses(currentStatus: OrderStatus): OrderStatus[] {
  return STATUS_TRANSITIONS[currentStatus];
}

// Get status color
export function getStatusColor(status: OrderStatus): string {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    case 'processing':
      return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'shipped':
      return 'bg-purple-100 text-purple-700 border-purple-200';
    case 'delivered':
      return 'bg-green-100 text-green-700 border-green-200';
    case 'cancelled':
      return 'bg-red-100 text-red-700 border-red-200';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
}

// Get status label
export function getStatusLabel(status: OrderStatus): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}
