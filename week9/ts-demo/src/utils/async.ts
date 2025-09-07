// Async Programming
export const delay = (ms: number) => new Promise<void>(res => setTimeout(res, ms));

export async function getTodoTitle(id: number): Promise<string> {
  await delay(50);
  return `Todo #${id}`;
}
