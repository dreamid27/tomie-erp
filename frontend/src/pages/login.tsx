import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = (userType: "customer" | "sales") => {
    // Here you would typically handle the login logic
    // For now, we'll just navigate to the appropriate page
    if (userType === "customer") {
      navigate("/customer-dashboard"); // Update this route as needed
    } else {
      navigate("/sales-dashboard"); // Update this route as needed
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Welcome to TOMIE ERP
          </CardTitle>
          <CardDescription className="text-center">
            Please select your login type
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={() => handleLogin("customer")}
            className="w-full h-12 text-lg"
            variant="outline"
          >
            Login as Customer
          </Button>
          <Button
            onClick={() => handleLogin("sales")}
            className="w-full h-12 text-lg"
          >
            Login as Sales
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
