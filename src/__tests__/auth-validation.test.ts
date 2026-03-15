/**
 * Tests para los esquemas de validación de autenticación.
 * Verifica que los formularios de login y registro validen correctamente.
 */
import { describe, it, expect } from "vitest";
import { loginSchema, registroSchema } from "@/lib/validations/auth";

describe("loginSchema", () => {
  it("acepta datos válidos", () => {
    const result = loginSchema.safeParse({
      email: "test@email.com",
      password: "123456",
    });
    expect(result.success).toBe(true);
  });

  it("rechaza email inválido", () => {
    const result = loginSchema.safeParse({
      email: "no-es-email",
      password: "123456",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("email");
    }
  });

  it("rechaza contraseña vacía", () => {
    const result = loginSchema.safeParse({
      email: "test@email.com",
      password: "",
    });
    expect(result.success).toBe(false);
  });
});

describe("registroSchema", () => {
  it("acepta datos válidos de profesor", () => {
    const result = registroSchema.safeParse({
      name: "Juan Pérez",
      email: "juan@email.com",
      password: "123456",
      confirmPassword: "123456",
      role: "profesor",
    });
    expect(result.success).toBe(true);
  });

  it("acepta datos válidos de alumno con campos extra", () => {
    const result = registroSchema.safeParse({
      name: "María López",
      email: "maria@email.com",
      password: "123456",
      confirmPassword: "123456",
      role: "alumno",
      category: "5ta",
      branch: "Dama",
      zone: "Zona Sur",
    });
    expect(result.success).toBe(true);
  });

  it("rechaza si las contraseñas no coinciden", () => {
    const result = registroSchema.safeParse({
      name: "Test",
      email: "test@email.com",
      password: "123456",
      confirmPassword: "654321",
      role: "profesor",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("confirmPassword");
    }
  });

  it("rechaza nombre demasiado corto", () => {
    const result = registroSchema.safeParse({
      name: "J",
      email: "test@email.com",
      password: "123456",
      confirmPassword: "123456",
      role: "alumno",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("name");
    }
  });

  it("rechaza contraseña menor a 6 caracteres", () => {
    const result = registroSchema.safeParse({
      name: "Test User",
      email: "test@email.com",
      password: "123",
      confirmPassword: "123",
      role: "profesor",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("password");
    }
  });

  it("rechaza rol inválido", () => {
    const result = registroSchema.safeParse({
      name: "Test User",
      email: "test@email.com",
      password: "123456",
      confirmPassword: "123456",
      role: "admin",
    });
    expect(result.success).toBe(false);
  });
});
