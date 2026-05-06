/**
 * Stage 6 — Priority Inbox Algorithm
 * 
 * Finds the top-n most important unread notifications based on:
 * - Type weight: Placement (3) > Result (2) > Event (1)
 * - Recency: More recent notifications rank higher within the same type
 * 
 * Uses a max-heap (priority queue) for efficient O(n log k) performance.
 */

class MaxHeap {
  constructor() {
    this.heap = [];
  }

  push(item) {
    this.heap.push(item);
    this.bubbleUp(this.heap.length - 1);
  }

  pop() {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop();

    const top = this.heap[0];
    this.heap[0] = this.heap.pop();
    this.bubbleDown(0);
    return top;
  }

  peek() {
    return this.heap[0] || null;
  }

  size() {
    return this.heap.length;
  }

  bubbleUp(index) {
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      if (this.heap[index].score <= this.heap[parentIndex].score) break;
      [this.heap[index], this.heap[parentIndex]] = [this.heap[parentIndex], this.heap[index]];
      index = parentIndex;
    }
  }

  bubbleDown(index) {
    const length = this.heap.length;
    while (true) {
      let largest = index;
      const left = 2 * index + 1;
      const right = 2 * index + 2;

      if (left < length && this.heap[left].score > this.heap[largest].score) {
        largest = left;
      }
      if (right < length && this.heap[right].score > this.heap[largest].score) {
        largest = right;
      }
      if (largest === index) break;

      [this.heap[index], this.heap[largest]] = [this.heap[largest], this.heap[index]];
      index = largest;
    }
  }
}

/**
 * Calculate priority score for a notification.
 * Formula: weight * 1,000,000,000 + unix_timestamp
 * This ensures type weight dominates, but recency matters within the same type.
 */
function calculateScore(notification) {
  const weights = {
    Placement: 3,
    Result: 2,
    Event: 1,
  };

  const weight = weights[notification.Type] || 1;
  const timestamp = new Date(notification.Timestamp).getTime();

  return weight * 1_000_000_000 + timestamp;
}

/**
 * Get top-n priority notifications from a list.
 * @param {Array} notifications - Array of notification objects
 * @param {number} n - Number of top notifications to return
 * @returns {Array} Top-n notifications sorted by priority
 */
function getTopNPriorityNotifications(notifications, n = 10) {
  const heap = new MaxHeap();

  // Add score to each notification and push to heap
  for (const notif of notifications) {
    const scored = {
      ...notif,
      score: calculateScore(notif),
    };
    heap.push(scored);
  }

  // Extract top-n
  const result = [];
  for (let i = 0; i < n && heap.size() > 0; i++) {
    result.push(heap.pop());
  }

  return result;
}

/**
 * Maintain a rolling top-n as new notifications arrive.
 * This is more efficient for streaming scenarios.
 */
class PriorityInbox {
  constructor(maxSize = 10) {
    this.maxSize = maxSize;
    this.heap = new MaxHeap();
  }

  addNotification(notification) {
    const scored = {
      ...notification,
      score: calculateScore(notification),
    };

    if (this.heap.size() < this.maxSize) {
      this.heap.push(scored);
    } else {
      const minItem = this.heap.peek();
      if (scored.score > minItem.score) {
        this.heap.pop();
        this.heap.push(scored);
      }
    }
  }

  getTopNotifications() {
    const result = [];
    const temp = [];

    // Extract all items
    while (this.heap.size() > 0) {
      const item = this.heap.pop();
      result.push(item);
      temp.push(item);
    }

    // Restore heap
    for (const item of temp) {
      this.heap.push(item);
    }

    return result;
  }
}

// Example usage
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    getTopNPriorityNotifications,
    PriorityInbox,
    calculateScore,
  };
}

// Browser usage example
if (typeof window !== "undefined") {
  window.PriorityInbox = {
    getTopNPriorityNotifications,
    PriorityInbox,
    calculateScore,
  };
}
