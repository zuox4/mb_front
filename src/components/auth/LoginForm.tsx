import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/auth";
import { Label } from "@radix-ui/react-label";
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom"; // Добавь этот импорт
import CorrectGoogleButton from "./GoogleLoginButton";

const LoginForm = () => {
  const initialState = { email: "", password: "" };
  const [loginData, setLoginData] = useState(initialState);
  const [errors, setErrors] = useState({ email: "", password: "" });
  const { isLoading, login, isAuthenticated } = useAuth();
  const navigate = useNavigate(); // Хук для навигации

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    if (errors[id as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [id]: "",
      }));
    }
    setLoginData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = { email: "", password: "" };
    if (!loginData.email) newErrors.email = "Email обязателен";
    if (!loginData.password) newErrors.password = "Пароль обязателен";

    if (newErrors.email || newErrors.password) {
      setErrors(newErrors);
      return;
    }
    try {
      await login(loginData.email, loginData.password);
      navigate("/welcome");
    } catch (error) {
      console.log("Ошибка авторизации:", error);
      // Ошибка уже обработана в store, здесь можно добавить дополнительную логику
    }
  };
  if (isAuthenticated) return <Navigate to={"/"} />;
  return (
    <>
      <Card className="w-full max-w-md shadow-none lg:bg-sch-blue-ultra/50  text-white border-0 font-news">
        <CardHeader>
          <CardTitle className="text-center uppercase text-xl">
            Войти в аккаунт
          </CardTitle>
        </CardHeader>
        <CardContent className="">
          <form onSubmit={handleLogin}>
            {" "}
            {/* Добавь onSubmit к форме */}
            <div className="flex flex-col gap-5">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  className={`${errors.email && "border-red-600"} h-12`}
                  onChange={handleChange}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    to={"/forgot-password"}
                    className="ml-auto inline-block text-sm underline-offset-4 underline hover:underline"
                  >
                    Забыли пароль?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  placeholder="Пароль"
                  onChange={handleChange}
                  className={`${errors.password && "border-red-600"} h-12`}
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button
            disabled={!!errors.email || !!errors.password || isLoading}
            onClick={handleLogin}
            type="submit"
            className="w-full bg-sch-green-light cursor-pointer h-10 text-md"
          >
            {isLoading ? "Отправка" : "Войти"}
          </Button>
          <CorrectGoogleButton />
        </CardFooter>
      </Card>
    </>
  );
};

export default LoginForm;
