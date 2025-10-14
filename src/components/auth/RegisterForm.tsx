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
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const RegisterForm = () => {
  const initialState = { email: "", password: "", confirmPassword: "" };
  const [registerData, setRegisterData] = useState(initialState);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { isLoading, register } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    if (errors[id as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [id]: "",
      }));
    }
    setRegisterData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): string => {
    if (!password) return "Пароль обязателен";
    if (password.length < 8)
      return "Пароль должен содержать минимум 8 символов";
    if (!/(?=.*[a-z])/.test(password))
      return "Пароль должен содержать хотя бы одну строчную букву";
    if (!/(?=.*[A-Z])/.test(password))
      return "Пароль должен содержать хотя бы одну заглавную букву";
    if (!/(?=.*\d)/.test(password))
      return "Пароль должен содержать хотя бы одну цифру";
    if (!/(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/.test(password))
      return "Пароль должен содержать хотя бы один специальный символ";
    return "";
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = { email: "", password: "", confirmPassword: "" };

    // Валидация email
    if (!registerData.email || !validateEmail(registerData.email)) {
      newErrors.email = "Введите корректный email";
    }

    // Валидация пароля
    const passwordError = validatePassword(registerData.password);
    if (passwordError) {
      newErrors.password = passwordError;
    }

    // Валидация подтверждения пароля
    if (!registerData.confirmPassword) {
      newErrors.confirmPassword = "Подтвердите пароль";
    } else if (registerData.confirmPassword !== registerData.password) {
      newErrors.confirmPassword = "Пароли не совпадают";
    }

    // Если есть ошибки - показываем их и прерываем регистрацию
    if (newErrors.email || newErrors.password || newErrors.confirmPassword) {
      setErrors(newErrors);
      return;
    }

    console.log("Данные для регистрации:", registerData);
    register(registerData.email, registerData.password);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <>
      <Card className="w-full max-w-md shadow-none lg:bg-sch-blue-ultra/30 text-white border-0 font-news">
        <CardHeader>
          <CardTitle className="text-center uppercase text-xl">
            Регистрация в системе
          </CardTitle>
        </CardHeader>
        <CardContent className="">
          <form onSubmit={handleRegister}>
            <div className="flex flex-col gap-5">
              {/* Email поле */}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  className={`${errors.email && "border-red-600"} h-12`}
                  onChange={handleChange}
                  value={registerData.email}
                />
                {errors.email && (
                  <span className="text-red-500 text-sm">{errors.email}</span>
                )}
              </div>

              {/* Пароль поле */}
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Пароль</Label>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Пароль"
                    onChange={handleChange}
                    value={registerData.password}
                    className={`${errors.password && "border-red-600"} h-12 pr-10`}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <span className="text-red-500 text-sm">
                    {errors.password}
                  </span>
                )}
              </div>

              {/* Подтверждение пароля поле */}
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Повторите пароль</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    placeholder="Повторите пароль"
                    onChange={handleChange}
                    value={registerData.confirmPassword}
                    className={`${errors.confirmPassword && "border-red-600"} h-12 pr-10`}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={toggleConfirmPasswordVisibility}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <span className="text-red-500 text-sm">
                    {errors.confirmPassword}
                  </span>
                )}
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button
            disabled={
              !!errors.email ||
              !!errors.password ||
              !!errors.confirmPassword ||
              isLoading
            }
            onClick={handleRegister}
            type="submit"
            className="w-full bg-sch-green-light cursor-pointer h-10 text-md"
          >
            {isLoading ? "Отправка" : "Зарегистрироваться"}
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default RegisterForm;
