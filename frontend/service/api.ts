export async function simulateHttp<T>(data: T, delay = 500): Promise<T> {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(data), delay);
  });
}
