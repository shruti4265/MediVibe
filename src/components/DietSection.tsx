import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Utensils, Activity, TrendingUp, AlertCircle } from "lucide-react";

interface BMIResult {
  bmi: number;
  category: string;
  plan: {
    breakfast: string;
    lunch: string;
    dinner: string;
    snacks: string;
    supplements: string;
    tip: string;
  };
}

const DietSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    height: "",
    weight: "",
    foodType: "",
  });
  const [result, setResult] = useState<BMIResult | null>(null);

  const calculateBMI = () => {
    const heightInMeters = parseFloat(formData.height) / 100;
    const weight = parseFloat(formData.weight);
    const bmi = weight / (heightInMeters * heightInMeters);
    
    let category = "";
    if (bmi < 18.5) category = "Underweight";
    else if (bmi < 25) category = "Normal";
    else if (bmi < 30) category = "Overweight";
    else category = "Obese";

    return { bmi: parseFloat(bmi.toFixed(1)), category };
  };

  const generatePlan = (bmi: number, category: string): BMIResult["plan"] => {
    const isVeg = formData.foodType === "vegetarian";
    
    const plans = {
      Underweight: {
        breakfast: isVeg ? "Banana smoothie with oats and nuts" : "Egg omelet with whole wheat toast",
        lunch: isVeg ? "Paneer butter masala with rice" : "Grilled chicken with quinoa",
        dinner: isVeg ? "Dal makhani with roti and salad" : "Fish curry with brown rice",
        snacks: "Mixed nuts, dates, and fruit salad",
        supplements: "Protein powder, Vitamin B12, Iron",
        tip: "Eat more frequently (5-6 small meals). Include protein with every meal.",
      },
      Normal: {
        breakfast: isVeg ? "Poha with vegetables and green tea" : "Scrambled eggs with whole wheat bread",
        lunch: isVeg ? "Mixed vegetable curry with chapati" : "Grilled chicken salad",
        dinner: isVeg ? "Rajma with brown rice" : "Baked fish with vegetables",
        snacks: "Fresh fruits, yogurt, and nuts",
        supplements: "Multivitamin, Omega-3, Vitamin D",
        tip: "Maintain balanced meals. Stay hydrated with 8-10 glasses of water daily.",
      },
      Overweight: {
        breakfast: isVeg ? "Vegetable upma with mint chutney" : "Boiled eggs with cucumber",
        lunch: isVeg ? "Salad bowl with chickpeas and olive oil" : "Grilled chicken with steamed vegetables",
        dinner: isVeg ? "Vegetable soup with multigrain bread" : "Fish tikka with salad",
        snacks: "Green tea, sprouts, cucumber sticks",
        supplements: "Vitamin D, Calcium, Fiber supplements",
        tip: "Avoid fried foods and sugary drinks. Exercise 30 minutes daily.",
      },
      Obese: {
        breakfast: isVeg ? "Sprout salad with lemon" : "Boiled eggs with tomatoes",
        lunch: isVeg ? "Clear vegetable soup with quinoa" : "Grilled lean meat with greens",
        dinner: isVeg ? "Stir-fried vegetables with brown rice" : "Baked fish with broccoli",
        snacks: "Herbal tea, carrots, and celery sticks",
        supplements: "Omega-3, Vitamin D, Probiotics",
        tip: "Consult a nutritionist. Focus on portion control and regular exercise.",
      },
    };

    return plans[category as keyof typeof plans];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { bmi, category } = calculateBMI();
    const plan = generatePlan(bmi, category);
    setResult({ bmi, category, plan });
  };

  if (result) {
    return (
      <div className="p-6">
        <Card className="max-w-3xl mx-auto p-8 bg-gradient-to-br from-purple-50 to-pink-50">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-primary mb-2">Your Personalized Diet Plan</h2>
            <p className="text-muted-foreground">for {formData.name}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <Card className="p-4 bg-white">
              <div className="flex items-center gap-3">
                <Activity className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">BMI Score</p>
                  <p className="text-2xl font-bold">{result.bmi}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 bg-white">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="text-2xl font-bold">{result.category}</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                <Utensils className="h-5 w-5 text-primary" /> Daily Meal Plan
              </h3>
              <div className="space-y-2">
                <p><strong>Breakfast:</strong> {result.plan.breakfast}</p>
                <p><strong>Lunch:</strong> {result.plan.lunch}</p>
                <p><strong>Dinner:</strong> {result.plan.dinner}</p>
                <p><strong>Snacks:</strong> {result.plan.snacks}</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Recommended Supplements</h3>
              <p>{result.plan.supplements}</p>
            </div>

            <div className="bg-primary/10 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-primary" /> Pro Tip
              </h3>
              <p>{result.plan.tip}</p>
            </div>
          </div>

          <Button
            onClick={() => setResult(null)}
            className="w-full mt-6 bg-gradient-to-r from-purple-500 to-pink-500"
          >
            Calculate Again
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-primary">Diet Plan Generator 🍎</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="mt-1"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              required
              className="mt-1"
              min="1"
              max="120"
            />
          </div>
          <div>
            <Label>Gender</Label>
            <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="height">Height (cm)</Label>
            <Input
              id="height"
              type="number"
              value={formData.height}
              onChange={(e) => setFormData({ ...formData, height: e.target.value })}
              required
              className="mt-1"
              min="50"
              max="250"
            />
          </div>
          <div>
            <Label htmlFor="weight">Weight (kg)</Label>
            <Input
              id="weight"
              type="number"
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              required
              className="mt-1"
              min="20"
              max="300"
            />
          </div>
        </div>

        <div>
          <Label>Food Type</Label>
          <Select value={formData.foodType} onValueChange={(value) => setFormData({ ...formData, foodType: value })}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select food preference" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vegetarian">Vegetarian</SelectItem>
              <SelectItem value="non-vegetarian">Non-Vegetarian</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
        >
          Generate Plan
        </Button>
      </form>
    </div>
  );
};

export default DietSection;