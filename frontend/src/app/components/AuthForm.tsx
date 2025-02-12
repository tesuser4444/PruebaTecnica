"use client";

import { useState } from "react";
import axios from "axios";
import { ApiResponse } from "../interfaces/api.interface";
import { RegisterUserRequest } from "../interfaces/register.interface";
import { toast } from 'sonner';
import { z } from 'zod';
import { saveToken } from "../lib/auth";

interface AuthFormProps {
  isLogin: boolean;
}

// Define Zod schemas
const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z
  .string()
  .min(8, { message: "Password must be at least 8 characters long" })
  .regex(/[A-Z]/, { message: "Password must include at least one uppercase letter" })
  .regex(/[a-z]/, { message: "Password must include at least one lowercase letter" })
  .regex(/[0-9]/, { message: "Password must include at least one number" }),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
  .string()
  .min(8, { message: "Password must be at least 8 characters long" })
  .regex(/[A-Z]/, { message: "Password must include at least one uppercase letter" })
  .regex(/[a-z]/, { message: "Password must include at least one lowercase letter" })
  .regex(/[0-9]/, { message: "Password must include at least one number" }),
});

export default function AuthForm({ isLogin }: AuthFormProps) {

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear the error for the field being edited
    setErrors({ ...errors, [e.target.name]: '' });
  };

  // Function to check if the form is valid
  const isFormValid = () => {
    const schema = isLogin ? loginSchema : registerSchema;
    const validationResult = schema.safeParse(formData);
    return validationResult.success;
  };

  const authUser = async (uri: string, formData: RegisterUserRequest): Promise<ApiResponse> => {
    const { data } = await axios.post<ApiResponse>(uri, formData);
    return data;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const schema = isLogin ? loginSchema : registerSchema;
      const validationResult = schema.safeParse(formData);

      if (!validationResult.success) {
        const validationErrors: { [key: string]: string[] } = validationResult.error.flatten().fieldErrors;
        const formattedErrors: { [key: string]: string } = {};
        for (const key in validationErrors) {
          formattedErrors[key] = validationErrors[key]?.join(', ') || '';
        }
        setErrors(formattedErrors);
        return;
      }

      const url = 'http://localhost:3000';
      const uri = isLogin ? url + "/login" : url + "/register";
      const response = await authUser(uri, formData);

      if ('message' in response) {
        toast.success(response.message);
        if (isLogin) {
          if(response?.token  === undefined){
            throw new Error("Token not found");
          }
          saveToken(response.token)
          window.location.href = '/dashboard';
        }else{
          setFormData({
            email: "",
            password: "",
            name: "",
          });
          setErrors({}); // Clear any existing errors
        }
      } else if ('error' in response) {
        toast.error(response.error.message || "Validation error occurred");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.error?.message || "Something went wrong");
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!isLogin && (
        <div>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded text-gray-900"
            required
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>
      )}
      <div>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 border rounded text-gray-900"
          required
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
      </div>
      <div>
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-2 border rounded text-gray-900"
          required
        />
        <p className="text-red-500 text-sm">Minmium 8 characters it must have at least one special character, one uppercase, one lowercase</p>
        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
      </div>
      <button
        type="submit"
        className={`w-full py-2 text-white rounded ${
          isFormValid() ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-400 cursor-not-allowed"
        }`}
        disabled={!isFormValid()}
      >
        {isLogin ? "Login" : "Register"}
      </button>
    </form>
  );
}