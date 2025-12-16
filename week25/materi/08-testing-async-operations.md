# Testing Asynchronous Code

## 🤔 Apa itu Async Code?

**Analogi Sederhana:**
- **Synchronous** ⏱️ = Antri di warung, tunggu satu selesai baru next
- **Asynchronous** 🎯 = Order via app, lanjut kerja lain sambil tunggu delivery

Backend penuh dengan async operations:
- 💾 Database queries
- 🌐 HTTP API calls
- 📧 Send emails
- 📁 File operations

---

## 🎯 Testing Promises

### Basic Promise Testing

```typescript
describe('fetchUser', () => {
  it('should return user data', async () => {
    const user = await fetchUser(1);
    expect(user.id).toBe(1);
  });

  it('should throw error when user not found', async () => {
    await expect(fetchUser(999)).rejects.toThrow('User not found');
  });
});
```

### Promise Patterns

```typescript
// Pattern 1: async/await
it('should create user', async () => {
  const user = await service.createUser({ name: 'John' });
  expect(user).toBeDefined();
});

// Pattern 2: return promise
it('should create user', () => {
  return service.createUser({ name: 'John' }).then((user) => {
    expect(user).toBeDefined();
  });
});

// Pattern 3: done callback (legacy)
it('should create user', (done) => {
  service.createUser({ name: 'John' }).then((user) => {
    expect(user).toBeDefined();
    done();
  });
});
```

---

## ⏱️ Testing with Delays and Timeouts

### Testing setTimeout/setInterval

```typescript
describe('Delayed operations', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should execute callback after delay', () => {
    const callback = jest.fn();

    setTimeout(callback, 1000);

    // Fast-forward time
    jest.advanceTimersByTime(1000);

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should execute callback multiple times', () => {
    const callback = jest.fn();

    setInterval(callback, 1000);

    jest.advanceTimersByTime(3000);

    expect(callback).toHaveBeenCalledTimes(3);
  });
});
```

### Testing Retry Logic

```typescript
class ApiService {
  async fetchWithRetry(url: string, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await this.fetch(url);
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        await this.delay(1000 * (i + 1)); // Exponential backoff
      }
    }
  }
}

describe('ApiService retry logic', () => {
  it('should retry 3 times before failing', async () => {
    const mockFetch = jest
      .fn()
      .mockRejectedValueOnce(new Error('Fail 1'))
      .mockRejectedValueOnce(new Error('Fail 2'))
      .mockRejectedValueOnce(new Error('Fail 3'));

    service.fetch = mockFetch;

    await expect(service.fetchWithRetry('http://api.com')).rejects.toThrow('Fail 3');
    expect(mockFetch).toHaveBeenCalledTimes(3);
  });

  it('should succeed on second attempt', async () => {
    const mockFetch = jest
      .fn()
      .mockRejectedValueOnce(new Error('Fail'))
      .mockResolvedValueOnce({ data: 'success' });

    service.fetch = mockFetch;

    const result = await service.fetchWithRetry('http://api.com');

    expect(result).toEqual({ data: 'success' });
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });
});
```

---

## 🌐 Testing HTTP Requests

```typescript
import { HttpService } from '@nestjs/axios';
import { of, throwError } from 'rxjs';

describe('WeatherService', () => {
  let service: WeatherService;
  let httpService: jest.Mocked<HttpService>;

  beforeEach(() => {
    httpService = {
      get: jest.fn(),
    } as any;

    service = new WeatherService(httpService);
  });

  it('should fetch weather data successfully', async () => {
    const mockResponse = {
      data: {
        temperature: 25,
        condition: 'sunny',
      },
    };

    httpService.get.mockReturnValue(of(mockResponse) as any);

    const result = await service.getWeather('Jakarta');

    expect(result.temperature).toBe(25);
    expect(httpService.get).toHaveBeenCalledWith(
      expect.stringContaining('Jakarta'),
    );
  });

  it('should handle API errors', async () => {
    httpService.get.mockReturnValue(
      throwError(() => new Error('API unavailable')) as any,
    );

    await expect(service.getWeather('Jakarta')).rejects.toThrow('API unavailable');
  });
});
```

---

## 🔄 Testing Race Conditions

```typescript
describe('Concurrent operations', () => {
  it('should handle concurrent requests safely', async () => {
    const promises = [
      service.createUser({ email: 'user1@email.com' }),
      service.createUser({ email: 'user2@email.com' }),
      service.createUser({ email: 'user3@email.com' }),
    ];

    const results = await Promise.all(promises);

    expect(results).toHaveLength(3);
    expect(results[0].email).toBe('user1@email.com');
  });

  it('should handle partial failures', async () => {
    const mockCreate = jest
      .fn()
      .mockResolvedValueOnce({ id: 1 })
      .mockRejectedValueOnce(new Error('Failed'))
      .mockResolvedValueOnce({ id: 3 });

    repository.create = mockCreate;

    const results = await Promise.allSettled([
      service.createUser({ email: 'user1@email.com' }),
      service.createUser({ email: 'user2@email.com' }),
      service.createUser({ email: 'user3@email.com' }),
    ]);

    expect(results[0].status).toBe('fulfilled');
    expect(results[1].status).toBe('rejected');
    expect(results[2].status).toBe('fulfilled');
  });
});
```

---

## 📝 Summary

**Async Testing:**
- ✅ Always use `async/await` or return Promise
- ✅ Test success and error cases
- ✅ Use `rejects.toThrow()` for error assertions
- ✅ Mock async dependencies
- ✅ Test retry logic and timeouts

**Common Pitfalls:**
- ❌ Forgetting `await` = test passes prematurely
- ❌ Not returning Promise = test finishes before async completes
- ❌ Not testing error cases

---

## 🔗 Next Steps
- **Materi 09:** Test Fixtures and Factories
- **Materi 10:** Test Coverage and Quality
