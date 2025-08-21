// Simple rate limiting utility
class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private maxRequests: number;
  private windowMs: number;

  constructor(maxRequests: number = 10, windowMs: number = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  canMakeRequest(key: string): boolean {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    
    if (!this.requests.has(key)) {
      this.requests.set(key, [now]);
      return true;
    }

    const requestTimes = this.requests.get(key)!;
    const recentRequests = requestTimes.filter(time => time > windowStart);
    
    if (recentRequests.length >= this.maxRequests) {
      return false;
    }

    recentRequests.push(now);
    this.requests.set(key, recentRequests);
    return true;
  }

  clearOldRequests(): void {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    
    for (const [key, requestTimes] of this.requests.entries()) {
      const recentRequests = requestTimes.filter(time => time > windowStart);
      if (recentRequests.length === 0) {
        this.requests.delete(key);
      } else {
        this.requests.set(key, recentRequests);
      }
    }
  }
}

// Create rate limiters for different operations
export const handleCheckLimiter = new RateLimiter(5, 60000); // 5 requests per minute for handle checks
export const signupLimiter = new RateLimiter(3, 300000); // 3 signups per 5 minutes
export const profileUpdateLimiter = new RateLimiter(10, 60000); // 10 updates per minute

// Clean up old requests every minute
setInterval(() => {
  handleCheckLimiter.clearOldRequests();
  signupLimiter.clearOldRequests();
  profileUpdateLimiter.clearOldRequests();
}, 60000);
