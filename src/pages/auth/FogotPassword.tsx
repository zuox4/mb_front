import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { publicApi } from "@/services/api/api";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const FogotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setEmail(value);
  };
  const handleClick = async () => {
    alert(email);
    const res = await publicApi.post("/auth/forgot-password", { email: email });
    console.log(res.data);
    toast(res.data.message);
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col gap-4 items-center pt-50">
      <div className=" flex flex-col max-w-80 w-80 gap-6">
        <h1 className="text-center text-xl text-white">
          Восcтановление пароля
        </h1>
        <Input
          className="border-white/50 placeholder:text-white/50 text-white"
          value={email}
          id="email"
          type="email"
          placeholder="m@example.com"
          required
          onChange={handleChange}
        />
      </div>
      <Button className="bg-sch-green-light text-white" onClick={handleClick}>
        Восстановить пароль
      </Button>
      <Link to={"/login"} className="text-white underline">
        На страницу входа
      </Link>
    </div>
  );
};

export default FogotPassword;
