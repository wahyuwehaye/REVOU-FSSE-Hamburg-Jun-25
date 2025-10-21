import "@testing-library/jest-dom/extend-expect";
import { server } from "@/tests/server";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
